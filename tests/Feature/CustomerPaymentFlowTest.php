<?php

use App\Models\User;
use App\Services\Customer\CheckoutPaymentService;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

test('customer can open the secure payment page', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('customer.payments.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('customer/payments/index')
            ->where('amount', CheckoutPaymentService::CHECKOUT_TOTAL)
            ->has('paymentSessionId')
            ->has('recentTransactions'));
});

test('verified gateway payment creates one successful transaction', function () {
    $customer = User::factory()->customer()->create();
    $idempotencyKey = (string) Str::uuid();

    $response = $this->actingAs($customer)
        ->post(route('customer.payments.store'), [
            'payment_method' => 'upi',
            'idempotency_key' => $idempotencyKey,
            'authentication_code' => '123456',
        ]);

    $transaction = $customer->orders()->sole()->payment->transactions()->sole();

    $response->assertRedirect(route('customer.orders.success', $transaction->payment->order));

    expect($transaction->status)->toBe('succeeded')
        ->and($transaction->provider_reference)->toBe($idempotencyKey)
        ->and($transaction->payment->status)->toBe('paid');
});

test('repeated idempotency key does not create a duplicate payment', function () {
    $customer = User::factory()->customer()->create();
    $payload = [
        'payment_method' => 'credit_card',
        'idempotency_key' => (string) Str::uuid(),
        'authentication_code' => '123456',
    ];

    $this->actingAs($customer)->post(route('customer.payments.store'), $payload);
    $this->actingAs($customer)->post(route('customer.payments.store'), $payload);

    expect($customer->orders()->count())->toBe(1)
        ->and($customer->orders()->sole()->payment->transactions()->count())->toBe(1);
});

test('failed authentication records failure and allows a fresh retry', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)->post(route('customer.payments.store'), [
        'payment_method' => 'debit_card',
        'idempotency_key' => (string) Str::uuid(),
        'authentication_code' => '000000',
    ]);

    expect($customer->orders()->sole()->payment->transactions()->sole()->status)
        ->toBe('failed');

    $this->actingAs($customer)->post(route('customer.payments.store'), [
        'payment_method' => 'debit_card',
        'idempotency_key' => (string) Str::uuid(),
        'authentication_code' => '123456',
    ]);

    expect($customer->orders()->count())->toBe(2)
        ->and($customer->orders()->latest()->first()->payment->status)->toBe('paid');
});

test('payment authentication is required for gateway methods', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->post(route('customer.payments.store'), [
            'payment_method' => 'upi',
            'idempotency_key' => (string) Str::uuid(),
        ])
        ->assertSessionHasErrors('authentication_code');
});
