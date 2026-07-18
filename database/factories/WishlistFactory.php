<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Wishlist> */
class WishlistFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement(['My Wishlist', 'Festival Deals', 'Buy Later']),
            'is_default' => false,
            'is_public' => false,
            'share_token' => null,
        ];
    }

    public function default(): static
    {
        return $this->state(fn (): array => ['is_default' => true, 'name' => 'My Wishlist']);
    }

    public function public(): static
    {
        return $this->state(fn (): array => [
            'is_public' => true,
            'share_token' => Str::random(40),
        ]);
    }
}
