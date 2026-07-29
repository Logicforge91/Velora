<?php

namespace Database\Factories;

use App\Models\Integration;
use App\Models\IntegrationLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<IntegrationLog>
 */
class IntegrationLogFactory extends Factory
{
    protected $model = IntegrationLog::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'integration_id' => Integration::factory(),
            'category' => 'payment_gateways',
            'action' => 'configuration_updated',
            'status' => 'success',
            'message' => 'Integration configuration updated.',
            'actor_id' => User::factory()->admin(),
            'occurred_at' => now(),
        ];
    }
}
