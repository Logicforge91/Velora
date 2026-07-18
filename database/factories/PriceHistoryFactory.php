<?php

namespace Database\Factories;

use App\Models\PriceHistory;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<PriceHistory> */
class PriceHistoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'price_type' => 'selling_price',
            'old_price' => 1200,
            'new_price' => 999,
            'change_source' => 'manual',
            'reason' => 'Marketplace promotion',
            'effective_from' => now(),
        ];
    }
}
