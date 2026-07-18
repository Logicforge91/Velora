<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\InventoryMovement;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<InventoryMovement> */
class InventoryMovementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'inventory_id' => Inventory::factory(),
            'type' => 'purchase_receipt',
            'quantity' => 10,
            'before_quantity' => 90,
            'after_quantity' => 100,
            'reason' => 'Inbound stock receipt',
            'occurred_at' => now(),
        ];
    }
}
