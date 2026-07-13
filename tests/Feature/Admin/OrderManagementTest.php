<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function createOrder(array $attributes = []): Order
{
    $customer = User::factory()->customer()->create();
    $order = Order::query()->create(array_merge([
        'user_id' => $customer->id,
        'number' => 'VEL-'.fake()->unique()->numerify('########'),
        'status' => Order::STATUS_PENDING,
        'payment_method' => 'cash_on_delivery',
        'payment_status' => 'pending',
        'shipping_address' => ['name' => $customer->name, 'city' => 'Bengaluru', 'country' => 'India'],
        'subtotal' => 4999,
        'shipping_total' => 0,
        'discount_total' => 0,
        'total' => 4999,
        'placed_at' => now(),
    ], $attributes));

    $product = Product::factory()->create();
    $order->items()->create([
        'product_id' => $product->id,
        'product_name' => $product->name,
        'sku' => $product->sku,
        'unit_price' => 4999,
        'quantity' => 1,
        'total' => 4999,
    ]);

    return $order;
}

test('administrators can inspect an order with customer and line item details', function () {
    $admin = User::factory()->admin()->create();
    $order = createOrder();

    $this->actingAs($admin)->get(route('admin.orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/show')
            ->where('order.number', $order->number)
            ->has('order.user')
            ->has('order.items', 1));
});

test('administrators can advance valid order lifecycle transitions', function () {
    $admin = User::factory()->admin()->create();
    $order = createOrder();

    $this->actingAs($admin)->put(route('admin.orders.update', $order), [
        'status' => Order::STATUS_PROCESSING,
        'payment_status' => 'paid',
    ])->assertRedirect(route('admin.orders.show', $order));

    expect($order->fresh()->status)->toBe(Order::STATUS_PROCESSING)
        ->and($order->fresh()->payment_status)->toBe('paid');
});

test('administrators cannot apply invalid order lifecycle transitions', function () {
    $admin = User::factory()->admin()->create();
    $order = createOrder(['status' => Order::STATUS_DELIVERED]);

    $this->actingAs($admin)->from(route('admin.orders.show', $order))->put(route('admin.orders.update', $order), [
        'status' => Order::STATUS_PENDING,
        'payment_status' => 'paid',
    ])->assertSessionHasErrors('status');
});
