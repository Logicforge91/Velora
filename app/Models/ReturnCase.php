<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReturnCase extends Model
{
    protected $fillable = [
        'order_id',
        'order_item_id',
        'customer_id',
        'number',
        'type',
        'reason_code',
        'reason_details',
        'status',
        'requested_quantity',
        'refund_amount',
        'resolution',
        'reverse_carrier',
        'tracking_number',
        'processed_by',
        'requested_at',
        'approved_at',
        'received_at',
        'completed_at',
    ];

    protected $attributes = [
        'type' => 'return',
        'status' => 'requested',
        'requested_quantity' => 1,
        'refund_amount' => 0,
    ];

    protected function casts(): array
    {
        return [
            'requested_quantity' => 'integer',
            'refund_amount' => 'decimal:2',
            'requested_at' => 'datetime',
            'approved_at' => 'datetime',
            'received_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return BelongsTo<OrderItem, $this> */
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    /** @return BelongsTo<User, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id')->withTrashed();
    }

    /** @return BelongsTo<User, $this> */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by')->withTrashed();
    }

    /** @return list<string> */
    public static function statuses(): array
    {
        return ['requested', 'approved', 'pickup_scheduled', 'in_transit', 'received', 'refunded', 'rejected'];
    }
}
