<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\ShipmentEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShipmentEvent>
 */
class ShipmentEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'shipment_id' => fn (): int => (int) Order::factory()->create()->shipment()->value('id'),
            'status' => 'in_transit',
            'location' => fake()->city(),
            'message' => fake()->sentence(),
            'occurred_at' => now(),
            'customer_visible' => true,
        ];
    }
}
