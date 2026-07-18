<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return ['product_id' => Product::factory(), 'user_id' => User::factory(), 'rating' => 5, 'title' => fake()->sentence(4), 'body' => fake()->paragraph(), 'status' => 'approved'];
    }
}
