<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('administrators can filter products by catalogue and inventory state', function () {
    $admin = User::factory()->admin()->create();
    Product::factory()->create(['name' => 'Healthy Phone', 'stock' => 50]);
    Product::factory()->lowStock()->create(['name' => 'Low Phone']);

    $this->actingAs($admin)->get(route('admin.products.index', ['search' => 'Low', 'stock' => 'low']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Low Phone')
            ->has('counts'));
});

test('administrators can create products with a primary image', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $category = Category::query()->create(['name' => 'Mobiles', 'slug' => 'mobiles', 'status' => true]);

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'category_id' => $category->id,
        'name' => 'Velora Phone Pro',
        'slug' => '',
        'sku' => 'vel-phone-pro',
        'short_description' => 'Flagship marketplace phone.',
        'description' => 'A complete description for the catalogue item.',
        'price' => 49999,
        'compare_at_price' => 54999,
        'stock' => 25,
        'low_stock_threshold' => 5,
        'status' => Product::STATUS_ACTIVE,
        'is_featured' => true,
        'primary_image' => UploadedFile::fake()->image('phone.webp'),
    ]);

    $product = Product::query()->where('sku', 'VEL-PHONE-PRO')->firstOrFail();
    $response->assertRedirect(route('admin.products.edit', $product));
    expect($product->slug)->toBe('velora-phone-pro')->and($product->primaryImage)->not->toBeNull();
    Storage::disk('public')->assertExists($product->primaryImage->path);
});

test('non administrators cannot manage products', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)->get(route('admin.products.index'))->assertForbidden();
});
