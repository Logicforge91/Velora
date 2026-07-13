<?php

use App\Models\Inventory;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;

test('administrators can create fulfilment nodes', function () {
    $admin = User::factory()->admin()->create();
    $this->actingAs($admin)->post(route('admin.warehouses.store'), [
        'code' => 'BLR-FC-01', 'name' => 'Bengaluru Fulfilment Center', 'type' => 'fulfilment_center',
        'address' => ['line_1' => 'Electronic City Phase 1'], 'city' => 'Bengaluru', 'state' => 'Karnataka',
        'postal_code' => '560100', 'capacity' => 100000, 'priority' => 10, 'status' => true,
    ])->assertRedirect();

    expect(Store::query()->where('code', 'BLR-FC-01')->where('status', true)->exists())->toBeTrue();
});

test('warehouse adjustments synchronize aggregate product stock', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create(['stock' => 0]);
    $warehouse = Store::query()->create(['code' => 'DEL-WH-01', 'name' => 'Delhi Warehouse', 'type' => 'warehouse', 'address' => ['line_1' => 'Okhla'], 'city' => 'Delhi', 'state' => 'Delhi', 'postal_code' => '110020', 'capacity' => 50000, 'priority' => 20, 'status' => true]);

    $this->actingAs($admin)->put(route('admin.warehouses.inventory.update', $warehouse), [
        'product_id' => $product->id, 'on_hand' => 40, 'reserved' => 6, 'reorder_level' => 10, 'bin_location' => 'A-01-02',
    ])->assertRedirect();

    $inventory = Inventory::query()->whereBelongsTo($warehouse, 'store')->whereBelongsTo($product)->firstOrFail();
    expect($inventory->available())->toBe(34)->and($product->fresh()->stock)->toBe(40);
});

test('warehouses with stock cannot be deleted', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create();
    $warehouse = Store::query()->create(['code' => 'MUM-WH-01', 'name' => 'Mumbai Warehouse', 'address' => ['line_1' => 'Andheri'], 'city' => 'Mumbai', 'state' => 'Maharashtra', 'postal_code' => '400053']);
    $warehouse->inventories()->create(['product_id' => $product->id, 'on_hand' => 2]);

    $this->actingAs($admin)->from(route('admin.warehouses.show', $warehouse))->delete(route('admin.warehouses.destroy', $warehouse))->assertSessionHasErrors('warehouse');
    expect($warehouse->fresh())->not->toBeNull();
});
