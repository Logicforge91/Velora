<?php

use App\Models\Address;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Wishlist;
use App\Models\WishlistItem;

test('customer commerce records support variant aware carts and wishlists', function () {
    $customer = User::factory()->customer()->create();
    $product = Product::factory()->create();
    $variant = ProductVariant::factory()->for($product)->create();
    $address = Address::factory()->defaultShipping()->for($customer)->create();
    $cart = Cart::factory()->for($customer)->create();
    $cartItem = CartItem::factory()->for($cart)->for($product)->create([
        'product_variant_id' => $variant->id,
    ]);
    $wishlist = Wishlist::factory()->default()->for($customer)->create();
    $wishlistItem = WishlistItem::factory()->for($wishlist)->for($product)->create([
        'product_variant_id' => $variant->id,
    ]);

    expect($customer->addresses()->first()->is($address))->toBeTrue()
        ->and($cart->items()->first()->is($cartItem))->toBeTrue()
        ->and($cartItem->variant->is($variant))->toBeTrue()
        ->and($wishlist->items()->first()->is($wishlistItem))->toBeTrue()
        ->and($wishlistItem->variant->is($variant))->toBeTrue()
        ->and($address->is_default_shipping)->toBeTrue();
});

test('guest carts are active until their expiry time', function () {
    $activeGuestCart = Cart::factory()->guest()->create();
    Cart::factory()->guest()->create(['expires_at' => now()->subMinute()]);

    expect(Cart::query()->active()->pluck('id')->all())
        ->toBe([$activeGuestCart->id])
        ->and($activeGuestCart->user_id)->toBeNull()
        ->and($activeGuestCart->session_id)->not->toBeNull();
});

test('public wishlists receive shareable marketplace identifiers', function () {
    $wishlist = Wishlist::factory()->public()->create();

    expect($wishlist->uuid)->not->toBeNull()
        ->and($wishlist->is_public)->toBeTrue()
        ->and($wishlist->share_token)->toHaveLength(40);
});
