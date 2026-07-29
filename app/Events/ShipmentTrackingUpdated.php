<?php

namespace App\Events;

use App\Models\Shipment;
use App\Models\ShipmentEvent;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ShipmentTrackingUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Shipment $shipment,
        public ShipmentEvent $trackingEvent,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('orders.'.$this->shipment->order_id)];
    }

    /** @return array{shipment_id: int, status: string, event: array{id: int, status: string, location: ?string, message: ?string, occurred_at: ?string}} */
    public function broadcastWith(): array
    {
        return [
            'shipment_id' => $this->shipment->id,
            'status' => $this->shipment->status,
            'event' => [
                'id' => $this->trackingEvent->id,
                'status' => $this->trackingEvent->status,
                'location' => $this->trackingEvent->location,
                'message' => $this->trackingEvent->message,
                'occurred_at' => $this->trackingEvent->occurred_at?->toISOString(),
            ],
        ];
    }
}
