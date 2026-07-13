<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\ReturnCase;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReturnOperationsService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, ReturnCase>
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');
        $type = (string) ($filters['type'] ?? '');

        return ReturnCase::query()
            ->with([
                'order:id,number,total,payment_status',
                'customer:id,name,email',
                'orderItem:id,product_name,sku,quantity,total',
            ])
            ->when($search !== '', fn (Builder $query): Builder => $query->where(
                fn (Builder $query): Builder => $query
                    ->where('number', 'like', "%{$search}%")
                    ->orWhere('tracking_number', 'like', "%{$search}%")
                    ->orWhereHas('order', fn (Builder $query): Builder => $query->where('number', 'like', "%{$search}%"))
                    ->orWhereHas('customer', fn (Builder $query): Builder => $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%"))
            ))
            ->when(in_array($status, ReturnCase::statuses(), true), fn (Builder $query): Builder => $query->where('status', $status))
            ->when(in_array($type, ['return', 'rto'], true), fn (Builder $query): Builder => $query->where('type', $type))
            ->latest('requested_at')
            ->paginate(15)
            ->withQueryString();
    }

    /** @return array<string, int|float> */
    public function counts(): array
    {
        $row = ReturnCase::query()
            ->selectRaw('COUNT(*) total')
            ->selectRaw("SUM(CASE WHEN status IN ('requested','approved') THEN 1 ELSE 0 END) awaiting_action")
            ->selectRaw("SUM(CASE WHEN status IN ('pickup_scheduled','in_transit') THEN 1 ELSE 0 END) reverse_transit")
            ->selectRaw("SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) refunded")
            ->selectRaw("COALESCE(SUM(CASE WHEN status = 'refunded' THEN refund_amount ELSE 0 END), 0) refund_value")
            ->toBase()
            ->firstOrFail();

        return [
            'total' => (int) $row->total,
            'awaiting_action' => (int) $row->awaiting_action,
            'reverse_transit' => (int) $row->reverse_transit,
            'refunded' => (int) $row->refunded,
            'refund_value' => (float) $row->refund_value,
        ];
    }

    /** @param array<string, mixed> $data */
    public function create(array $data): ReturnCase
    {
        return DB::transaction(function () use ($data): ReturnCase {
            $orderId = (int) $data['order_id'];
            $order = Order::query()->with('items')->lockForUpdate()->findOrFail($orderId);
            $orderItemId = $data['order_item_id'] ?? null;
            $item = $orderItemId ? $order->items->firstWhere('id', $orderItemId) : null;
            $requestedQuantity = (int) $data['requested_quantity'];

            if ($orderItemId && ! $item) {
                throw ValidationException::withMessages([
                    'order_item_id' => 'The selected item does not belong to this order.',
                ]);
            }

            if (! $item && $requestedQuantity !== 1) {
                throw ValidationException::withMessages([
                    'requested_quantity' => 'Entire-order returns must use a quantity of one.',
                ]);
            }

            if ($item) {
                $quantityAlreadyRequested = (int) ReturnCase::query()
                    ->where('order_item_id', $item->id)
                    ->where('status', '!=', 'rejected')
                    ->sum('requested_quantity');
                $remainingQuantity = $item->quantity - $quantityAlreadyRequested;

                if ($requestedQuantity > $remainingQuantity) {
                    throw ValidationException::withMessages([
                        'requested_quantity' => 'The return quantity exceeds the quantity still eligible for return.',
                    ]);
                }
            }

            $maximumRefund = $item
                ? round(((float) $item->total / max($item->quantity, 1)) * $requestedQuantity, 2)
                : (float) $order->total;

            if ((float) $data['refund_amount'] > $maximumRefund) {
                throw ValidationException::withMessages([
                    'refund_amount' => 'The refund exceeds the value of the requested quantity.',
                ]);
            }

            return ReturnCase::query()->create([
                ...$data,
                'customer_id' => $order->user_id,
                'number' => 'RET-'.now()->format('Ym').'-'.Str::upper(Str::random(8)),
                'requested_at' => now(),
            ]);
        });
    }

    /** @param array<string, mixed> $data */
    public function update(ReturnCase $returnCase, User $actor, array $data): ReturnCase
    {
        DB::transaction(function () use ($returnCase, $actor, $data): void {
            $locked = ReturnCase::query()
                ->with(['order.payment', 'order.shipment', 'orderItem.product'])
                ->lockForUpdate()
                ->findOrFail($returnCase->id);

            $this->validateTransition($locked, (string) $data['status']);
            $maximumRefund = $locked->order_item_id
                ? round(((float) $locked->orderItem->total / max($locked->orderItem->quantity, 1)) * $locked->requested_quantity, 2)
                : (float) $locked->order->total;

            if ((float) $data['refund_amount'] > $maximumRefund) {
                throw ValidationException::withMessages([
                    'refund_amount' => 'The refund exceeds the selected order value.',
                ]);
            }

            $statusChanged = $locked->status !== $data['status'];

            if ($statusChanged && $data['status'] === 'received' && $locked->orderItem?->product) {
                $locked->orderItem->product()->increment('stock', $locked->requested_quantity);
            }

            if ($statusChanged && $data['status'] === 'refunded') {
                $this->processRefund($locked, (float) $data['refund_amount']);
            }

            if ($statusChanged && $locked->type === 'rto' && $data['status'] === 'received') {
                $locked->order->shipment?->update(['status' => 'returned']);
                $locked->order()->update(['status' => Order::STATUS_CANCELLED]);
            }

            $locked->update([
                ...$data,
                'processed_by' => $actor->id,
                'approved_at' => $data['status'] === 'approved' ? now() : $locked->approved_at,
                'received_at' => $data['status'] === 'received' ? now() : $locked->received_at,
                'completed_at' => in_array($data['status'], ['refunded', 'rejected'], true) ? now() : null,
            ]);
        });

        return $returnCase->fresh([
            'order.payment',
            'order.shipment',
            'customer',
            'orderItem.product',
            'processor',
        ]);
    }

    private function validateTransition(ReturnCase $returnCase, string $nextStatus): void
    {
        $transitions = [
            'requested' => ['requested', 'approved', 'rejected'],
            'approved' => ['approved', 'pickup_scheduled', 'rejected'],
            'pickup_scheduled' => ['pickup_scheduled', 'in_transit'],
            'in_transit' => ['in_transit', 'received'],
            'received' => ['received', 'refunded'],
            'refunded' => ['refunded'],
            'rejected' => ['rejected'],
        ];

        if (! in_array($nextStatus, $transitions[$returnCase->status] ?? [], true)) {
            throw ValidationException::withMessages([
                'status' => "A return cannot move from {$returnCase->status} to {$nextStatus}.",
            ]);
        }
    }

    private function processRefund(ReturnCase $returnCase, float $refundAmount): void
    {
        $payment = $returnCase->order->payment;

        if (! $payment) {
            throw ValidationException::withMessages([
                'status' => 'This order has no payment record to refund.',
            ]);
        }

        $refundTotal = (float) $payment->refunded_amount + $refundAmount;

        if ($refundTotal > (float) $payment->amount) {
            throw ValidationException::withMessages([
                'refund_amount' => 'Total refunds would exceed the captured payment.',
            ]);
        }

        $isFullyRefunded = $refundTotal >= (float) $payment->amount;

        $payment->update([
            'refunded_amount' => $refundTotal,
            'status' => $isFullyRefunded ? 'refunded' : 'partially_refunded',
            'refunded_at' => now(),
        ]);

        if ($isFullyRefunded) {
            $returnCase->order()->update(['payment_status' => 'refunded']);
        }
    }
}
