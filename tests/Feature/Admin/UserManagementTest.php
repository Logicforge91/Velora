<?php

use App\Enums\AccountRole;
use App\Models\AdminRole;
use App\Models\User;
use App\Models\UserHistory;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('administrators can view and filter the user list', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->customer()->create(['name' => 'Avery Customer']);
    User::factory()->vendor()->create(['name' => 'Taylor Vendor']);

    $response = $this->actingAs($admin)->get(route('admin.users.index', [
        'search' => 'Avery',
        'role' => AccountRole::Customer->value,
        'status' => 'active',
    ]));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('admin/users/index')
        ->has('users.data', 1)
        ->where('users.data.0.name', 'Avery Customer')
        ->has('counts')
        ->has('roles', count(AccountRole::cases()))
    );
});

test('administrator role dropdown matches roles configured in admin roles', function () {
    $admin = User::factory()->admin()->create();
    $operationsRole = AdminRole::factory()->create(['name' => 'Marketplace Operations']);

    $this->actingAs($admin)
        ->get(route('admin.users.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/form')
            ->missing('roles')
            ->where('adminRoles', fn ($roles) => collect($roles)->contains(fn ($role) => $role['id'] === $operationsRole->id && $role['name'] === 'Marketplace Operations'))
        );

    $response = $this->actingAs($admin)->post(route('admin.users.store'), [
        'name' => 'Operations Administrator',
        'email' => 'operations@example.com',
        'role' => AccountRole::Admin->value,
        'admin_role_id' => $operationsRole->id,
        'status' => true,
        'password' => 'correct-horse-battery-staple',
        'password_confirmation' => 'correct-horse-battery-staple',
    ]);

    $managedAdmin = User::query()->where('email', 'operations@example.com')->firstOrFail();

    $response->assertRedirect(route('admin.users.show', $managedAdmin));
    expect($managedAdmin->adminRoles()->sole()->is($operationsRole))->toBeTrue();

    $this->actingAs($admin)
        ->get(route('admin.users.index', ['admin_role' => $operationsRole->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.admin_roles.0.name', 'Marketplace Operations')
        );
});

test('administrators can create users and creation is recorded', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.users.store'), [
        'name' => 'Support Person',
        'email' => 'SUPPORT@EXAMPLE.COM',
        'role' => AccountRole::SupportAgent->value,
        'status' => true,
        'password' => 'correct-horse-battery-staple',
        'password_confirmation' => 'correct-horse-battery-staple',
    ]);

    $user = User::query()->where('email', 'support@example.com')->firstOrFail();

    $response->assertRedirect(route('admin.users.show', $user));
    expect(Hash::check('correct-horse-battery-staple', $user->password))->toBeTrue();
    expect($user->histories()->where('action', 'created')->where('actor_id', $admin->id)->exists())->toBeTrue();
});

test('administrators can update users and changed fields are recorded', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->customer()->create(['status' => true]);

    $response = $this->actingAs($admin)->put(route('admin.users.update', $user), [
        'name' => 'Updated Person',
        'email' => $user->email,
        'role' => AccountRole::DeliveryAgent->value,
        'status' => false,
        'password' => '',
        'password_confirmation' => '',
    ]);

    $response->assertRedirect(route('admin.users.show', $user));
    $user->refresh();
    $history = $user->histories()->where('action', 'updated')->firstOrFail();

    expect($user->name)->toBe('Updated Person')
        ->and($user->role)->toBe(AccountRole::DeliveryAgent->value)
        ->and($user->status)->toBeFalse()
        ->and($history->changes)->toHaveKeys(['name', 'role', 'status']);
});

test('administrators can soft delete users and still view their history', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->customer()->create();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $user))
        ->assertRedirect(route('admin.users.index'));

    expect(User::query()->find($user->id))->toBeNull()
        ->and(User::withTrashed()->find($user->id))->not->toBeNull()
        ->and(UserHistory::query()->where('user_id', $user->id)->where('action', 'deleted')->exists())->toBeTrue();

    $this->actingAs($admin)
        ->get(route('admin.users.history', $user->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/history')
            ->where('managedUser.id', $user->id)
            ->where('managedUser.deleted_at', fn ($value) => $value !== null)
        );
});

test('administrators cannot delete or demote their own account', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->from(route('admin.users.show', $admin))
        ->delete(route('admin.users.destroy', $admin))
        ->assertSessionHasErrors('user');

    $this->actingAs($admin)
        ->from(route('admin.users.edit', $admin))
        ->put(route('admin.users.update', $admin), [
            'name' => $admin->name,
            'email' => $admin->email,
            'role' => AccountRole::Customer->value,
            'status' => true,
            'password' => '',
            'password_confirmation' => '',
        ])
        ->assertSessionHasErrors('user');

    expect($admin->fresh()->isAdmin())->toBeTrue();
});

test('non administrators cannot access user management', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('admin.users.index'))
        ->assertForbidden();
});
