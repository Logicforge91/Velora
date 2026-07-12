<?php

use App\Enums\AccountPermission;
use App\Enums\AccountRole;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

test('administrator role receives every account permission', function () {
    expect(AccountRole::Admin->permissions())
        ->toHaveCount(count(AccountPermission::cases()));
});

test('account roles receive only their intended permissions', function (AccountRole $role, AccountPermission $allowed, AccountPermission $denied) {
    expect($role->hasPermission($allowed))->toBeTrue()
        ->and($role->hasPermission($denied))->toBeFalse();
})->with([
    'vendor' => [AccountRole::Vendor, AccountPermission::ManageOwnCatalogue, AccountPermission::ManageUsers],
    'customer' => [AccountRole::Customer, AccountPermission::Shop, AccountPermission::ManageCatalogue],
    'delivery agent' => [AccountRole::DeliveryAgent, AccountPermission::ManageAssignedDeliveries, AccountPermission::HandleSupportRequests],
    'support agent' => [AccountRole::SupportAgent, AccountPermission::HandleSupportRequests, AccountPermission::ManageAssignedDeliveries],
]);

test('account permissions are registered as Laravel gates', function () {
    $admin = User::factory()->admin()->create();

    foreach (AccountPermission::cases() as $permission) {
        expect(Gate::forUser($admin)->allows($permission->value))->toBeTrue();
    }
});

test('permission middleware authorizes and denies users by capability', function () {
    Route::get('/_test/vendor-catalogue', fn () => response()->noContent())
        ->middleware(['web', 'auth', 'permission:catalogue.own.manage']);

    $vendor = User::factory()->vendor()->create();
    $customer = User::factory()->customer()->create();

    $this->actingAs($vendor)
        ->get('/_test/vendor-catalogue')
        ->assertNoContent();

    $this->actingAs($customer)
        ->get('/_test/vendor-catalogue')
        ->assertForbidden();
});

test('permissions are shared with Inertia clients', function () {
    $vendor = User::factory()->vendor()->create();

    $this->actingAs($vendor)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.permissions', fn (array $permissions) => in_array(AccountPermission::ManageOwnCatalogue->value, $permissions, true))
        );
});

test('unknown account roles receive no permissions', function () {
    $user = User::factory()->create(['role' => 'unknown']);

    expect($user->accountRole())->toBeNull()
        ->and($user->permissions())->toBeEmpty()
        ->and($user->hasPermission(AccountPermission::ManageUsers))->toBeFalse();
});
