<?php

use App\Enums\AccountPermission;
use App\Models\AdminRole;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('authorized administrators can view governance metrics', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.administration'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/administration/index')
            ->where('metrics.admin_users', 1)
            ->where('metrics.roles', AdminRole::query()->count())
            ->where('metrics.permissions', count(AccountPermission::assignableToAdmin()))
            ->has('metrics', 13)
        );
});

test('customers cannot access administration governance', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('admin.administration'))
        ->assertForbidden();
});
