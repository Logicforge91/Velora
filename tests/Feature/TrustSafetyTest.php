<?php

use App\Models\RiskRestriction;
use App\Models\RiskRule;
use App\Models\TrustSafetyCase;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('administrators can view the trust and safety workspace', function () {
    $admin = User::factory()->admin()->create();

    TrustSafetyCase::factory()->create([
        'category' => 'suspicious_transaction',
        'status' => 'open',
        'severity' => 'high',
        'summary' => 'Payment velocity exceeded normal thresholds.',
    ]);
    RiskRestriction::factory()->create(['type' => 'ip']);
    RiskRule::factory()->create(['enabled' => true]);

    $this->actingAs($admin)->get(route('admin.trust-safety', [
        'section' => 'suspicious-transactions',
    ]))->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/trust-safety/index')
            ->where('filters.section', 'suspicious-transactions')
            ->where('section.label', 'Suspicious Transactions')
            ->where('metrics.open_cases', 1)
            ->where('metrics.high_risk', 1)
            ->has('catalog', 15)
            ->has('rows', 1)
            ->where('rows.0.title', 'Payment velocity exceeded normal thresholds.')
        );
});

test('administrators can update manual review cases', function () {
    $admin = User::factory()->admin()->create();
    $case = TrustSafetyCase::factory()->create([
        'status' => 'open',
        'severity' => 'high',
        'resolution_notes' => null,
    ]);

    $this->actingAs($admin)
        ->from(route('admin.trust-safety'))
        ->patch(route('admin.trust-safety.cases.update', $case), [
            'status' => 'resolved',
            'severity' => 'high',
            'resolution_notes' => 'Confirmed payment dispute and blocked repeat pattern.',
        ])
        ->assertRedirect(route('admin.trust-safety'))
        ->assertSessionHas('success', 'Trust and safety case updated.');

    $case->refresh();

    expect($case->status)->toBe('resolved')
        ->and($case->reviewed_by)->toBe($admin->id)
        ->and($case->resolved_at)->not->toBeNull()
        ->and($case->resolution_notes)->toBe('Confirmed payment dispute and blocked repeat pattern.');
});

test('trust and safety filters are validated', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get(route('admin.trust-safety', ['section' => 'unknown']))
        ->assertSessionHasErrors('section');
});
