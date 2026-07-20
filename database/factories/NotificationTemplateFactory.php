<?php

namespace Database\Factories;

use App\Models\NotificationTemplate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NotificationTemplate>
 */
class NotificationTemplateFactory extends Factory
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
            'slug' => fake()->unique()->slug(3),
            'channel' => fake()->randomElement(['mail', 'sms', 'push', 'whatsapp']),
            'audience' => fake()->randomElement(['admin', 'seller', 'customer']),
            'subject' => fake()->sentence(),
            'body' => fake()->paragraph(),
            'variables' => ['name', 'order_number'],
            'enabled' => true,
            'updated_by' => User::factory()->admin(),
        ];
    }
}
