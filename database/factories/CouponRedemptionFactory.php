<?php

namespace Database\Factories;

use App\Models\Coupon;
use App\Models\CouponRedemption;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CouponRedemption>
 */
class CouponRedemptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return ['coupon_id' => Coupon::factory(), 'user_id' => User::factory(), 'code_snapshot' => fake()->unique()->bothify('SAVE##??'), 'discount_amount' => 100, 'status' => 'redeemed', 'redeemed_at' => now()];
    }
}
