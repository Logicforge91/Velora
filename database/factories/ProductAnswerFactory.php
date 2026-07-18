<?php

namespace Database\Factories;

use App\Models\ProductAnswer;
use App\Models\ProductQuestion;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductAnswer>
 */
class ProductAnswerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return ['product_question_id' => ProductQuestion::factory(), 'user_id' => User::factory(), 'answer' => fake()->paragraph(), 'status' => 'approved'];
    }
}
