<?php

use Inertia\Testing\AssertableInertia as Assert;

test('storefront inner pages are available', function (string $routeName, string $component) {
    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page->component($component));
})->with([
    ['storefront.catalog', 'storefront/catalog'],
    ['storefront.wishlist', 'storefront/wishlist'],
    ['storefront.comparison', 'storefront/comparison'],
    ['storefront.cart', 'storefront/cart'],
    ['storefront.checkout', 'storefront/checkout'],
    ['storefront.shipping-delivery', 'storefront/shipping-delivery'],
    ['storefront.promotions', 'storefront/promotions'],
]);

test('product page receives its slug', function () {
    $this->get(route('storefront.product', 'nova-x-pro-smartphone'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('storefront/product')
            ->where('productSlug', 'nova-x-pro-smartphone'));
});
