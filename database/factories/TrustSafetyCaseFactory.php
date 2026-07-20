<?php

namespace Database\Factories;

use App\Models\TrustSafetyCase;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TrustSafetyCase>
 */
class TrustSafetyCaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category' => fake()->randomElement(['fraudulent_order', 'suspicious_transaction', 'seller_fraud', 'fake_product', 'policy_violation']),
            'status' => fake()->randomElement(['open', 'in_review', 'resolved']),
            'severity' => fake()->randomElement(['low', 'medium', 'high', 'critical']),
            'risk_score' => fake()->numberBetween(10, 100),
            'source' => 'rule_engine',
            'summary' => fake()->sentence(6),
            'description' => fake()->paragraph(),
            'evidence' => ['signal' => fake()->word()],
            'detected_at' => fake()->dateTimeBetween('-30 days'),
        ];
    }
}
