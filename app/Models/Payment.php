<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = ['order_id', 'transaction_id', 'provider', 'amount', 'status', 'refunded_amount', 'paid_at', 'refunded_at', 'metadata'];

    protected $attributes = ['provider' => 'manual', 'status' => 'pending', 'refunded_amount' => 0];

    protected function casts(): array
    {
        return ['amount' => 'decimal:2', 'refunded_amount' => 'decimal:2', 'paid_at' => 'datetime', 'refunded_at' => 'datetime', 'metadata' => 'array'];
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
}
