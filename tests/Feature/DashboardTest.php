<?php

use App\Models\AdminAuditLog;
use App\Models\Order;
use App\Models\Product;
use App\Models\ReturnCase;
use App\Models\User;
use App\Models\Vendor;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login from the admin dashboard', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('admin.login'));
});

test('admins can access the admin dashboard', function () {
    $this->withoutVite();

    $admin = User::factory()->admin()->create([
        'status' => true,
    ]);
    Vendor::factory()->create(['status' => Vendor::STATUS_PENDING]);
    Vendor::factory()->create(['status' => Vendor::STATUS_APPROVED]);
    Product::factory()->lowStock()->create();
    $order = Order::factory()->create([
        'status' => Order::STATUS_DELIVERED,
        'total' => 1000,
        'placed_at' => now(),
    ]);
    $order->payment()->update(['refunded_amount' => 100]);
    $order->shipment()->update(['status' => 'delivered']);
    ReturnCase::query()->create([
        'order_id' => $order->id,
        'customer_id' => $order->user_id,
        'number' => 'RET-DASH-1001',
        'reason_code' => 'damaged',
        'status' => 'requested',
        'refund_amount' => 100,
        'requested_at' => now(),
    ]);
    AdminAuditLog::factory()->for($admin, 'actor')->create([
        'description' => 'Seller application reviewed.',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('statistics.total_vendors', 2)
            ->where('statistics.pending_vendors', 1)
            ->where('statistics.pending_approvals', 1)
            ->where('statistics.active_sellers', 1)
            ->where('statistics.active_customers', 3)
            ->where('statistics.low_stock_products', 1)
            ->where('statistics.today_orders', 1)
            ->where('statistics.gross_revenue', 1000.0)
            ->where('statistics.net_revenue', 900.0)
            ->where('statistics.total_returns', 1)
            ->where('statistics.pending_returns', 1)
            ->where('statistics.fulfilled_shipments', 1)
            ->where('statistics.fulfilment_rate', 100)
            ->has('recentActivities', 1)
            ->where('recentActivities.0.description', 'Seller application reviewed.')
            ->where('adminRoleMix', fn ($roles) => collect($roles)->contains(
                fn ($role) => $role['name'] === 'Super Administrator'
                    && $role['administrators_count'] === 1
            ))
        );
});

test('customers cannot access the admin dashboard', function () {
    $customer = User::factory()->create([
        'role' => User::ROLE_CUSTOMER,
        'status' => true,
    ]);

    $this->actingAs($customer)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('inactive admins cannot access the dashboard', function () {
    $admin = User::factory()->admin()->create([
        'status' => false,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertRedirect(route('admin.login'));

    $this->assertGuest();
});

test('admins are redirected from the standard dashboard to the admin dashboard', function () {
    $admin = User::factory()->admin()->create([
        'status' => true,
    ]);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertRedirect(route('admin.dashboard'));
});

test('customers can access the standard dashboard', function () {
    $customer = User::factory()->create([
        'role' => User::ROLE_CUSTOMER,
        'status' => true,
    ]);

    $order = Order::query()->create([
        'user_id' => $customer->id,
        'number' => 'VEL-CUS-1001',
        'status' => Order::STATUS_SHIPPED,
        'shipping_address' => ['city' => 'Bengaluru'],
        'subtotal' => 2499,
        'total' => 2499,
        'placed_at' => now(),
    ]);

    $order->items()->create([
        'product_name' => 'Studio Wireless Headphones',
        'sku' => 'STUDIO-01',
        'unit_price' => 2499,
        'quantity' => 1,
        'total' => 2499,
    ]);

    $this->actingAs($customer)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('pendingInvitations')
            ->where('orderSummary.total', 1)
            ->where('orderSummary.active', 1)
            ->where('orderSummary.delivered', 0)
            ->has('recentOrders', 1)
            ->where('recentOrders.0.number', 'VEL-CUS-1001')
            ->where('recentOrders.0.itemPreview', 'Studio Wireless Headphones')
        );
});
