<?php

use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;

test('authorized administrators can open system settings', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.system-settings.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/system-settings/index')
            ->has('definitions', 15)
            ->where('settings.general.site_name', 'Velora')
            ->where('operations.database_driver', 'sqlite')
        );
});

test('system settings are validated and persisted by group', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->patch(route('admin.system-settings.update', 'general'), [
            'settings' => [
                'site_name' => 'Velora India',
                'support_email' => 'care@velora.test',
                'support_phone' => '+91 80000 00000',
                'timezone' => 'Asia/Kolkata',
            ],
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $setting = SystemSetting::query()->where('group', 'general')->firstOrFail();

    expect($setting->values)
        ->toMatchArray(['site_name' => 'Velora India', 'support_email' => 'care@velora.test'])
        ->and($setting->updated_by)->toBe($admin->id);
});

test('customers cannot access or mutate system settings', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('admin.system-settings.index'))
        ->assertForbidden();

    $this->actingAs($customer)
        ->patch(route('admin.system-settings.update', 'general'), ['settings' => []])
        ->assertForbidden();
});

test('administrators can clear the application cache', function () {
    $admin = User::factory()->admin()->create();
    Cache::put('system-settings-test', 'cached', now()->addMinute());

    $this->actingAs($admin)
        ->delete(route('admin.system-settings.cache.clear'))
        ->assertRedirect()
        ->assertSessionHas('success');

    expect(Cache::has('system-settings-test'))->toBeFalse();
});
