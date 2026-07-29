<?php

namespace Database\Factories;

use App\Models\NotificationDelivery;
use App\Models\NotificationRule;
use App\Models\NotificationTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NotificationDelivery>
 */
class NotificationDeliveryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'notification_rule_id' => NotificationRule::factory(),
            'notification_template_id' => NotificationTemplate::factory(),
            'channel' => 'mail',
            'audience' => 'customer',
            'recipient' => fake()->safeEmail(),
            'status' => 'sent',
            'payload' => ['subject' => fake()->sentence()],
            'attempts' => 1,
            'queued_at' => now()->subMinute(),
            'sent_at' => now(),
        ];
    }
}
