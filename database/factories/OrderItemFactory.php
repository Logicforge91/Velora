<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<OrderItem> */
class OrderItemFactory extends Factory
{
    public function definition(): array
    {
        $price = fake()->randomFloat(2, 199, 99999);

        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'product_name' => fake()->words(3, true),
            'sku' => fake()->unique()->bothify('SKU-??-#####'),
            'unit_price' => $price,
            'quantity' => 1,
            'total' => $price,
            'fulfilment_status' => 'pending',
        ];
    }
}
