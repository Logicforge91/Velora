<?php

namespace Database\Factories;

use App\Models\NotificationRule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NotificationRule>
 */
class NotificationRuleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'event' => fake()->unique()->slug(3),
            'audience' => fake()->randomElement(['admin', 'seller', 'customer']),
            'channels' => ['mail', 'database'],
            'templates' => [],
            'conditions' => [],
            'enabled' => true,
            'updated_by' => User::factory()->admin(),
        ];
    }
}
