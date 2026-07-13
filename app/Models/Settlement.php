<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Settlement extends Model
{
    protected $fillable = ['vendor_id', 'number', 'period_start', 'period_end', 'gross_sales', 'commission_amount', 'shipping_fee', 'tax_withheld', 'refund_deductions', 'adjustments', 'net_amount', 'status', 'transaction_reference', 'notes', 'approved_by', 'approved_at', 'paid_at'];

    protected $attributes = ['gross_sales' => 0, 'commission_amount' => 0, 'shipping_fee' => 0, 'tax_withheld' => 0, 'refund_deductions' => 0, 'adjustments' => 0, 'net_amount' => 0, 'status' => 'pending'];

    protected function casts(): array
    {
        return ['period_start' => 'date', 'period_end' => 'date', 'gross_sales' => 'decimal:2', 'commission_amount' => 'decimal:2', 'shipping_fee' => 'decimal:2', 'tax_withheld' => 'decimal:2', 'refund_deductions' => 'decimal:2', 'adjustments' => 'decimal:2', 'net_amount' => 'decimal:2', 'approved_at' => 'datetime', 'paid_at' => 'datetime'];
    }

    /** @return BelongsTo<Vendor, $this> */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /** @return BelongsTo<User, $this> */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by')->withTrashed();
    }

    /** @return list<string> */
    public static function statuses(): array
    {
        return ['pending', 'approved', 'processing', 'paid', 'failed', 'on_hold'];
    }
}
