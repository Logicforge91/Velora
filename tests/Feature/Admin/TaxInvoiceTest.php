<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\TaxInvoice;
use App\Models\User;

function taxInvoiceOrder(): Order
{
    $customer = User::factory()->create();
    $product = Product::factory()->create();
    $order = Order::query()->create([
        'user_id' => $customer->id,
        'number' => 'ORD-TAX-'.fake()->unique()->numerify('######'),
        'status' => Order::STATUS_DELIVERED,
        'payment_method' => 'card',
        'payment_status' => 'paid',
        'shipping_address' => ['line_1' => 'MG Road', 'city' => 'Bengaluru', 'state' => 'Karnataka', 'postal_code' => '560001'],
        'subtotal' => 100,
        'shipping_total' => 0,
        'discount_total' => 0,
        'total' => 100,
        'placed_at' => now(),
    ]);
    $order->items()->create([
        'product_id' => $product->id,
        'product_name' => $product->name,
        'sku' => $product->sku,
        'unit_price' => 100,
        'quantity' => 1,
        'total' => 100,
    ]);

    return $order;
}

function taxDocumentPayload(Order $order, string $placeCode = '29'): array
{
    return [
        'order_id' => $order->id,
        'type' => 'invoice',
        'issued_on' => '2026-07-13',
        'supplier_name' => 'Velora Marketplace Private Limited',
        'supplier_address' => 'Bengaluru, Karnataka',
        'supplier_gstin' => '29AAAAA0000A1Z5',
        'supplier_state_code' => '29',
        'recipient_gstin' => null,
        'place_of_supply_state' => $placeCode === '29' ? 'Karnataka' : 'Maharashtra',
        'place_of_supply_code' => $placeCode,
        'reverse_charge' => false,
        'gst_rate' => 18,
        'cess_rate' => 0,
        'hsn_code' => '6109',
        'prices_include_tax' => true,
    ];
}

test('administrators can generate intrastate GST invoices', function () {
    $admin = User::factory()->admin()->create();
    $order = taxInvoiceOrder();

    $this->actingAs($admin)->post(route('admin.tax-invoices.store'), taxDocumentPayload($order))->assertRedirect();

    $invoice = TaxInvoice::query()->whereBelongsTo($order)->firstOrFail();
    expect($invoice->type)->toBe('invoice')
        ->and((float) $invoice->cgst_amount)->toBe(7.63)
        ->and((float) $invoice->sgst_amount)->toBe(7.62)
        ->and((float) $invoice->igst_amount)->toBe(0.0)
        ->and($invoice->items)->toHaveCount(1);
});

test('interstate GST invoices allocate tax to IGST', function () {
    $admin = User::factory()->admin()->create();
    $order = taxInvoiceOrder();

    $this->actingAs($admin)->post(route('admin.tax-invoices.store'), taxDocumentPayload($order, '27'))->assertRedirect();

    $invoice = TaxInvoice::query()->whereBelongsTo($order)->firstOrFail();
    expect((float) $invoice->cgst_amount)->toBe(0.0)
        ->and((float) $invoice->sgst_amount)->toBe(0.0)
        ->and((float) $invoice->igst_amount)->toBe(15.25);
});

test('credit notes cannot exceed the remaining original invoice value', function () {
    $admin = User::factory()->admin()->create();
    $order = taxInvoiceOrder();
    $invoice = TaxInvoice::query()->create([
        ...taxDocumentPayload($order),
        'number' => 'INV/26-27/999999',
        'financial_year' => '26-27',
        'status' => 'issued',
        'recipient_name' => $order->user->name,
        'recipient_address' => 'MG Road, Bengaluru',
        'taxable_value' => 84.75,
        'cgst_amount' => 7.63,
        'sgst_amount' => 7.62,
        'igst_amount' => 0,
        'cess_amount' => 0,
        'total_amount' => 100,
    ]);

    $payload = [
        ...taxDocumentPayload($order),
        'type' => 'credit_note',
        'parent_invoice_id' => $invoice->id,
        'credit_amount' => 101,
    ];

    $this->actingAs($admin)->post(route('admin.tax-invoices.store'), $payload)->assertSessionHasErrors('credit_amount');
    expect(TaxInvoice::query()->where('type', 'credit_note')->count())->toBe(0);
});
