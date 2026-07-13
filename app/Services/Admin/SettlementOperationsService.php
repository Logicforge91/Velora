<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ReturnCase;
use App\Models\Settlement;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SettlementOperationsService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, Settlement>
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');

        return Settlement::query()->with(['vendor:id,business_name,business_email', 'approver:id,name'])->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query->where('number', 'like', "%{$search}%")->orWhere('transaction_reference', 'like', "%{$search}%")->orWhereHas('vendor', fn (Builder $query): Builder => $query->where('business_name', 'like', "%{$search}%"))))->when(in_array($status, Settlement::statuses(), true), fn (Builder $query): Builder => $query->where('status', $status))->latest()->paginate(15)->withQueryString();
    }

    /** @return array<string, int|float> */
    public function counts(): array
    {
        $row = Settlement::query()->selectRaw('COUNT(*) total')->selectRaw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) pending")->selectRaw("SUM(CASE WHEN status IN ('approved','processing') THEN 1 ELSE 0 END) payable")->selectRaw("COALESCE(SUM(CASE WHEN status = 'paid' THEN net_amount ELSE 0 END), 0) paid_value")->toBase()->firstOrFail();

        return ['total' => (int) $row->total, 'pending' => (int) $row->pending, 'payable' => (int) $row->payable, 'paid_value' => (float) $row->paid_value];
    }

    /** @param array<string, mixed> $data */
    public function create(array $data): Settlement
    {
        return DB::transaction(function () use ($data): Settlement {
            $vendor = Vendor::query()->lockForUpdate()->findOrFail((int) $data['vendor_id']);
            if (Settlement::query()->where('vendor_id', $vendor->id)->whereDate('period_start', $data['period_start'])->whereDate('period_end', $data['period_end'])->exists()) {
                throw ValidationException::withMessages(['period_end' => 'A settlement already exists for this seller and period.']);
            }
            $items = OrderItem::query()->where('vendor_id', $vendor->id)->whereHas('order', fn (Builder $query): Builder => $query->where('status', Order::STATUS_DELIVERED)->whereBetween('placed_at', [$data['period_start'], $data['period_end'].' 23:59:59']));
            $gross = (float) (clone $items)->sum('total');
            $commission = (float) (clone $items)->sum('commission_amount');
            $refunds = (float) ReturnCase::query()->where('status', 'refunded')->whereBetween('completed_at', [$data['period_start'], $data['period_end'].' 23:59:59'])->whereHas('orderItem', fn (Builder $query): Builder => $query->where('vendor_id', $vendor->id))->sum('refund_amount');
            $net = $gross - $commission - (float) $data['shipping_fee'] - (float) $data['tax_withheld'] - $refunds + (float) $data['adjustments'];

            return Settlement::query()->create([...$data, 'number' => 'STL-'.now()->format('Ym').'-'.Str::upper(Str::random(8)), 'gross_sales' => $gross, 'commission_amount' => $commission, 'refund_deductions' => $refunds, 'net_amount' => $net]);
        });
    }

    /** @param array<string, mixed> $data */
    public function update(Settlement $settlement, User $actor, array $data): Settlement
    {
        $transitions = ['pending' => ['pending', 'approved', 'on_hold'], 'approved' => ['approved', 'processing', 'on_hold'], 'processing' => ['processing', 'paid', 'failed'], 'failed' => ['failed', 'processing', 'on_hold'], 'on_hold' => ['on_hold', 'approved'], 'paid' => ['paid']];
        if (! in_array($data['status'], $transitions[$settlement->status] ?? [], true)) {
            throw ValidationException::withMessages(['status' => "Settlement cannot move from {$settlement->status} to {$data['status']}."]);
        }
        if ($data['status'] === 'paid' && empty($data['transaction_reference'])) {
            throw ValidationException::withMessages(['transaction_reference' => 'A bank transaction reference is required before marking a settlement paid.']);
        }
        $settlement->update([...$data, 'approved_by' => $data['status'] === 'approved' ? $actor->id : $settlement->approved_by, 'approved_at' => $data['status'] === 'approved' ? now() : $settlement->approved_at, 'paid_at' => $data['status'] === 'paid' ? now() : null]);

        return $settlement->fresh(['vendor', 'approver']);
    }
}
