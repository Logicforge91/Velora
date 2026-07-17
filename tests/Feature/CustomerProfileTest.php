<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from the customer profile', function () {
    $this->get(route('customer.profile.edit'))
        ->assertRedirect(route('login'));
});

test('customers can open their dedicated profile page', function () {
    $this->withoutVite();

    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('customer.profile.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/profile')
            ->has('joinedAt'));
});

test('customers can update their profile', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->patch(route('customer.profile.update'), [
            'name' => 'Suman Kumar',
            'email' => 'suman.kumar@example.com',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('customer.profile.edit'));

    expect($customer->refresh())
        ->name->toBe('Suman Kumar')
        ->email->toBe('suman.kumar@example.com');
});

test('administrators cannot use the customer profile', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('customer.profile.edit'))
        ->assertForbidden();

    $this->actingAs($admin)
        ->patch(route('customer.profile.update'), [
            'name' => 'Wrong Portal',
            'email' => $admin->email,
        ])
        ->assertForbidden();
});
