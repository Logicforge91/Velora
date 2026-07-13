<?php

use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('administrators can view operational analytics', function () {
    $admin = User::factory()->admin()->create();
    Product::factory()->lowStock()->create();

    $this->actingAs($admin)->get(route('admin.analytics'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/analytics')
            ->where('summary.stock_alerts', 1)
            ->has('dailyRevenue')
            ->has('orderStatuses')
            ->has('topProducts')
            ->has('lowStockProducts', 1));
});
