<?php

namespace App\Models;

use Database\Factories\OrderStatusHistoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderStatusHistory extends Model
{
    /** @use HasFactory<OrderStatusHistoryFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id', 'from_status', 'to_status', 'payment_status',
        'shipment_status', 'location', 'notes', 'customer_visible',
        'changed_by', 'occurred_at', 'metadata',
    ];

    protected $attributes = ['customer_visible' => true];

    protected function casts(): array
    {
        return ['customer_visible' => 'boolean', 'occurred_at' => 'datetime', 'metadata' => 'array'];
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo { return $this->belongsTo(Order::class); }

    /** @return BelongsTo<User, $this> */
    public function changedBy(): BelongsTo { return $this->belongsTo(User::class, 'changed_by')->withTrashed(); }
}
