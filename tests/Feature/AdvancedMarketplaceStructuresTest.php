<?php

use App\Models\InventoryMovement;
use App\Models\InventoryReservation;
use App\Models\OrderStatusHistory;
use App\Models\PaymentRefund;
use App\Models\PriceHistory;
use App\Models\SellerListing;
use App\Models\ServiceArea;
use Illuminate\Support\Facades\Schema;

test('advanced operational marketplace tables contain their required structures', function () {
    expect(Schema::hasColumns((new SellerListing)->getTable(), [
        'vendor_id', 'product_id', 'product_variant_id', 'store_id',
        'seller_sku', 'mrp', 'selling_price', 'stock', 'reserved',
        'fulfilment_type', 'commission_rate', 'is_buy_box_winner', 'status',
    ]))->toBeTrue()
        ->and(Schema::hasColumns((new PriceHistory)->getTable(), [
            'product_id', 'seller_listing_id', 'old_price', 'new_price',
            'change_source', 'effective_from', 'effective_until',
        ]))->toBeTrue()
        ->and(Schema::hasColumns((new InventoryMovement)->getTable(), [
            'inventory_id', 'type', 'quantity', 'before_quantity',
            'after_quantity', 'reference_type', 'reference_id', 'occurred_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns((new InventoryReservation)->getTable(), [
            'inventory_id', 'cart_id', 'order_id', 'order_item_id',
            'quantity', 'status', 'expires_at', 'released_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns((new OrderStatusHistory)->getTable(), [
            'order_id', 'from_status', 'to_status', 'payment_status',
            'shipment_status', 'customer_visible', 'occurred_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns((new PaymentRefund)->getTable(), [
            'payment_id', 'return_case_id', 'number', 'provider_reference',
            'amount', 'reason_code', 'status', 'requested_at', 'processed_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns((new ServiceArea)->getTable(), [
            'store_id', 'postal_code', 'state', 'prepaid_available',
            'cod_available', 'express_available', 'minimum_delivery_days',
            'maximum_delivery_days', 'shipping_charge', 'status',
        ]))->toBeTrue();
});

test('seller listing availability excludes reserved units', function () {
    $listing = new SellerListing(['stock' => 25, 'reserved' => 7]);

    expect($listing->available())->toBe(18);
});
