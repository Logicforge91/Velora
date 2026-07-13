<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaxInvoiceItem extends Model
{
    protected $fillable = ['tax_invoice_id', 'order_item_id', 'description', 'hsn_code', 'quantity', 'unit', 'taxable_value', 'gst_rate', 'cgst_amount', 'sgst_amount', 'igst_amount', 'cess_amount', 'total_amount'];

    protected $attributes = ['unit' => 'NOS', 'cgst_amount' => 0, 'sgst_amount' => 0, 'igst_amount' => 0, 'cess_amount' => 0];

    protected function casts(): array
    {
        return ['quantity' => 'integer', 'taxable_value' => 'decimal:2', 'gst_rate' => 'decimal:2', 'cgst_amount' => 'decimal:2', 'sgst_amount' => 'decimal:2', 'igst_amount' => 'decimal:2', 'cess_amount' => 'decimal:2', 'total_amount' => 'decimal:2'];
    }

    /** @return BelongsTo<TaxInvoice, $this> */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(TaxInvoice::class, 'tax_invoice_id');
    }

    /** @return BelongsTo<OrderItem, $this> */
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }
}
