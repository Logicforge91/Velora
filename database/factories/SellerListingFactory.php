<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\SellerListing;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<SellerListing> */
class SellerListingFactory extends Factory
{
    public function definition(): array
    {
        $price = fake()->randomFloat(2, 199, 99999);

        return [
            'vendor_id' => Vendor::factory(),
            'product_id' => Product::factory(),
            'seller_sku' => fake()->unique()->bothify('SELLER-??-#####'),
            'condition' => 'new',
            'mrp' => $price * 1.1,
            'selling_price' => $price,
            'stock' => 50,
            'reserved' => 0,
            'minimum_order_quantity' => 1,
            'handling_time_days' => 1,
            'fulfilment_type' => 'seller',
            'commission_rate' => 10,
            'is_buy_box_winner' => false,
            'status' => 'active',
            'published_at' => now(),
        ];
    }
}
