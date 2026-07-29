<?php

namespace App\Services\Customer;

use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentRefund;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class RefundService
{
    /** @param array{order_id: int, refund_type: string, amount?: numeric-string|int|float|null, refund_method: string, reason: string} $data */
    public function create(User $user, array $data): PaymentRefund
    {
        $order = Order::query()->whereBelongsTo($user)->findOrFail($data['order_id']);

        return DB::transaction(function () use ($user, $order, $data): PaymentRefund {
            $payment = Payment::query()->lockForUpdate()->where('order_id', $order->id)->firstOrFail();

            if (! in_array($payment->status, ['paid', 'partially_refunded'], true)) {
                throw ValidationException::withMessages(['order_id' => 'This payment is not eligible for a refund.']);
            }

            $available = $this->availableAmount($payment);
            $amount = $data['refund_type'] === 'full' ? $available : (float) $data['amount'];

            if ($amount <= 0 || $amount > $available) {
                throw ValidationException::withMessages(['amount' => 'The refund amount exceeds the available payment balance.']);
            }

            return $this->makeRefund($payment, $user, $amount, $data['refund_method'], [
                'refund_type' => $data['refund_type'],
                'reason' => $data['reason'],
            ]);
        });
    }

    /** @param array{refund_method: string} $data */
    public function retry(User $user, PaymentRefund $failedRefund, array $data): PaymentRefund
    {
        if ($failedRefund->status !== 'failed') {
            throw ValidationException::withMessages(['refund' => 'Only failed refunds can be retried.']);
        }

        return DB::transaction(function () use ($user, $failedRefund, $data): PaymentRefund {
            $payment = Payment::query()->lockForUpdate()->findOrFail($failedRefund->payment_id);
            $amount = min((float) $failedRefund->amount, $this->availableAmount($payment));

            if ($amount <= 0) {
                throw ValidationException::withMessages(['refund' => 'No refundable balance remains for this payment.']);
            }

            return $this->makeRefund($payment, $user, $amount, $data['refund_method'], [
                'refund_type' => $failedRefund->metadata['refund_type'] ?? 'partial',
                'retry_of' => $failedRefund->id,
                'reason' => $failedRefund->reason_details,
            ]);
        });
    }

    private function availableAmount(Payment $payment): float
    {
        $reserved = (float) $payment->refunds()
            ->whereNotIn('status', ['failed', 'rejected'])
            ->sum('amount');

        return max(0, (float) $payment->amount - $reserved);
    }

    /** @param array<string, mixed> $metadata */
    private function makeRefund(
        Payment $payment,
        User $user,
        float $amount,
        string $method,
        array $metadata,
    ): PaymentRefund {
        return $payment->refunds()->create([
            'number' => 'REF-'.Str::upper(Str::random(12)),
            'amount' => $amount,
            'reason_code' => 'customer_request',
            'reason_details' => $metadata['reason'] ?? null,
            'status' => 'requested',
            'requested_by' => $user->id,
            'requested_at' => now(),
            'metadata' => [
                ...$metadata,
                'refund_method' => $method,
                'source' => 'customer_refund_center',
            ],
        ]);
    }
}
