<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaxInvoice extends Model
{
    protected $fillable = ['order_id', 'vendor_id', 'parent_invoice_id', 'type', 'number', 'financial_year', 'issued_on', 'status', 'supplier_name', 'supplier_address', 'supplier_gstin', 'supplier_state_code', 'recipient_name', 'recipient_address', 'recipient_gstin', 'place_of_supply_state', 'place_of_supply_code', 'reverse_charge', 'taxable_value', 'cgst_amount', 'sgst_amount', 'igst_amount', 'cess_amount', 'total_amount', 'notes', 'issued_by', 'issued_at', 'cancelled_at'];

    protected $attributes = ['type' => 'invoice', 'status' => 'draft', 'reverse_charge' => false, 'cgst_amount' => 0, 'sgst_amount' => 0, 'igst_amount' => 0, 'cess_amount' => 0];

    protected function casts(): array
    {
        return ['issued_on' => 'date', 'reverse_charge' => 'boolean', 'taxable_value' => 'decimal:2', 'cgst_amount' => 'decimal:2', 'sgst_amount' => 'decimal:2', 'igst_amount' => 'decimal:2', 'cess_amount' => 'decimal:2', 'total_amount' => 'decimal:2', 'issued_at' => 'datetime', 'cancelled_at' => 'datetime'];
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return BelongsTo<Vendor, $this> */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /** @return BelongsTo<TaxInvoice, $this> */
    public function parentInvoice(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_invoice_id');
    }

    /** @return HasMany<TaxInvoiceItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(TaxInvoiceItem::class);
    }

    /** @return BelongsTo<User, $this> */
    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by')->withTrashed();
    }

    /** @return list<string> */
    public static function statuses(): array
    {
        return ['draft', 'issued', 'cancelled'];
    }
}
