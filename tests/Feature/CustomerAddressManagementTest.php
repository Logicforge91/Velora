<?php

use App\Models\Address;
use App\Models\ServiceArea;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function validAddressData(array $overrides = []): array
{
    return array_merge([
        'type' => Address::TYPE_HOME,
        'label' => 'My home',
        'recipient_name' => 'Aarav Sharma',
        'phone' => '9876543210',
        'alternate_phone' => '',
        'line_1' => '12 Lake View Apartments',
        'line_2' => 'Indiranagar',
        'landmark' => 'Near Metro Station',
        'city' => 'Bengaluru',
        'district' => 'Bengaluru Urban',
        'state' => 'Karnataka',
        'postal_code' => '560001',
        'latitude' => '12.9716000',
        'longitude' => '77.5946000',
        'delivery_instructions' => 'Leave with security.',
        'is_default_shipping' => true,
    ], $overrides);
}

test('customer can view their address book', function () {
    $customer = User::factory()->customer()->create();
    Address::factory()->for($customer)->create();

    $this->actingAs($customer)
        ->get(route('customer.addresses.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('customer/addresses/index')
            ->has('addresses', 1)
            ->has('serviceablePostalCodes'));
});

test('customer can add a serviceable default address', function () {
    $customer = User::factory()->customer()->create();
    ServiceArea::factory()->create([
        'postal_code' => '560001',
        'status' => 'active',
    ]);

    $this->actingAs($customer)
        ->post(route('customer.addresses.store'), validAddressData())
        ->assertRedirect(route('customer.addresses.index'));

    $address = $customer->addresses()->sole();

    expect($address->is_default_shipping)->toBeTrue()
        ->and($address->is_serviceable)->toBeTrue();
});

test('customer can update and set an owned address as default', function () {
    $customer = User::factory()->customer()->create();
    $currentDefault = Address::factory()->defaultShipping()->for($customer)->create();
    $address = Address::factory()->for($customer)->create();

    $this->actingAs($customer)
        ->put(route('customer.addresses.update', $address), validAddressData([
            'type' => Address::TYPE_WORK,
            'label' => 'Office',
        ]))
        ->assertRedirect(route('customer.addresses.index'));

    expect($address->refresh()->label)->toBe('Office')
        ->and($address->is_default_shipping)->toBeTrue()
        ->and($currentDefault->refresh()->is_default_shipping)->toBeFalse();
});

test('customer cannot modify another customers address', function () {
    $customer = User::factory()->customer()->create();
    $address = Address::factory()->for(User::factory()->customer())->create();

    $this->actingAs($customer)
        ->delete(route('customer.addresses.destroy', $address))
        ->assertForbidden();
});

test('deleting the default address promotes the newest remaining address', function () {
    $customer = User::factory()->customer()->create();
    $remaining = Address::factory()->for($customer)->create();
    $default = Address::factory()->defaultShipping()->for($customer)->create();

    $this->actingAs($customer)
        ->delete(route('customer.addresses.destroy', $default))
        ->assertRedirect(route('customer.addresses.index'));

    expect($remaining->refresh()->is_default_shipping)->toBeTrue();
});
