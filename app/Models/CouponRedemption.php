<?php

namespace App\Models;

use Database\Factories\CouponRedemptionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CouponRedemption extends Model
{
    /** @use HasFactory<CouponRedemptionFactory> */
    use HasFactory;

    protected $fillable = ['coupon_id', 'user_id', 'order_id', 'cart_id', 'code_snapshot', 'discount_amount', 'status', 'redeemed_at', 'rolled_back_at', 'metadata'];

    protected $attributes = ['discount_amount' => 0, 'status' => 'redeemed'];

    protected function casts(): array
    {
        return ['discount_amount' => 'decimal:2', 'redeemed_at' => 'datetime', 'rolled_back_at' => 'datetime', 'metadata' => 'array'];
    }

    /** @return BelongsTo<Coupon, $this> */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return BelongsTo<Cart, $this> */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }
}
