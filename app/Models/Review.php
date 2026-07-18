<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'product_id', 'user_id', 'order_item_id', 'rating', 'title', 'body',
        'status', 'is_verified_purchase', 'helpful_count', 'unhelpful_count',
        'media', 'seller_response', 'seller_responded_at', 'moderated_by',
        'moderated_at',
    ];

    protected $attributes = [
        'status' => 'pending',
        'is_verified_purchase' => false,
        'helpful_count' => 0,
        'unhelpful_count' => 0,
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_verified_purchase' => 'boolean',
            'helpful_count' => 'integer',
            'unhelpful_count' => 'integer',
            'media' => 'array',
            'seller_responded_at' => 'datetime',
            'moderated_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<User, $this> */
    public function moderator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    /** @return BelongsTo<OrderItem, $this> */
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }
}
