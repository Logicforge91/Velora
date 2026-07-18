<?php

use App\Models\Inventory;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\Schema;

test('advanced marketplace columns exist across the commerce lifecycle', function () {
    expect(Schema::hasColumns((new Product)->getTable(), [
        'product_type', 'barcode', 'hsn_code', 'tax_rate', 'weight_kg',
        'dimensions', 'specifications', 'shipping_class',
        'return_window_days', 'replacement_window_days', 'cod_eligible',
        'free_shipping', 'published_at',
    ]))->toBeTrue()
        ->and(Schema::hasColumns((new Order)->getTable(), [
            'coupon_id', 'billing_address', 'currency', 'tax_total',
            'gift_wrap_total', 'savings_total', 'source', 'channel',
            'cancellation_reason', 'confirmed_at', 'cancelled_at',
            'delivered_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns((new OrderItem)->getTable(), [
            'product_variant_id', 'variant_name', 'variant_attributes',
            'hsn_code', 'tax_rate', 'tax_amount', 'discount_amount',
            'fulfilment_status', 'return_eligible_until',
        ]))->toBeTrue()
        ->and(Schema::hasColumns((new Inventory)->getTable(), [
            'product_variant_id', 'safety_stock', 'damaged', 'inbound',
            'lot_number', 'expiry_date', 'last_counted_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns((new Review)->getTable(), [
            'order_item_id', 'is_verified_purchase', 'helpful_count',
            'unhelpful_count', 'media', 'seller_response',
            'seller_responded_at',
        ]))->toBeTrue();
});

test('available inventory excludes reservations damage and safety stock', function () {
    $inventory = new Inventory([
        'on_hand' => 100,
        'reserved' => 15,
        'damaged' => 5,
        'safety_stock' => 10,
    ]);

    expect($inventory->available())->toBe(70);
});
