<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Cart> */
class CartFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'session_id' => null,
            'coupon_id' => null,
            'status' => Cart::STATUS_ACTIVE,
            'currency' => 'INR',
            'subtotal' => 0,
            'discount_total' => 0,
            'tax_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 0,
            'metadata' => null,
            'last_activity_at' => now(),
            'expires_at' => now()->addDays(30),
        ];
    }

    public function guest(): static
    {
        return $this->state(fn (): array => [
            'user_id' => null,
            'session_id' => fake()->uuid(),
            'expires_at' => now()->addDays(7),
        ]);
    }
}
