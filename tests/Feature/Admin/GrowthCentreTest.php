<?php

use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;
use Inertia\Testing\AssertableInertia as Assert;

test('administrators can view marketplace growth intelligence', function () {
    $admin = User::factory()->admin()->create();
    $vendor = Vendor::factory()->create(['status' => Vendor::STATUS_APPROVED]);
    Product::factory()->for($vendor)->create([
        'price' => 1000,
        'stock' => 20,
        'low_stock_threshold' => 5,
    ]);
    Product::factory()->for($vendor)->lowStock()->create();

    $this->actingAs($admin)
        ->get(route('admin.growth-centre'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('admin/growth-centre')
            ->where('overview.approved_sellers', 1)
            ->where('overview.active_listings', 2)
            ->has('sellerPerformance', 1)
            ->has('priceRecommendations', 1)
            ->has('catalogueAlerts.low_stock', 1));
});

test('administrators can apply a bounded price recommendation', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create([
        'price' => 1000,
        'compare_at_price' => null,
        'stock' => 20,
        'low_stock_threshold' => 5,
    ]);

    $this->actingAs($admin)
        ->from(route('admin.growth-centre'))
        ->patch(route('admin.growth-centre.recommended-price', $product))
        ->assertRedirect(route('admin.growth-centre'))
        ->assertSessionHas('success');

    expect($product->fresh())
        ->price->toBe('950.00')
        ->compare_at_price->toBe('1000.00');
});

test('low-stock products cannot receive price recommendations', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->lowStock()->create(['price' => 1000]);

    $this->actingAs($admin)
        ->from(route('admin.growth-centre'))
        ->patch(route('admin.growth-centre.recommended-price', $product))
        ->assertRedirect(route('admin.growth-centre'))
        ->assertSessionHasErrors('product');

    expect($product->fresh()->price)->toBe('1000.00');
});

test('customers cannot access marketplace growth intelligence', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('admin.growth-centre'))
        ->assertForbidden();
});
