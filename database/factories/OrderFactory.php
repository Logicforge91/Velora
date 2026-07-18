<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Order> */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 500, 50000);

        return [
            'user_id' => User::factory()->customer(),
            'number' => 'ORD-'.Str::upper(Str::random(12)),
            'status' => Order::STATUS_PENDING,
            'payment_method' => 'cash_on_delivery',
            'payment_status' => 'pending',
            'shipping_address' => ['recipient_name' => fake()->name(), 'postal_code' => fake()->numerify('######')],
            'billing_address' => null,
            'currency' => 'INR',
            'subtotal' => $subtotal,
            'shipping_total' => 0,
            'discount_total' => 0,
            'tax_total' => 0,
            'gift_wrap_total' => 0,
            'savings_total' => 0,
            'total' => $subtotal,
            'source' => 'web',
            'channel' => 'marketplace',
            'placed_at' => now(),
        ];
    }
}
