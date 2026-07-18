<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\InventoryReservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<InventoryReservation> */
class InventoryReservationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'inventory_id' => Inventory::factory(),
            'quantity' => 1,
            'status' => 'active',
            'expires_at' => now()->addMinutes(15),
        ];
    }
}
