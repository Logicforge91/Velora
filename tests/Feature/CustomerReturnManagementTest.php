<?php

use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ReturnCase;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('customer can request and cancel an eligible exchange', function () {
    Storage::fake('public');
    $customer = User::factory()->customer()->create();
    $address = Address::factory()->for($customer)->create();
    $order = Order::factory()->for($customer)->create(['status' => Order::STATUS_DELIVERED]);
    $item = OrderItem::factory()->for($order)->create([
        'fulfilment_status' => 'delivered',
        'return_eligible_until' => now()->addDays(7),
    ]);

    $this->actingAs($customer)
        ->post(route('customer.returns.store'), [
            'order_item_id' => $item->id,
            'type' => 'size_exchange',
            'reason_code' => 'size_issue',
            'reason_details' => 'The item runs small.',
            'exchange_value' => 'XL',
            'pickup_address_id' => $address->id,
            'pickup_slot_at' => now()->addDay()->toDateTimeString(),
            'images' => [UploadedFile::fake()->image('item.jpg')],
        ])
        ->assertRedirect();

    $returnCase = ReturnCase::query()->sole();

    expect($returnCase->type)->toBe('size_exchange')
        ->and($returnCase->exchange_attributes)->toBe(['size' => 'XL'])
        ->and($returnCase->media_paths)->toHaveCount(1);

    $this->actingAs($customer)
        ->patch(route('customer.returns.cancel', $returnCase), ['confirmed' => true])
        ->assertRedirect();

    expect($returnCase->refresh()->status)->toBe('cancelled');
});

test('customer cannot return another customers item', function () {
    $customer = User::factory()->customer()->create();
    $address = Address::factory()->for($customer)->create();
    $otherOrder = Order::factory()->create(['status' => Order::STATUS_DELIVERED]);
    $item = OrderItem::factory()->for($otherOrder)->create();

    $this->actingAs($customer)
        ->post(route('customer.returns.store'), [
            'order_item_id' => $item->id,
            'type' => 'return',
            'reason_code' => 'damaged',
            'pickup_address_id' => $address->id,
            'pickup_slot_at' => now()->addDay()->toDateTimeString(),
        ])
        ->assertSessionHasErrors('order_item_id');
});
