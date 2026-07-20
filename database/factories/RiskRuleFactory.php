<?php

namespace Database\Factories;

use App\Models\RiskRule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RiskRule>
 */
class RiskRuleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->sentence(3),
            'category' => fake()->randomElement(['order', 'payment', 'seller', 'customer', 'listing']),
            'description' => fake()->sentence(),
            'conditions' => ['field' => 'risk_score', 'operator' => '>=', 'value' => 70],
            'action' => fake()->randomElement(['flag', 'hold', 'manual_review', 'block']),
            'risk_score' => fake()->numberBetween(10, 100),
            'enabled' => true,
        ];
    }
}
