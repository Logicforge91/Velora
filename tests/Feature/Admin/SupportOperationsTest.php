<?php

use App\Models\SupportTicket;
use App\Models\User;

test('administrators can open and assign SLA tracked support tickets', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->customer()->create();
    $agent = User::factory()->supportAgent()->create();

    $this->actingAs($admin)->post(route('admin.support.store'), [
        'customer_id' => $customer->id, 'assigned_to' => $agent->id, 'subject' => 'Delivery missed committed date',
        'category' => 'delivery', 'channel' => 'phone', 'priority' => 'urgent', 'description' => 'The shipment has not moved for two days.',
    ])->assertRedirect();

    $ticket = SupportTicket::query()->firstOrFail();
    expect($ticket->assigned_to)->toBe($agent->id)->and($ticket->resolution_due_at)->not->toBeNull()->and($ticket->messages()->count())->toBe(1);
});

test('public agent replies capture first response while internal notes do not', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->customer()->create();
    $ticket = SupportTicket::query()->create(['customer_id' => $customer->id, 'number' => 'TKT-TEST-1001', 'subject' => 'Refund status', 'category' => 'return_refund', 'priority' => 'high', 'description' => 'Refund is pending.']);

    $this->actingAs($admin)->post(route('admin.support.messages.store', $ticket), ['body' => 'Checking payment gateway logs.', 'is_internal' => true])->assertRedirect();
    expect($ticket->fresh()->first_responded_at)->toBeNull();

    $this->actingAs($admin)->post(route('admin.support.messages.store', $ticket), ['body' => 'We are processing your refund.', 'is_internal' => false])->assertRedirect();
    expect($ticket->fresh()->first_responded_at)->not->toBeNull()->and($ticket->fresh()->status)->toBe('in_progress');
});
