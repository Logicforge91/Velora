<?php

namespace Database\Factories;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Brand>
 */
class BrandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'name' => $name,
            'slug' => fake()->unique()->slug(),
            'description' => fake()->optional()->paragraph(),
            'logo' => null,
            'website_url' => fake()->optional()->url(),
            'sort_order' => fake()->numberBetween(0, 100),
            'is_featured' => false,
            'status' => true,
        ];
    }
}
