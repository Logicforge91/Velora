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
        $name = fake()->unique()->words(3, true);

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
