<?php
namespace App\Services\Admin;
use App\Models\Order;
use App\Models\Shipment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
class ShipmentOperationsService
{
    /** @param array<string, mixed> $filters @return LengthAwarePaginator<int, Shipment> */
    public function paginate(array $filters): LengthAwarePaginator { $search = trim((string) ($filters['search'] ?? '')); $status = (string) ($filters['status'] ?? ''); return Shipment::query()->with(['order.user:id,name,email'])->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query->where('tracking_number', 'like', "%{$search}%")->orWhere('carrier', 'like', "%{$search}%")->orWhereHas('order', fn (Builder $query): Builder => $query->where('number', 'like', "%{$search}%"))))->when($status !== '', fn (Builder $query): Builder => $query->where('status', $status))->latest()->paginate(15)->withQueryString(); }
    /** @return array<string, int> */
    public function counts(): array { $row = Shipment::query()->selectRaw('COUNT(*) total')->selectRaw("SUM(CASE WHEN status IN ('pending','packed') THEN 1 ELSE 0 END) pending")->selectRaw("SUM(CASE WHEN status IN ('shipped','in_transit') THEN 1 ELSE 0 END) in_transit")->selectRaw("SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) delivered")->toBase()->firstOrFail(); return ['total' => (int) $row->total, 'pending' => (int) $row->pending, 'in_transit' => (int) $row->in_transit, 'delivered' => (int) $row->delivered]; }
    /** @param array<string, mixed> $data */
    public function update(Shipment $shipment, array $data): Shipment { DB::transaction(function () use ($shipment, $data): void { $shipment->update([...$data, 'shipped_at' => in_array($data['status'], ['shipped', 'in_transit', 'delivered'], true) ? ($shipment->shipped_at ?? now()) : null, 'delivered_at' => $data['status'] === 'delivered' ? now() : null]); $orderStatus = match ($data['status']) { 'shipped', 'in_transit' => Order::STATUS_SHIPPED, 'delivered' => Order::STATUS_DELIVERED, 'returned' => Order::STATUS_CANCELLED, default => $shipment->order->status }; $shipment->order()->update(['status' => $orderStatus]); }); return $shipment->fresh('order.user'); }
}
