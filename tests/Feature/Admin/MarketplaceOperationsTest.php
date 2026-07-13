<?php

use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;

test('administrators can create bounded promotion campaigns', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('admin.coupons.store'), [
        'code' => 'summer25', 'name' => 'Summer sale', 'type' => 'percentage', 'value' => 25,
        'minimum_order_amount' => 1000, 'maximum_discount_amount' => 2500, 'usage_limit' => 500,
        'starts_at' => now(), 'expires_at' => now()->addMonth(), 'status' => true,
    ])->assertRedirect();

    expect(Coupon::query()->where('code', 'SUMMER25')->where('status', true)->exists())->toBeTrue();
});

test('administrators can moderate customer reviews', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->customer()->create();
    $product = Product::factory()->create();
    $review = Review::query()->create(['product_id' => $product->id, 'user_id' => $customer->id, 'rating' => 5, 'title' => 'Excellent', 'body' => 'A genuine and detailed product review.']);

    $this->actingAs($admin)->put(route('admin.reviews.update', $review), ['status' => 'approved'])->assertRedirect();
    expect($review->fresh()->status)->toBe('approved')->and($review->fresh()->moderated_by)->toBe($admin->id);
});

test('new orders provision payment and shipment operations records', function () {
    $customer = User::factory()->customer()->create();
    $order = Order::query()->create([
        'user_id' => $customer->id, 'number' => 'VEL-OPS-1001', 'shipping_address' => ['city' => 'Bengaluru'],
        'subtotal' => 2500, 'total' => 2500, 'placed_at' => now(),
    ]);

    expect($order->payment()->where('amount', 2500)->exists())->toBeTrue()
        ->and($order->shipment()->where('status', 'pending')->exists())->toBeTrue();
});

test('refunds cannot exceed the captured payment', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->customer()->create();
    $order = Order::query()->create(['user_id' => $customer->id, 'number' => 'VEL-OPS-1002', 'shipping_address' => ['city' => 'Delhi'], 'subtotal' => 1000, 'total' => 1000, 'placed_at' => now()]);

    $this->actingAs($admin)->from(route('admin.payments.index'))->put(route('admin.payments.update', $order->payment), [
        'status' => 'refunded', 'refunded_amount' => 1100, 'transaction_id' => 'TXN-1002',
    ])->assertSessionHasErrors('refunded_amount');
});
