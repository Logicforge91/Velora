<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<CartItem> */
class CartItemFactory extends Factory
{
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 5);
        $unitPrice = fake()->randomFloat(2, 199, 99999);

        return [
            'cart_id' => Cart::factory(),
            'product_id' => Product::factory(),
            'product_variant_id' => null,
            'vendor_id' => null,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'original_price' => $unitPrice,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'line_total' => $unitPrice * $quantity,
            'is_selected' => true,
            'saved_for_later' => false,
            'metadata' => null,
        ];
    }

    public function savedForLater(): static
    {
        return $this->state(fn (): array => [
            'is_selected' => false,
            'saved_for_later' => true,
        ]);
    }
}
