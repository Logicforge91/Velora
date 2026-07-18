<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Coupon>
 */
class CouponFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return ['code' => Str::upper(Str::random(10)), 'name' => fake()->sentence(3), 'type' => 'percentage', 'value' => 10, 'minimum_order_amount' => 0, 'used_count' => 0, 'status' => true];
    }
}
