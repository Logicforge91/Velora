<?php

use App\Enums\AccountRole;
use App\Models\AdminAuditLog;
use App\Models\User;
use App\Services\Admin\AuditLogService;

test('successful administrative changes capture actor context and redacted model changes', function () {
    $admin = User::factory()->admin()->create();
    $managedUser = User::factory()->customer()->create(['name' => 'Original User']);

    $this->actingAs($admin)->put(route('admin.users.update', $managedUser), [
        'name' => 'Updated User',
        'email' => $managedUser->email,
        'role' => AccountRole::Customer->value,
        'status' => true,
        'password' => 'new-secure-password',
        'password_confirmation' => 'new-secure-password',
    ])->assertRedirect();

    $log = AdminAuditLog::query()->where('route_name', 'admin.users.update')->firstOrFail();
    expect($log->actor_id)->toBe($admin->id)
        ->and($log->auditable_type)->toBe($managedUser->getMorphClass())
        ->and($log->before_values['name'])->toBe('Original User')
        ->and($log->after_values['name'])->toBe('Updated User')
        ->and($log->before_values['password'])->toBe('[REDACTED]')
        ->and($log->after_values['password'])->toBe('[REDACTED]')
        ->and($log->succeeded)->toBeTrue();
});

test('failed validation attempts are recorded without credentials', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('admin.users.store'), [
        'name' => '',
        'email' => 'invalid',
        'role' => AccountRole::Customer->value,
        'status' => true,
        'password' => 'secret-value',
        'password_confirmation' => 'secret-value',
    ])->assertSessionHasErrors(['name', 'email']);

    $log = AdminAuditLog::query()->where('route_name', 'admin.users.store')->firstOrFail();
    $requestMetadata = $log->metadata['request'];
    expect($log->response_status)->toBe(422)
        ->and($log->succeeded)->toBeFalse()
        ->and($requestMetadata)->not->toHaveKey('password')
        ->and($requestMetadata)->not->toHaveKey('password_confirmation');
});

test('audit checksums detect database tampering', function () {
    $admin = User::factory()->admin()->create();
    $managedUser = User::factory()->customer()->create();

    $this->actingAs($admin)->delete(route('admin.users.destroy', $managedUser))->assertRedirect();
    $log = AdminAuditLog::query()->where('route_name', 'admin.users.destroy')->firstOrFail();
    $service = app(AuditLogService::class);

    expect($service->isAuthentic($log))->toBeTrue();

    AdminAuditLog::query()->whereKey($log->id)->update(['description' => 'Tampered record']);
    expect($service->isAuthentic($log->fresh()))->toBeFalse();
});
