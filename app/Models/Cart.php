<?php

namespace App\Models;

use Database\Factories\CartFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Cart extends Model
{
    /** @use HasFactory<CartFactory> */
    use HasFactory;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_CONVERTED = 'converted';

    public const STATUS_ABANDONED = 'abandoned';

    public const STATUS_EXPIRED = 'expired';

    protected $fillable = [
        'uuid', 'user_id', 'session_id', 'coupon_id', 'status', 'currency',
        'subtotal', 'discount_total', 'tax_total', 'shipping_total',
        'grand_total', 'metadata', 'last_activity_at', 'expires_at',
    ];

    protected $attributes = [
        'status' => self::STATUS_ACTIVE,
        'currency' => 'INR',
        'subtotal' => 0,
        'discount_total' => 0,
        'tax_total' => 0,
        'shipping_total' => 0,
        'grand_total' => 0,
    ];

    protected static function booted(): void
    {
        static::creating(function (Cart $cart): void {
            $cart->uuid ??= (string) Str::uuid();
            $cart->last_activity_at ??= now();
        });
    }

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount_total' => 'decimal:2',
            'tax_total' => 'decimal:2',
            'shipping_total' => 'decimal:2',
            'grand_total' => 'decimal:2',
            'metadata' => 'array',
            'last_activity_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Coupon, $this> */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /** @return HasMany<CartItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /** @return HasMany<InventoryReservation, $this> */
    public function inventoryReservations(): HasMany
    {
        return $this->hasMany(InventoryReservation::class);
    }

    /**
     * @param  Builder<Cart>  $query
     * @return Builder<Cart>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE)
            ->where(fn (Builder $query): Builder => $query->whereNull('expires_at')->orWhere('expires_at', '>', now()));
    }
}
