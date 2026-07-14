<?php

use App\Enums\AccountPermission;
use App\Models\AdminRole;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('legacy administrators retain super admin access to role management', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.admin-roles.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/admin-roles/index')
            ->has('roles.data')
            ->where('counts.legacy_super_admins', 1)
        );
});

test('super administrators can assign a restricted operational role', function () {
    $superAdmin = User::factory()->admin()->create();
    $catalogueAdmin = User::factory()->admin()->create();

    $response = $this->actingAs($superAdmin)->post(route('admin.admin-roles.store'), [
        'name' => 'Catalogue Manager',
        'slug' => 'catalogue-manager',
        'description' => 'Controls catalogue operations.',
        'permissions' => [
            AccountPermission::AccessAdminDashboard->value,
            AccountPermission::ManageCatalogue->value,
        ],
        'user_ids' => [$catalogueAdmin->id],
    ]);

    $role = AdminRole::query()->where('slug', 'catalogue-manager')->firstOrFail();

    $response->assertRedirect(route('admin.admin-roles.edit', $role));
    expect($catalogueAdmin->fresh()->uses_custom_admin_roles)->toBeTrue()
        ->and($catalogueAdmin->fresh()->hasPermission(AccountPermission::ManageCatalogue))->toBeTrue()
        ->and($catalogueAdmin->fresh()->hasPermission(AccountPermission::ManageUsers))->toBeFalse();

    $restrictedAdmin = $catalogueAdmin->fresh();

    $this->actingAs($restrictedAdmin)->get(route('admin.products.index'))->assertOk();
    $this->actingAs($restrictedAdmin)->get(route('admin.users.index'))->assertForbidden();
    $this->actingAs($restrictedAdmin)->get(route('admin.admin-roles.index'))->assertForbidden();
});

test('assigned permissions are shared with the admin interface', function () {
    $admin = User::factory()->admin()->create(['uses_custom_admin_roles' => true]);
    $role = AdminRole::factory()->create([
        'permissions' => [
            AccountPermission::AccessAdminDashboard->value,
            AccountPermission::ViewReports->value,
        ],
    ]);
    $role->users()->attach($admin);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.permissions', [
                AccountPermission::AccessAdminDashboard->value,
                AccountPermission::ViewReports->value,
            ])
        );
});

test('administrators cannot change their own role assignment', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('admin.admin-roles.store'), [
        'name' => 'Unsafe Role',
        'slug' => 'unsafe-role',
        'description' => null,
        'permissions' => [AccountPermission::AccessAdminDashboard->value],
        'user_ids' => [$admin->id],
    ])->assertSessionHasErrors('user_ids.0');

    expect(AdminRole::query()->where('slug', 'unsafe-role')->exists())->toBeFalse();
});

test('assigned and system roles cannot be deleted', function () {
    $admin = User::factory()->admin()->create();
    $managedAdmin = User::factory()->admin()->create();
    $role = AdminRole::factory()->create();
    $role->users()->attach($managedAdmin);

    $this->actingAs($admin)
        ->delete(route('admin.admin-roles.destroy', $role))
        ->assertSessionHasErrors('role');

    expect($role->fresh())->not->toBeNull();
});
