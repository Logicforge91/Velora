<?php

namespace App\Services\Customer;

use App\Models\Order;
use App\Models\PaymentTransaction;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutPaymentService
{
    public const CHECKOUT_TOTAL = 33997;

    /** @return Collection<int, PaymentTransaction> */
    public function recentTransactions(User $user): Collection
    {
        return PaymentTransaction::query()
            ->with('payment.order')
            ->whereHas('payment.order', fn ($query) => $query->whereBelongsTo($user))
            ->latest()
            ->limit(5)
            ->get();
    }

    public function ownedTransaction(User $user, ?string $uuid): ?PaymentTransaction
    {
        if ($uuid === null) {
            return null;
        }

        return PaymentTransaction::query()
            ->with('payment.order')
            ->where('uuid', $uuid)
            ->whereHas('payment.order', fn ($query) => $query->whereBelongsTo($user))
            ->first();
    }

    /** @param array{payment_method: string, idempotency_key: string, authentication_code?: string|null, save_payment_method?: bool} $data */
    public function process(User $user, array $data): PaymentTransaction
    {
        $existingTransaction = PaymentTransaction::query()
            ->with('payment.order')
            ->where('provider_reference', $data['idempotency_key'])
            ->whereHas('payment.order', fn ($query) => $query->whereBelongsTo($user))
            ->first();

        if ($existingTransaction !== null) {
            return $existingTransaction;
        }

        return DB::transaction(function () use ($user, $data): PaymentTransaction {
            $method = $data['payment_method'];
            $isCashOnDelivery = $method === 'cash_on_delivery';
            $failed = ($data['authentication_code'] ?? null) === '000000';
            $status = $failed ? 'failed' : ($isCashOnDelivery ? 'authorized' : 'succeeded');
            $order = $this->createOrder($user, $method);
            $payment = $order->payment;
            $transaction = $payment->transactions()->create([
                'provider_reference' => $data['idempotency_key'],
                'type' => 'charge',
                'amount' => self::CHECKOUT_TOTAL,
                'status' => $status,
                'gateway' => $this->gatewayFor($method),
                'failure_code' => $failed ? 'AUTHENTICATION_FAILED' : null,
                'failure_message' => $failed ? 'Secure payment authentication was declined.' : null,
                'processed_at' => now(),
                'metadata' => [
                    'method' => $method,
                    'verified' => ! $failed,
                    'save_payment_method_requested' => (bool) ($data['save_payment_method'] ?? false),
                ],
            ]);

            $payment->update([
                'transaction_id' => $transaction->uuid,
                'provider' => $transaction->gateway,
                'status' => $failed ? 'failed' : ($isCashOnDelivery ? 'pending' : 'paid'),
                'paid_at' => $failed || $isCashOnDelivery ? null : now(),
                'metadata' => [
                    'method' => $method,
                    'verification' => $failed ? 'failed' : 'verified',
                ],
            ]);
            $order->update([
                'payment_status' => $payment->status,
                'confirmed_at' => $failed ? null : now(),
            ]);

            return $transaction->load('payment.order');
        });
    }

    private function createOrder(User $user, string $method): Order
    {
        $address = $user->addresses()->latest('is_default_shipping')->first();
        $shippingAddress = $address?->only([
            'recipient_name',
            'phone',
            'line_1',
            'line_2',
            'city',
            'state',
            'postal_code',
        ]) ?? [
            'recipient_name' => $user->name,
            'line_1' => 'Address pending confirmation',
            'city' => 'Pending',
            'state' => 'Pending',
            'postal_code' => '000000',
        ];

        return Order::query()->create([
            'user_id' => $user->id,
            'number' => 'ORD-'.Str::upper(Str::random(12)),
            'status' => Order::STATUS_PENDING,
            'payment_method' => $method,
            'payment_status' => 'pending',
            'shipping_address' => $shippingAddress,
            'billing_address' => $shippingAddress,
            'subtotal' => self::CHECKOUT_TOTAL,
            'shipping_total' => 0,
            'discount_total' => 0,
            'tax_total' => round(self::CHECKOUT_TOTAL * 0.18, 2),
            'total' => self::CHECKOUT_TOTAL,
            'placed_at' => now(),
        ]);
    }

    private function gatewayFor(string $method): string
    {
        return match ($method) {
            'cash_on_delivery' => 'manual',
            'wallet' => 'wallet_gateway',
            'emi', 'buy_now_pay_later' => 'credit_gateway',
            'gift_card', 'reward_points' => 'velora_balance',
            default => 'razorpay',
        };
    }
}
