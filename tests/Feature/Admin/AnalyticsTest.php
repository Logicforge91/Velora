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
            ->where('filters.report', 'sales')
            ->where('report.label', 'Sales Reports')
            ->has('catalog', 22)
            ->has('report.columns')
            ->has('report.rows')
            ->has('dailyRevenue')
        );
});

test('administrators can open a filtered report', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get(route('admin.analytics', [
        'report' => 'inventory',
        'from' => now()->subWeek()->toDateString(),
        'to' => now()->toDateString(),
    ]))->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.report', 'inventory')
            ->where('report.label', 'Inventory Reports')
            ->has('report.columns', 5));
});

test('analytics report filters are validated', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get(route('admin.analytics', ['report' => 'unknown']))
        ->assertSessionHasErrors('report');
});
