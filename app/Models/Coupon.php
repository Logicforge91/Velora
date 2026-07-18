<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    protected $fillable = ['code', 'name', 'description', 'type', 'value', 'minimum_order_amount', 'maximum_discount_amount', 'usage_limit', 'used_count', 'starts_at', 'expires_at', 'status'];

    protected $attributes = ['type' => 'percentage', 'minimum_order_amount' => 0, 'used_count' => 0, 'status' => true];

    protected function casts(): array
    {
        return ['value' => 'decimal:2', 'minimum_order_amount' => 'decimal:2', 'maximum_discount_amount' => 'decimal:2', 'usage_limit' => 'integer', 'used_count' => 'integer', 'starts_at' => 'datetime', 'expires_at' => 'datetime', 'status' => 'boolean'];
    }

    /** @return HasMany<Cart, $this> */
    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    /** @return HasMany<Order, $this> */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
