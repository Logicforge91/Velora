<?php

namespace Database\Factories;

use App\Models\Integration;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Integration>
 */
class IntegrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category' => fake()->unique()->slug(2),
            'provider' => 'custom',
            'enabled' => true,
            'configuration' => ['endpoint' => fake()->url()],
            'credentials' => ['api_key' => fake()->uuid()],
            'status' => 'configured',
            'last_configured_at' => now(),
        ];
    }
}
