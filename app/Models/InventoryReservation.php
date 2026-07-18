<?php

namespace App\Models;

use Database\Factories\InventoryReservationFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class InventoryReservation extends Model
{
    /** @use HasFactory<InventoryReservationFactory> */
    use HasFactory;

    protected $fillable = [
        'uuid', 'inventory_id', 'cart_id', 'order_id', 'order_item_id',
        'quantity', 'status', 'expires_at', 'released_at', 'release_reason',
        'metadata',
    ];

    protected $attributes = ['status' => 'active'];

    protected static function booted(): void
    {
        static::creating(fn (InventoryReservation $reservation) => $reservation->uuid ??= (string) Str::uuid());
    }

    protected function casts(): array
    {
        return [
            'quantity' => 'integer', 'expires_at' => 'datetime',
            'released_at' => 'datetime', 'metadata' => 'array',
        ];
    }

    /** @return BelongsTo<Inventory, $this> */
    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }

    /** @return BelongsTo<Cart, $this> */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
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

    /**
     * @param  Builder<InventoryReservation>  $query
     * @return Builder<InventoryReservation>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active')
            ->where(fn (Builder $query): Builder => $query->whereNull('expires_at')->orWhere('expires_at', '>', now()));
    }
}
