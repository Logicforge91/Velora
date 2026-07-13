<?php

namespace Database\Factories;

use App\Models\AdminAuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AdminAuditLog>
 */
class AdminAuditLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event_uuid' => fake()->uuid(),
            'actor_id' => User::factory()->admin(),
            'category' => fake()->randomElement(['users', 'orders', 'vendors', 'products']),
            'action' => fake()->randomElement(['store', 'update', 'destroy', 'approve']),
            'severity' => 'info',
            'description' => fake()->sentence(),
            'route_name' => 'admin.users.update',
            'method' => 'PATCH',
            'path' => 'admin/users/1',
            'response_status' => 302,
            'succeeded' => true,
            'duration_ms' => fake()->numberBetween(10, 1000),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'before_values' => [],
            'after_values' => [],
            'metadata' => [],
            'record_hash' => fake()->unique()->sha256(),
            'occurred_at' => now(),
        ];
    }
}
