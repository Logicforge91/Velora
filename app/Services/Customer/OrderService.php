<?php

namespace App\Services\Customer;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function cancel(Order $order): void
    {
        if (! in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PROCESSING], true)) {
            throw ValidationException::withMessages(['order' => 'This order can no longer be cancelled.']);
        }

        DB::transaction(function () use ($order): void {
            $order->items()->whereNot('fulfilment_status', 'cancelled')->update([
                'fulfilment_status' => 'cancelled',
            ]);
            $order->update([
                'status' => Order::STATUS_CANCELLED,
                'cancellation_reason' => 'Cancelled by customer',
                'cancelled_at' => now(),
            ]);
        });
    }

    public function cancelItem(Order $order, OrderItem $item): void
    {
        if ($item->order_id !== $order->id || ! in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PROCESSING], true)) {
            throw ValidationException::withMessages(['item' => 'This item can no longer be cancelled.']);
        }

        $item->update(['fulfilment_status' => 'cancelled']);

        if ($order->items()->whereNot('fulfilment_status', 'cancelled')->doesntExist()) {
            $this->cancel($order);
        }
    }

    public function updateInstructions(Order $order, string $instructions): void
    {
        $shipment = $order->shipment;

        if ($shipment === null || in_array($shipment->status, ['delivered', 'cancelled'], true)) {
            throw ValidationException::withMessages(['delivery_instructions' => 'Delivery instructions can no longer be updated.']);
        }

        $shipment->update(['notes' => $instructions]);
    }

    public function reportIssue(User $user, Order $order, array $data): SupportTicket
    {
        return SupportTicket::query()->create([
            'customer_id' => $user->id,
            'order_id' => $order->id,
            'number' => 'SUP-'.Str::upper(Str::random(10)),
            'subject' => "Order {$order->number}: {$data['category']} issue",
            'category' => $data['category'],
            'channel' => 'storefront',
            'priority' => $data['category'] === 'payment' ? 'high' : 'medium',
            'description' => $data['description'],
            'first_response_due_at' => now()->addHours(4),
            'resolution_due_at' => now()->addHours(48),
        ]);
    }
}
