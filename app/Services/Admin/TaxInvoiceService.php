<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\TaxInvoice;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TaxInvoiceService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, TaxInvoice>
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');
        $type = (string) ($filters['type'] ?? '');

        return TaxInvoice::query()
            ->with(['order:id,number', 'vendor:id,business_name'])
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('number', 'like', "%{$search}%")
                        ->orWhere('supplier_gstin', 'like', "%{$search}%")
                        ->orWhere('recipient_gstin', 'like', "%{$search}%")
                        ->orWhereHas('order', fn (Builder $query): Builder => $query->where('number', 'like', "%{$search}%"));
                });
            })
            ->when(in_array($status, TaxInvoice::statuses(), true), fn (Builder $query): Builder => $query->where('status', $status))
            ->when(in_array($type, ['invoice', 'credit_note'], true), fn (Builder $query): Builder => $query->where('type', $type))
            ->latest('issued_on')
            ->paginate(20)
            ->withQueryString();
    }

    /** @return array<string, int|float> */
    public function counts(): array
    {
        $row = TaxInvoice::query()
            ->selectRaw('COUNT(*) total')
            ->selectRaw("SUM(CASE WHEN type = 'invoice' AND status = 'issued' THEN 1 ELSE 0 END) issued")
            ->selectRaw("SUM(CASE WHEN type = 'credit_note' AND status != 'cancelled' THEN 1 ELSE 0 END) credit_notes")
            ->selectRaw("COALESCE(SUM(CASE WHEN status = 'issued' AND type = 'invoice' THEN cgst_amount + sgst_amount + igst_amount + cess_amount WHEN status = 'issued' AND type = 'credit_note' THEN -(cgst_amount + sgst_amount + igst_amount + cess_amount) ELSE 0 END), 0) tax_value")
            ->toBase()
            ->firstOrFail();

        return [
            'total' => (int) $row->total,
            'issued' => (int) $row->issued,
            'credit_notes' => (int) $row->credit_notes,
            'tax_value' => (float) $row->tax_value,
        ];
    }

    /** @param array<string, mixed> $data */
    public function create(array $data): TaxInvoice
    {
        return DB::transaction(function () use ($data): TaxInvoice {
            $order = Order::query()->with(['user', 'items'])->lockForUpdate()->findOrFail((int) $data['order_id']);
            $items = $order->items;

            if (! empty($data['vendor_id'])) {
                $items = $items->where('vendor_id', (int) $data['vendor_id']);
            }

            if ($items->isEmpty()) {
                throw ValidationException::withMessages(['vendor_id' => 'This order has no items for the selected supplier.']);
            }

            $parent = $this->parentInvoice($data, $order);
            $ratio = $this->creditRatio($data, $items->sum('total'), $parent);
            $issuedOn = Carbon::parse($data['issued_on']);
            $financialYear = $this->financialYear($issuedOn);

            $invoice = TaxInvoice::query()->create([
                ...$data,
                'number' => $this->nextNumber($financialYear, (string) $data['type']),
                'financial_year' => $financialYear,
                'recipient_name' => $order->user->name,
                'recipient_address' => $this->recipientAddress($order->shipping_address),
                'taxable_value' => 0,
                'cgst_amount' => 0,
                'sgst_amount' => 0,
                'igst_amount' => 0,
                'cess_amount' => 0,
                'total_amount' => 0,
            ]);

            $totals = array_fill_keys(['taxable_value', 'cgst_amount', 'sgst_amount', 'igst_amount', 'cess_amount', 'total_amount'], 0.0);

            foreach ($items as $item) {
                $line = $this->calculateLine((float) $item->total * $ratio, $data);

                $invoice->items()->create([
                    'order_item_id' => $item->id,
                    'description' => $item->product_name,
                    'hsn_code' => $data['hsn_code'],
                    'quantity' => max(1, (int) round($item->quantity * $ratio)),
                    ...$line,
                ]);

                foreach ($totals as $key => $value) {
                    $totals[$key] = $value + $line[$key];
                }
            }

            $invoice->update($totals);

            return $invoice->fresh(['order.user', 'vendor', 'parentInvoice', 'items', 'issuer']);
        });
    }

    /** @param array<string, mixed> $data */
    public function update(TaxInvoice $invoice, User $actor, array $data): TaxInvoice
    {
        $allowed = match ($invoice->status) {
            'draft' => ['draft', 'issued', 'cancelled'],
            'issued' => ['issued', 'cancelled'],
            default => ['cancelled'],
        };

        if (! in_array($data['status'], $allowed, true)) {
            throw ValidationException::withMessages(['status' => "Document cannot move from {$invoice->status} to {$data['status']}."]);
        }

        $invoice->update([
            ...$data,
            'issued_by' => $data['status'] === 'issued' ? $actor->id : $invoice->issued_by,
            'issued_at' => $data['status'] === 'issued' ? ($invoice->issued_at ?? now()) : $invoice->issued_at,
            'cancelled_at' => $data['status'] === 'cancelled' ? now() : null,
        ]);

        return $invoice->fresh(['order', 'vendor', 'items', 'issuer']);
    }

    /** @param array<string, mixed> $data */
    private function parentInvoice(array $data, Order $order): ?TaxInvoice
    {
        if ($data['type'] !== 'credit_note') {
            return null;
        }

        $parent = TaxInvoice::query()->lockForUpdate()->find((int) ($data['parent_invoice_id'] ?? 0));

        $vendorId = empty($data['vendor_id']) ? null : (int) $data['vendor_id'];

        if (! $parent || $parent->order_id !== $order->id || $parent->vendor_id !== $vendorId || $parent->status !== 'issued' || $parent->type !== 'invoice') {
            throw ValidationException::withMessages(['parent_invoice_id' => 'Select an issued invoice belonging to this order.']);
        }

        return $parent;
    }

    /** @param array<string, mixed> $data */
    private function creditRatio(array $data, float $gross, ?TaxInvoice $parent): float
    {
        if ($data['type'] !== 'credit_note' || ! $parent) {
            return 1;
        }

        $credited = (float) TaxInvoice::query()
            ->where('parent_invoice_id', $parent->id)
            ->where('status', '!=', 'cancelled')
            ->sum('total_amount');
        $remaining = max(0, (float) $parent->total_amount - $credited);
        $creditAmount = (float) $data['credit_amount'];

        if ($creditAmount > $remaining) {
            throw ValidationException::withMessages([
                'credit_amount' => 'The credit amount cannot exceed the remaining invoice value of Rs. '.number_format($remaining, 2).'.',
            ]);
        }

        return min(1, $creditAmount / max($gross, 0.01));
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array{taxable_value: float, gst_rate: float, cgst_amount: float, sgst_amount: float, igst_amount: float, cess_amount: float, total_amount: float}
     */
    private function calculateLine(float $gross, array $data): array
    {
        $lineGross = round($gross, 2);
        $taxRate = (float) $data['gst_rate'];
        $cessRate = (float) $data['cess_rate'];
        $taxable = $data['prices_include_tax']
            ? round($lineGross / (1 + (($taxRate + $cessRate) / 100)), 2)
            : $lineGross;
        $gst = round($taxable * $taxRate / 100, 2);
        $cess = round($taxable * $cessRate / 100, 2);
        $interstate = $data['supplier_state_code'] !== $data['place_of_supply_code'];
        $cgst = $interstate ? 0.0 : round($gst / 2, 2);
        $sgst = $interstate ? 0.0 : $gst - $cgst;
        $igst = $interstate ? $gst : 0.0;

        return [
            'taxable_value' => $taxable,
            'gst_rate' => $taxRate,
            'cgst_amount' => $cgst,
            'sgst_amount' => $sgst,
            'igst_amount' => $igst,
            'cess_amount' => $cess,
            'total_amount' => round($taxable + $gst + $cess, 2),
        ];
    }

    private function financialYear(Carbon $date): string
    {
        $start = $date->month >= 4 ? $date->year : $date->year - 1;

        return substr((string) $start, -2).'-'.substr((string) ($start + 1), -2);
    }

    private function recipientAddress(mixed $address): string
    {
        if (is_array($address)) {
            return collect($address)->filter()->implode(', ');
        }

        return is_string($address) ? $address : '';
    }

    private function nextNumber(string $financialYear, string $type): string
    {
        $sequence = TaxInvoice::query()
            ->where('financial_year', $financialYear)
            ->where('type', $type)
            ->lockForUpdate()
            ->count() + 1;

        return ($type === 'credit_note' ? 'CN' : 'INV').'/'.$financialYear.'/'.str_pad((string) $sequence, 6, '0', STR_PAD_LEFT);
    }
}
