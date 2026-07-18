<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Product> */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = Str::of(fake()->unique()->sentence(3))->trim('.')->toString();

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numerify('####'),
            'sku' => fake()->unique()->bothify('VEL-??-#####'),
            'short_description' => fake()->sentence(12),
            'description' => fake()->paragraphs(3, true),
            'price' => fake()->randomFloat(2, 199, 99999),
            'compare_at_price' => null,
            'stock' => fake()->numberBetween(0, 250),
            'low_stock_threshold' => 5,
            'status' => Product::STATUS_ACTIVE,
            'is_featured' => fake()->boolean(20),
            'product_type' => 'physical',
            'tax_rate' => fake()->randomElement([0, 5, 12, 18, 28]),
            'weight_kg' => fake()->randomFloat(3, 0.1, 20),
            'dimensions' => [
                'length_cm' => fake()->randomFloat(1, 5, 100),
                'width_cm' => fake()->randomFloat(1, 5, 100),
                'height_cm' => fake()->randomFloat(1, 2, 80),
            ],
            'specifications' => [],
            'shipping_class' => 'standard',
            'country_of_origin' => 'India',
            'return_window_days' => 7,
            'replacement_window_days' => 7,
            'cod_eligible' => true,
            'free_shipping' => false,
            'published_at' => now(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (): array => ['status' => Product::STATUS_DRAFT]);
    }

    public function lowStock(): static
    {
        return $this->state(fn (): array => ['stock' => 3, 'low_stock_threshold' => 5]);
    }
}
