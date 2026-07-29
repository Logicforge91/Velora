<?php

namespace App\Services\Admin;

use App\Events\ShipmentTrackingUpdated;
use App\Models\Order;
use App\Models\Shipment;
use App\Models\ShipmentEvent;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ShipmentOperationsService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, Shipment>
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');

        return Shipment::query()->with(['order.user:id,name,email'])->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query->where('tracking_number', 'like', "%{$search}%")->orWhere('carrier', 'like', "%{$search}%")->orWhereHas('order', fn (Builder $query): Builder => $query->where('number', 'like', "%{$search}%"))))->when($status !== '', fn (Builder $query): Builder => $query->where('status', $status))->latest()->paginate(15)->withQueryString();
    }

    /** @return array<string, int> */
    public function counts(): array
    {
        $row = Shipment::query()->selectRaw('COUNT(*) total')->selectRaw("SUM(CASE WHEN status IN ('pending','packed') THEN 1 ELSE 0 END) pending")->selectRaw("SUM(CASE WHEN status IN ('shipped','in_transit') THEN 1 ELSE 0 END) in_transit")->selectRaw("SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) delivered")->toBase()->firstOrFail();

        return ['total' => (int) $row->total, 'pending' => (int) $row->pending, 'in_transit' => (int) $row->in_transit, 'delivered' => (int) $row->delivered];
    }

    /** @param array<string, mixed> $data */
    public function update(Shipment $shipment, array $data): Shipment
    {
        $previousStatus = $shipment->status;

        $trackingEvent = DB::transaction(function () use ($shipment, $data, $previousStatus): ?ShipmentEvent {
            $shipment->update([
                ...$data,
                'delivery_otp' => $data['status'] === 'out_for_delivery'
                    ? ($shipment->delivery_otp ?? (string) random_int(100000, 999999))
                    : $shipment->delivery_otp,
                'shipped_at' => in_array($data['status'], ['shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed_delivery', 'rescheduled'], true)
                    ? ($shipment->shipped_at ?? now())
                    : null,
                'delivered_at' => $data['status'] === 'delivered' ? now() : null,
            ]);

            $orderStatus = match ($data['status']) {
                'processed', 'packed' => Order::STATUS_PROCESSING,
                'shipped', 'in_transit', 'out_for_delivery', 'failed_delivery', 'rescheduled' => Order::STATUS_SHIPPED,
                'delivered' => Order::STATUS_DELIVERED,
                'cancelled' => Order::STATUS_CANCELLED,
                default => (string) $shipment->order()->value('status'),
            };
            $shipment->order()->update(['status' => $orderStatus]);

            if ($previousStatus === $data['status']) {
                return null;
            }

            return $shipment->events()->create([
                'status' => $data['status'],
                'provider_code' => $data['carrier'] ?? $shipment->carrier,
                'message' => $this->statusMessage($data['status']),
                'occurred_at' => now(),
                'customer_visible' => true,
            ]);
        });

        if ($trackingEvent !== null) {
            ShipmentTrackingUpdated::dispatch($shipment->fresh(), $trackingEvent);
        }

        return $shipment->fresh('order.user');
    }

    private function statusMessage(string $status): string
    {
        return match ($status) {
            'confirmed' => 'Your order has been confirmed.',
            'processed' => 'Your order is being processed.',
            'packed' => 'Your order has been packed.',
            'shipped' => 'Your shipment has left the fulfilment centre.',
            'in_transit' => 'Your shipment is moving through the courier network.',
            'out_for_delivery' => 'Your shipment is out for delivery.',
            'delivered' => 'Your shipment was delivered successfully.',
            'failed_delivery' => 'The courier could not complete delivery.',
            'rescheduled' => 'Delivery has been rescheduled.',
            'cancelled' => 'This shipment has been cancelled.',
            default => 'Shipment tracking was updated.',
        };
    }
}
