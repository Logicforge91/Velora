<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Inventory> */
class InventoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'store_id' => Store::factory(),
            'product_id' => Product::factory(),
            'product_variant_id' => null,
            'on_hand' => 100,
            'reserved' => 0,
            'reorder_level' => 10,
            'safety_stock' => 5,
            'damaged' => 0,
            'inbound' => 0,
            'bin_location' => fake()->bothify('A-##-??'),
            'last_counted_at' => now(),
        ];
    }
}
