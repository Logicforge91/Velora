<?php

use App\Models\NotificationDelivery;
use App\Models\NotificationRule;
use App\Models\NotificationTemplate;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('authorized administrators can view notification management', function () {
    $admin = User::factory()->admin()->create();
    NotificationDelivery::factory()->create(['status' => 'failed', 'failed_at' => now(), 'error_message' => 'Provider rejected the recipient.']);

    $this->actingAs($admin)
        ->get(route('admin.notifications.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/notifications/index')
            ->where('counts.failed', 1)
            ->has('failed', 1)
        );
});

test('administrators can save channel templates', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('admin.notifications.templates.store'), [
            'name' => 'Order confirmed',
            'slug' => 'order-confirmed-email',
            'channel' => 'mail',
            'audience' => 'customer',
            'subject' => 'Your order {{ order_number }} is confirmed',
            'body' => 'Hello {{ name }}, your order has been confirmed.',
            'variables' => ['name', 'order_number'],
            'enabled' => true,
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $template = NotificationTemplate::query()->where('slug', 'order-confirmed-email')->firstOrFail();

    expect($template->channel)->toBe('mail')
        ->and($template->variables)->toBe(['name', 'order_number'])
        ->and($template->updated_by)->toBe($admin->id);
});

test('administrators can map events to audience notification rules', function () {
    $admin = User::factory()->admin()->create();
    $template = NotificationTemplate::factory()->create(['channel' => 'mail', 'audience' => 'seller']);

    $this->actingAs($admin)
        ->post(route('admin.notifications.rules.store'), [
            'name' => 'New seller order',
            'event' => 'orders.created',
            'audience' => 'seller',
            'channels' => ['database', 'mail'],
            'templates' => ['mail' => $template->id],
            'conditions' => [],
            'enabled' => true,
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $rule = NotificationRule::query()->where('event', 'orders.created')->where('audience', 'seller')->firstOrFail();

    expect($rule->channels)->toBe(['database', 'mail'])
        ->and($rule->templates)->toBe(['mail' => $template->id]);
});

test('customers cannot manage notification configuration', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('admin.notifications.index'))
        ->assertForbidden();

    $this->actingAs($customer)
        ->post(route('admin.notifications.templates.store'), [])
        ->assertForbidden();
});
