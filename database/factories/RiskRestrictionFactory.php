<?php

namespace Database\Factories;

use App\Models\RiskRestriction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RiskRestriction>
 */
class RiskRestrictionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['ip', 'customer', 'seller']),
            'identifier' => fake()->unique()->uuid(),
            'reason' => fake()->sentence(4),
            'active' => true,
        ];
    }
}
