<?php

namespace App\Http\Controllers;

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

    public function cart(): Response
    {
        return Inertia::render('storefront/cart');
    }

    public function checkout(): Response
    {
        return Inertia::render('storefront/checkout');
    }
}
