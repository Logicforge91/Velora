<?php

use App\Models\Inventory;
use App\Models\InventoryReservation;
use App\Models\PaymentRefund;
use App\Models\PriceHistory;
use App\Models\SellerListing;
use App\Models\ServiceArea;
use App\Models\Store;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('advanced marketplace admin menus render for administrators', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get(route('admin.seller-listings.index'))
        ->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/seller-listings/index'));
    $this->actingAs($admin)->get(route('admin.inventory-operations.index'))
        ->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/inventory-operations/index'));
    $this->actingAs($admin)->get(route('admin.payment-refunds.index'))
        ->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/payment-refunds/index'));
    $this->actingAs($admin)->get(route('admin.service-areas.index'))
        ->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/service-areas/index'));
});

test('administrators can update seller listings and record price history', function () {
    $admin = User::factory()->admin()->create();
    $listing = SellerListing::factory()->create(['mrp' => 1200, 'selling_price' => 1000]);

    $this->actingAs($admin)->patch(route('admin.seller-listings.update', $listing), [
        'status' => 'active',
        'mrp' => 1200,
        'selling_price' => 950,
        'stock' => 25,
        'commission_rate' => 12,
        'is_buy_box_winner' => true,
        'rejection_reason' => null,
    ])->assertRedirect();

    expect($listing->fresh())
        ->selling_price->toBe('950.00')
        ->is_buy_box_winner->toBeTrue()
        ->and(PriceHistory::query()->whereBelongsTo($listing)->value('new_price'))->toBe('950.00');
});

test('administrators can release active inventory reservations', function () {
    $admin = User::factory()->admin()->create();
    $inventory = Inventory::factory()->create(['on_hand' => 20, 'reserved' => 4]);
    $reservation = InventoryReservation::factory()->for($inventory)->create(['quantity' => 3]);

    $this->actingAs($admin)->patch(route('admin.inventory-reservations.release', $reservation), [
        'release_reason' => 'stale_checkout',
    ])->assertRedirect();

    expect($reservation->fresh())
        ->status->toBe('released')
        ->release_reason->toBe('stale_checkout')
        ->and($inventory->fresh()->reserved)->toBe(1);
});

test('completed refunds synchronize captured payment totals', function () {
    $admin = User::factory()->admin()->create();
    $refund = PaymentRefund::factory()->create(['status' => 'processing', 'amount' => 500]);

    $this->actingAs($admin)->patch(route('admin.payment-refunds.update', $refund), [
        'status' => 'completed',
        'provider_reference' => 'gateway-refund-1001',
        'failure_reason' => null,
    ])->assertRedirect();

    expect($refund->fresh())
        ->status->toBe('completed')
        ->provider_reference->toBe('gateway-refund-1001')
        ->and($refund->payment->fresh()->refunded_amount)->toBe('500.00');
});

test('administrators can manage delivery coverage', function () {
    $admin = User::factory()->admin()->create();
    $store = Store::factory()->create();

    $this->actingAs($admin)->post(route('admin.service-areas.store'), serviceAreaPayload($store, '560001'))
        ->assertRedirect();

    $serviceArea = ServiceArea::query()->where('postal_code', '560001')->firstOrFail();
    $this->actingAs($admin)->patch(route('admin.service-areas.update', $serviceArea), [
        ...serviceAreaPayload($store, '560001'),
        'express_available' => true,
        'maximum_delivery_days' => 3,
    ])->assertRedirect();

    expect($serviceArea->fresh())->express_available->toBeTrue()->maximum_delivery_days->toBe(3);

    $this->actingAs($admin)->delete(route('admin.service-areas.destroy', $serviceArea))->assertRedirect();
    expect($serviceArea->fresh())->toBeNull();
});

/** @return array<string, mixed> */
function serviceAreaPayload(Store $store, string $postalCode): array
{
    return [
        'store_id' => $store->id,
        'postal_code' => $postalCode,
        'city' => 'Bengaluru',
        'district' => 'Bengaluru Urban',
        'state' => 'Karnataka',
        'country_code' => 'IN',
        'prepaid_available' => true,
        'cod_available' => true,
        'express_available' => false,
        'minimum_delivery_days' => 1,
        'maximum_delivery_days' => 5,
        'shipping_charge' => 40,
        'free_shipping_threshold' => 500,
        'cod_charge' => 20,
        'daily_capacity' => 100,
        'status' => 'active',
        'cutoff_time' => '17:00',
    ];
}
