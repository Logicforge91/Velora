<?php

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('administrators can list and filter product variants', function () {
    $admin = User::factory()->admin()->create();
    ProductVariant::factory()->create(['name' => 'Midnight 128 GB']);
    ProductVariant::factory()->create(['name' => 'Silver 256 GB']);

    $this->actingAs($admin)->get(route('admin.product-variants.index', ['search' => 'Midnight']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/product-variants/index')
            ->has('variants.data', 1)
            ->where('variants.data.0.name', 'Midnight 128 GB')
            ->has('counts')
            ->has('products'));
});

test('administrators can create a default product variant', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create();
    $existing = ProductVariant::factory()->default()->for($product)->create();

    $response = $this->actingAs($admin)->post(route('admin.product-variants.store'), [
        'product_id' => $product->id,
        'name' => 'Ocean Blue / 256 GB',
        'sku' => 'phone-blue-256',
        'attributes' => [
            ['name' => 'Color', 'value' => 'Ocean Blue'],
            ['name' => 'Storage', 'value' => '256 GB'],
        ],
        'price' => 54999,
        'compare_at_price' => 59999,
        'stock' => 24,
        'low_stock_threshold' => 4,
        'status' => true,
        'is_default' => true,
    ]);

    $variant = ProductVariant::query()->where('sku', 'PHONE-BLUE-256')->firstOrFail();

    $response->assertRedirect(route('admin.product-variants.edit', $variant));
    expect($variant->is_default)->toBeTrue()
        ->and($variant->attributes)->toHaveCount(2)
        ->and($existing->fresh()->is_default)->toBeFalse();
});

test('non administrators cannot manage product variants', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)->get(route('admin.product-variants.index'))->assertForbidden();
});
