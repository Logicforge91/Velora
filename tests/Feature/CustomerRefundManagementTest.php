<?php

use App\Models\Order;
use App\Models\PaymentRefund;
use App\Models\User;

test('customer can initiate a bounded partial refund', function () {
    $customer = User::factory()->customer()->create();
    $order = Order::factory()->for($customer)->create([
        'payment_status' => 'paid',
        'total' => 1000,
    ]);

    $this->actingAs($customer)
        ->post(route('customer.refunds.store'), [
            'order_id' => $order->id,
            'refund_type' => 'partial',
            'amount' => 400,
            'refund_method' => 'wallet',
            'reason' => 'A partial service adjustment was agreed.',
        ])
        ->assertRedirect();

    $refund = $order->payment->refunds()->sole();

    expect($refund->amount)->toBe('400.00')
        ->and($refund->status)->toBe('requested')
        ->and($refund->metadata['refund_method'])->toBe('wallet');
});

test('customer can retry their failed refund using a new destination', function () {
    $customer = User::factory()->customer()->create();
    $order = Order::factory()->for($customer)->create([
        'payment_status' => 'paid',
        'total' => 1000,
    ]);
    $failedRefund = PaymentRefund::factory()->for($order->payment, 'payment')->create([
        'amount' => 500,
        'status' => 'failed',
        'failure_reason' => 'Provider account unavailable.',
    ]);

    $this->actingAs($customer)
        ->post(route('customer.refunds.retry', $failedRefund), [
            'refund_method' => 'bank_account',
        ])
        ->assertRedirect();

    expect($order->payment->refunds()->where('status', 'requested')->sole()->metadata['retry_of'])
        ->toBe($failedRefund->id);
});
