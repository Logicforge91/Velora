<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function catalog(): Response
    {
        return Inertia::render('storefront/catalog');
    }

    public function product(string $product): Response
    {
        return Inertia::render('storefront/product', [
            'productSlug' => $product,
        ]);
    }

    public function wishlist(): Response
    {
        return Inertia::render('storefront/wishlist');
    }

    public function comparison(): Response
    {
        return Inertia::render('storefront/comparison');
    }

    public function cart(): Response
    {
        return Inertia::render('storefront/cart');
    }

    public function checkout(Request $request): Response
    {
        return Inertia::render('storefront/checkout', [
            'addresses' => $request->user()?->addresses()
                ->latest('is_default_shipping')
                ->latest()
                ->get() ?? [],
        ]);
    }

    public function shippingDelivery(): Response
    {
        return Inertia::render('storefront/shipping-delivery');
    }

    public function promotions(): Response
    {
        return Inertia::render('storefront/promotions');
    }
}
