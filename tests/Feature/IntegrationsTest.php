<?php

use App\Models\Integration;
use App\Models\IntegrationLog;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('authorized administrators can open the integrations workspace', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.integrations.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/integrations/index')
            ->has('definitions', 12)
            ->where('integrations.payment_gateways.status', 'disconnected')
            ->where('integrations.social_login.provider', 'google')
        );
});

test('integration credentials are encrypted and never returned to the page', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->patch(route('admin.integrations.update', 'payment_gateways'), [
            'provider' => 'razorpay',
            'enabled' => true,
            'configuration' => ['merchant_id' => 'merchant-100'],
            'credentials' => [
                'api_key' => 'rzp_test_key',
                'api_secret' => 'super-secret-value',
                'webhook_secret' => 'webhook-secret-value',
            ],
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $integration = Integration::query()->where('category', 'payment_gateways')->firstOrFail();

    expect($integration->credentials['api_secret'])->toBe('super-secret-value')
        ->and($integration->getRawOriginal('credentials'))->not->toContain('super-secret-value')
        ->and(IntegrationLog::query()->whereBelongsTo($integration)->count())->toBe(1);

    $this->actingAs($admin)
        ->get(route('admin.integrations.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('integrations.payment_gateways.credentials_configured.api_secret', true)
            ->missing('integrations.payment_gateways.credentials')
        );
});

test('blank credential updates preserve existing encrypted secrets', function () {
    $admin = User::factory()->admin()->create();
    $integration = Integration::factory()->create([
        'category' => 'social_login',
        'provider' => 'google',
        'credentials' => ['client_secret' => 'existing-secret'],
        'configuration' => ['client_id' => 'client-one', 'redirect_url' => 'https://velora.test/oauth/google/callback'],
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.integrations.update', 'social_login'), [
            'provider' => 'google',
            'enabled' => true,
            'configuration' => ['client_id' => 'client-two', 'redirect_url' => 'https://velora.test/oauth/google/callback'],
            'credentials' => ['client_secret' => ''],
        ])
        ->assertSessionHasNoErrors();

    expect($integration->fresh()->credentials['client_secret'])->toBe('existing-secret');
});

test('customers cannot access or update integrations', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('admin.integrations.index'))
        ->assertForbidden();

    $this->actingAs($customer)
        ->patch(route('admin.integrations.update', 'social_login'), [])
        ->assertForbidden();
});
