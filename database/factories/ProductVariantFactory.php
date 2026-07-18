<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ProductVariant> */
class ProductVariantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'name' => fake()->randomElement(['Midnight / 128 GB', 'Silver / Large', 'Blue / 256 GB']),
            'sku' => fake()->unique()->bothify('VAR-??-#####'),
            'attributes' => [
                ['name' => 'Color', 'value' => fake()->safeColorName()],
                ['name' => 'Size', 'value' => fake()->randomElement(['S', 'M', 'L', '128 GB'])],
            ],
            'price' => fake()->randomFloat(2, 199, 99999),
            'compare_at_price' => null,
            'stock' => fake()->numberBetween(0, 100),
            'low_stock_threshold' => 5,
            'status' => true,
            'is_default' => false,
        ];
    }

    public function default(): static
    {
        return $this->state(fn (): array => ['is_default' => true]);
    }
}
