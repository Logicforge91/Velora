<?php

namespace App\Services\Customer;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\PaymentRefund;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /** @param array{reason: string, reason_details?: string|null, refund_method: string, confirmed: bool} $data */
    public function cancel(User $user, Order $order, array $data): void
    {
        if (! in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PROCESSING], true)) {
            throw ValidationException::withMessages(['order' => 'This order can no longer be cancelled.']);
        }

        DB::transaction(function () use ($user, $order, $data): void {
            $order = Order::query()->lockForUpdate()->findOrFail($order->id);

            if (! in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PROCESSING], true)) {
                throw ValidationException::withMessages(['order' => 'This order can no longer be cancelled.']);
            }

            $order->items()->whereNot('fulfilment_status', 'cancelled')->update([
                'fulfilment_status' => 'cancelled',
            ]);
            $order->update([
                'status' => Order::STATUS_CANCELLED,
                'cancellation_reason' => $this->reasonText($data),
                'cancelled_at' => now(),
            ]);

            $this->requestRefund($user, $order->payment, null, $data);
        });
    }

    /** @param array{reason: string, reason_details?: string|null, refund_method: string, confirmed: bool} $data */
    public function cancelItem(User $user, Order $order, OrderItem $item, array $data): void
    {
        if ($item->order_id !== $order->id || ! in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PROCESSING], true)) {
            throw ValidationException::withMessages(['item' => 'This item can no longer be cancelled.']);
        }

        DB::transaction(function () use ($user, $order, $item, $data): void {
            $item = OrderItem::query()->lockForUpdate()->findOrFail($item->id);

            if ($item->order_id !== $order->id || $item->fulfilment_status === 'cancelled') {
                throw ValidationException::withMessages(['item' => 'This item can no longer be cancelled.']);
            }

            $item->update([
                'fulfilment_status' => 'cancelled',
                'metadata' => [
                    ...($item->metadata ?? []),
                    'cancellation_reason' => $this->reasonText($data),
                ],
            ]);

            $this->requestRefund($user, $order->payment, $item, $data);

            if ($order->items()->whereNot('fulfilment_status', 'cancelled')->doesntExist()) {
                $order->update([
                    'status' => Order::STATUS_CANCELLED,
                    'cancellation_reason' => $this->reasonText($data),
                    'cancelled_at' => now(),
                ]);
            }
        });
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

    /** @param array{reason: string, reason_details?: string|null, refund_method: string, confirmed: bool} $data */
    private function requestRefund(User $user, ?Payment $payment, ?OrderItem $item, array $data): ?PaymentRefund
    {
        if ($payment === null || ! in_array($payment->status, ['paid', 'partially_refunded'], true)) {
            return null;
        }

        $alreadyRequested = (float) $payment->refunds()
            ->whereNotIn('status', ['failed', 'rejected'])
            ->sum('amount');
        $available = max(0, (float) $payment->amount - $alreadyRequested);
        $amount = min($available, $item ? (float) $item->total : $available);

        if ($amount <= 0) {
            return null;
        }

        return $payment->refunds()->create([
            'number' => 'REF-'.Str::upper(Str::random(12)),
            'amount' => $amount,
            'reason_code' => $data['reason'],
            'reason_details' => $data['reason_details'] ?? null,
            'status' => 'requested',
            'requested_by' => $user->id,
            'requested_at' => now(),
            'metadata' => [
                'refund_method' => $data['refund_method'],
                'order_item_id' => $item?->id,
                'source' => 'customer_cancellation',
            ],
        ]);
    }

    /** @param array{reason: string, reason_details?: string|null} $data */
    private function reasonText(array $data): string
    {
        $reason = Str::of($data['reason'])->replace('_', ' ')->headline()->toString();

        return filled($data['reason_details'] ?? null)
            ? "{$reason}: {$data['reason_details']}"
            : $reason;
    }
}
