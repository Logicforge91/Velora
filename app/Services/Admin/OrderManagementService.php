<?php

namespace App\Services\Admin;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderManagementService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, Order>
     */
    public function getOrders(array $filters = []): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');
        $paymentStatus = (string) ($filters['payment_status'] ?? '');

        return Order::query()
            ->with(['user:id,name,email'])
            ->withCount('items')
            ->when($search !== '', fn (Builder $query): Builder => $query->where(
                fn (Builder $query): Builder => $query
                    ->where('number', 'like', "%{$search}%")
                    ->orWhereHas('user', fn (Builder $query): Builder => $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%"))
            ))
            ->when(in_array($status, Order::statuses(), true), fn (Builder $query): Builder => $query->where('status', $status))
            ->when(in_array($paymentStatus, ['pending', 'paid', 'failed', 'refunded'], true), fn (Builder $query): Builder => $query->where('payment_status', $paymentStatus))
            ->latest('placed_at')
            ->paginate(15)
            ->withQueryString();
    }

    /** @return array<string, int|float> */
    public function getCounts(): array
    {
        $counts = Order::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending', [Order::STATUS_PENDING])
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as processing', [Order::STATUS_PROCESSING])
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as shipped', [Order::STATUS_SHIPPED])
            ->selectRaw('COALESCE(SUM(CASE WHEN status != ? THEN total ELSE 0 END), 0) as revenue', [Order::STATUS_CANCELLED])
            ->toBase()
            ->firstOrFail();

        return [
            'total' => (int) $counts->total,
            'pending' => (int) $counts->pending,
            'processing' => (int) $counts->processing,
            'shipped' => (int) $counts->shipped,
            'revenue' => (float) $counts->revenue,
        ];
    }

    public function updateStatus(Order $order, string $status, string $paymentStatus): Order
    {
        $transitions = [
            Order::STATUS_PENDING => [Order::STATUS_PENDING, Order::STATUS_PROCESSING, Order::STATUS_CANCELLED],
            Order::STATUS_PROCESSING => [Order::STATUS_PROCESSING, Order::STATUS_SHIPPED, Order::STATUS_CANCELLED],
            Order::STATUS_SHIPPED => [Order::STATUS_SHIPPED, Order::STATUS_DELIVERED],
            Order::STATUS_DELIVERED => [Order::STATUS_DELIVERED],
            Order::STATUS_CANCELLED => [Order::STATUS_CANCELLED],
        ];

        if (! in_array($status, $transitions[$order->status] ?? [], true)) {
            throw ValidationException::withMessages([
                'status' => "An order cannot move from {$order->status} to {$status}.",
            ]);
        }

        DB::transaction(fn () => $order->update([
            'status' => $status,
            'payment_status' => $paymentStatus,
        ]));

        return $order->fresh(['user', 'items']);
    }
}
