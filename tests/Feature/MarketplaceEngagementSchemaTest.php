<?php

use Illuminate\Support\Facades\Schema;

test('advanced marketplace engagement tables have their operational columns', function () {
    expect(Schema::hasColumns('product_attributes', [
        'code', 'name', 'data_type', 'options', 'is_filterable', 'is_variant',
    ]))->toBeTrue()
        ->and(Schema::hasColumns('product_attribute_values', [
            'product_id', 'product_variant_id', 'product_attribute_id', 'value_text', 'value_number', 'search_value',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('coupon_redemptions', [
            'coupon_id', 'user_id', 'order_id', 'code_snapshot', 'discount_amount', 'status', 'redeemed_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('product_questions', [
            'product_id', 'user_id', 'question', 'status', 'answer_count', 'is_verified_purchase',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('product_answers', [
            'product_question_id', 'user_id', 'vendor_id', 'answer', 'is_seller', 'is_verified', 'status',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('review_votes', [
            'review_id', 'user_id', 'is_helpful',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('shipment_events', [
            'shipment_id', 'status', 'provider_code', 'location', 'occurred_at', 'customer_visible', 'payload',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('payment_transactions', [
            'payment_id', 'uuid', 'provider_reference', 'type', 'amount', 'currency', 'status', 'gateway', 'processed_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('category_product_attribute', [
            'category_id', 'product_attribute_id', 'is_required', 'is_filterable', 'is_variant', 'sort_order',
        ]))->toBeTrue();
});
