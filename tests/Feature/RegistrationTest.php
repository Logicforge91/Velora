<?php

use App\Enums\AccountRole;
use App\Enums\TeamRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('registration screen can be rendered', function () {
    $this->get(route('register'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/register')
            ->has('passwordRules'));
});

test('customers can create an account', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Aarav Sharma',
        'email' => 'aarav@example.com',
        'password' => 'SecurePass123!',
        'password_confirmation' => 'SecurePass123!',
    ]);

    $user = User::query()->where('email', 'aarav@example.com')->firstOrFail();

    expect($user->role)->toBe(AccountRole::Customer->value)
        ->and($user->isActive())->toBeTrue()
        ->and(Hash::check('SecurePass123!', $user->password))->toBeTrue()
        ->and($user->currentTeam)->not->toBeNull()
        ->and($user->currentTeam->is_personal)->toBeTrue()
        ->and($user->teamRole($user->currentTeam))->toBe(TeamRole::Owner);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('dashboard'));
});

test('registration requires unique customer details and a confirmed password', function () {
    User::factory()->create(['email' => 'existing@example.com']);

    $this->post(route('register.store'), [
        'name' => '',
        'email' => 'existing@example.com',
        'password' => 'short',
        'password_confirmation' => 'different',
    ])->assertSessionHasErrors(['name', 'email', 'password']);

    $this->assertGuest();
});
