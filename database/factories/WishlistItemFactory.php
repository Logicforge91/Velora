<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Wishlist;
use App\Models\WishlistItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<WishlistItem> */
class WishlistItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'wishlist_id' => Wishlist::factory(),
            'product_id' => Product::factory(),
            'product_variant_id' => null,
            'price_when_added' => fake()->randomFloat(2, 199, 99999),
            'priority' => fake()->numberBetween(0, 3),
            'notify_price_drop' => true,
            'notify_back_in_stock' => true,
            'notes' => null,
            'added_at' => now(),
        ];
    }
}
