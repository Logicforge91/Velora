<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ReturnCase;
use App\Models\User;

/** @return array{0: Order, 1: OrderItem, 2: Product} */
function createOrderForReturnOperations(): array
{
    $customer = User::factory()->customer()->create();
    $product = Product::factory()->create(['stock' => 5, 'price' => 1200]);
    $order = Order::query()->create([
        'user_id' => $customer->id,
        'number' => 'VEL-RET-'.fake()->unique()->numerify('####'),
        'status' => Order::STATUS_DELIVERED,
        'payment_method' => 'card',
        'payment_status' => 'paid',
        'shipping_address' => ['city' => 'Bengaluru', 'country' => 'India'],
        'subtotal' => 2400,
        'total' => 2400,
        'placed_at' => now()->subDays(2),
    ]);
    $item = $order->items()->create([
        'product_id' => $product->id,
        'product_name' => $product->name,
        'sku' => $product->sku,
        'unit_price' => 1200,
        'quantity' => 2,
        'total' => 2400,
    ]);

    return [$order, $item, $product];
}

test('administrators can open a bounded return case', function () {
    $admin = User::factory()->admin()->create();
    [$order, $item] = createOrderForReturnOperations();

    $this->actingAs($admin)->post(route('admin.returns.store'), [
        'order_id' => $order->id,
        'order_item_id' => $item->id,
        'type' => 'return',
        'reason_code' => 'damaged',
        'reason_details' => 'Outer packaging and product were damaged.',
        'requested_quantity' => 1,
        'refund_amount' => 1200,
        'resolution' => 'Refund to original payment method',
    ])->assertRedirect();

    expect(ReturnCase::query()->where('order_id', $order->id)->first())
        ->not->toBeNull()
        ->status->toBe('requested')
        ->customer_id->toBe($order->user_id);
});

test('return cases reject items from another order and excess refunds', function () {
    $admin = User::factory()->admin()->create();
    [$order, $item] = createOrderForReturnOperations();
    [, $otherItem] = createOrderForReturnOperations();

    $payload = [
        'order_id' => $order->id,
        'order_item_id' => $otherItem->id,
        'type' => 'return',
        'reason_code' => 'wrong_item',
        'requested_quantity' => 1,
        'refund_amount' => 3000,
    ];

    $this->actingAs($admin)->from(route('admin.returns.create'))->post(route('admin.returns.store'), $payload)
        ->assertSessionHasErrors('order_item_id');

    $this->actingAs($admin)->from(route('admin.returns.create'))->post(route('admin.returns.store'), [
        ...$payload,
        'order_item_id' => $item->id,
    ])->assertSessionHasErrors('refund_amount');
});

test('return lifecycle blocks invalid transitions', function () {
    $admin = User::factory()->admin()->create();
    [$order, $item] = createOrderForReturnOperations();
    $returnCase = ReturnCase::query()->create([
        'order_id' => $order->id,
        'order_item_id' => $item->id,
        'customer_id' => $order->user_id,
        'number' => 'RET-INVALID-1001',
        'type' => 'return',
        'reason_code' => 'defective',
        'status' => 'requested',
        'requested_quantity' => 1,
        'refund_amount' => 1200,
        'requested_at' => now(),
    ]);

    $this->actingAs($admin)->from(route('admin.returns.show', $returnCase))->put(route('admin.returns.update', $returnCase), [
        'status' => 'refunded',
        'refund_amount' => 1200,
    ])->assertSessionHasErrors('status');

    expect($returnCase->fresh()->status)->toBe('requested');
});

test('warehouse receipt restores inventory only once', function () {
    $admin = User::factory()->admin()->create();
    [$order, $item, $product] = createOrderForReturnOperations();
    $returnCase = ReturnCase::query()->create([
        'order_id' => $order->id,
        'order_item_id' => $item->id,
        'customer_id' => $order->user_id,
        'number' => 'RET-STOCK-1001',
        'type' => 'return',
        'reason_code' => 'damaged',
        'status' => 'in_transit',
        'requested_quantity' => 2,
        'refund_amount' => 2400,
        'requested_at' => now(),
    ]);

    $payload = ['status' => 'received', 'refund_amount' => 2400];
    $this->actingAs($admin)->put(route('admin.returns.update', $returnCase), $payload)->assertRedirect();
    $this->actingAs($admin)->put(route('admin.returns.update', $returnCase), $payload)->assertRedirect();

    expect($product->fresh()->stock)->toBe(7);
});

test('completed returns post a bounded payment refund', function () {
    $admin = User::factory()->admin()->create();
    [$order, $item] = createOrderForReturnOperations();
    $returnCase = ReturnCase::query()->create([
        'order_id' => $order->id,
        'order_item_id' => $item->id,
        'customer_id' => $order->user_id,
        'number' => 'RET-REFUND-1001',
        'type' => 'return',
        'reason_code' => 'defective',
        'status' => 'received',
        'requested_quantity' => 1,
        'refund_amount' => 1200,
        'requested_at' => now(),
        'received_at' => now(),
    ]);

    $this->actingAs($admin)->put(route('admin.returns.update', $returnCase), [
        'status' => 'refunded',
        'refund_amount' => 1200,
        'resolution' => 'Refunded to card',
    ])->assertRedirect();

    expect($returnCase->fresh()->status)->toBe('refunded')
        ->and($order->payment->fresh()->status)->toBe('partially_refunded')
        ->and((float) $order->payment->fresh()->refunded_amount)->toBe(1200.0);
});
