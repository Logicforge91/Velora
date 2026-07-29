<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('customer can view their order history and details', function () {
    $customer = User::factory()->customer()->create();
    $order = Order::factory()->for($customer)->create();
    OrderItem::factory()->for($order)->create();

    $this->actingAs($customer)
        ->get(route('customer.orders.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('customer/orders/index')
            ->has('orders.data', 1));

    $this->actingAs($customer)
        ->get(route('customer.orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('customer/orders/show')
            ->where('order.id', $order->id));
});

test('customer cannot view another customers order', function () {
    $customer = User::factory()->customer()->create();
    $order = Order::factory()->for(User::factory()->customer())->create();

    $this->actingAs($customer)
        ->get(route('customer.orders.show', $order))
        ->assertForbidden();
});

test('customer can cancel an order or an individual item', function () {
    $customer = User::factory()->customer()->create();
    $order = Order::factory()->for($customer)->create();
    $firstItem = OrderItem::factory()->for($order)->create();
    $secondItem = OrderItem::factory()->for($order)->create();

    $this->actingAs($customer)
        ->patch(route('customer.orders.items.cancel', [$order, $firstItem]), cancellationPayload())
        ->assertRedirect();

    expect($firstItem->refresh()->fulfilment_status)->toBe('cancelled')
        ->and($order->refresh()->status)->toBe(Order::STATUS_PENDING);

    $this->actingAs($customer)
        ->patch(route('customer.orders.cancel', $order), cancellationPayload())
        ->assertRedirect();

    expect($order->refresh()->status)->toBe(Order::STATUS_CANCELLED)
        ->and($secondItem->refresh()->fulfilment_status)->toBe('cancelled');
});

test('customer can update delivery instructions and report an issue', function () {
    $customer = User::factory()->customer()->create();
    $order = Order::factory()->for($customer)->create();

    $this->actingAs($customer)
        ->patch(route('customer.orders.instructions.update', $order), [
            'delivery_instructions' => 'Leave the parcel with security.',
        ])
        ->assertRedirect();

    expect($order->shipment->refresh()->notes)->toBe('Leave the parcel with security.');

    $this->actingAs($customer)
        ->post(route('customer.orders.issues.store', $order), [
            'category' => 'delivery',
            'description' => 'The estimated delivery date has changed twice.',
        ])
        ->assertRedirect();

    expect($order->fresh()->supportTickets()->count())->toBe(1);
});

test('paid cancellation creates a trackable refund request', function () {
    $customer = User::factory()->customer()->create();
    $order = Order::factory()->for($customer)->create([
        'payment_status' => 'paid',
        'payment_method' => 'upi',
        'total' => 1499,
    ]);
    OrderItem::factory()->for($order)->create(['total' => 1499]);

    $this->actingAs($customer)
        ->patch(route('customer.orders.cancel', $order), cancellationPayload([
            'reason' => 'delivery_too_late',
            'refund_method' => 'original_payment',
        ]))
        ->assertRedirect();

    $refund = $order->payment->refunds()->sole();

    expect($refund->status)->toBe('requested')
        ->and($refund->amount)->toBe('1499.00')
        ->and($refund->metadata['refund_method'])->toBe('original_payment');
});

/** @param array<string, mixed> $overrides */
function cancellationPayload(array $overrides = []): array
{
    return [
        'reason' => 'changed_mind',
        'reason_details' => null,
        'refund_method' => 'store_credit',
        'confirmed' => true,
        ...$overrides,
    ];
}
