<?php

use App\Events\ShipmentTrackingUpdated;
use App\Models\Order;
use App\Models\Shipment;
use App\Services\Admin\ShipmentOperationsService;
use Illuminate\Support\Facades\Event;

test('shipment status updates create a timeline event and delivery otp', function () {
    $order = Order::factory()->create();
    $shipment = Shipment::query()->create([
        'order_id' => $order->id,
        'carrier' => 'BlueDart',
        'tracking_number' => 'BD-TRACK-1001',
        'status' => 'shipped',
    ]);
    Event::fake([ShipmentTrackingUpdated::class]);

    app(ShipmentOperationsService::class)->update($shipment, [
        'carrier' => 'BlueDart',
        'tracking_number' => 'BD-TRACK-1001',
        'status' => 'out_for_delivery',
        'estimated_delivery_at' => now()->addHours(4),
        'notes' => null,
    ]);

    expect($shipment->refresh()->delivery_otp)
        ->toMatch('/^\d{6}$/')
        ->and($shipment->events()->first()->status)
        ->toBe('out_for_delivery')
        ->and($order->refresh()->status)
        ->toBe(Order::STATUS_SHIPPED);

    Event::assertDispatched(ShipmentTrackingUpdated::class);
});
