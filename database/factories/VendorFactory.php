<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vendor>
 */
class VendorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->customer(),
            'business_name' => fake()->unique()->company(),
            'business_email' => fake()->unique()->companyEmail(),
            'business_phone' => fake()->numerify('9#########'),
            'tax_number' => fake()->unique()->bothify('##?????####?1Z?'),
            'address' => fake()->address(),
            'status' => Vendor::STATUS_PENDING,
        ];
    }
}
