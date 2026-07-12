<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login from the admin dashboard', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('login'));
});

test('admins can access the admin dashboard', function () {
    $this->withoutVite();

    $admin = User::factory()->create([
        'role' => User::ROLE_ADMIN,
        'status' => true,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertViewIs('admin.dashboard')
        ->assertSee('Dashboard Overview');
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
    $admin = User::factory()->create([
        'role' => User::ROLE_ADMIN,
        'status' => false,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertRedirect(route('login'));

    $this->assertGuest();
});

test('admins are redirected from the standard dashboard to the admin dashboard', function () {
    $admin = User::factory()->create([
        'role' => User::ROLE_ADMIN,
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

    $this->actingAs($customer)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('pendingInvitations')
        );
});
