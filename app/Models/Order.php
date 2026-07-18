<?php

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_SHIPPED = 'shipped';

    public const STATUS_DELIVERED = 'delivered';

    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'user_id',
        'number',
        'status',
        'payment_method',
        'payment_status',
        'shipping_address',
        'billing_address',
        'coupon_id',
        'currency',
        'subtotal',
        'shipping_total',
        'discount_total',
        'tax_total',
        'gift_wrap_total',
        'savings_total',
        'total',
        'customer_note',
        'source',
        'channel',
        'ip_address',
        'user_agent',
        'gift_message',
        'cancellation_reason',
        'placed_at',
        'confirmed_at',
        'cancelled_at',
        'delivered_at',
    ];

    protected $attributes = [
        'status' => self::STATUS_PENDING,
        'payment_method' => 'cash_on_delivery',
        'payment_status' => 'pending',
        'shipping_total' => 0,
        'discount_total' => 0,
        'tax_total' => 0,
        'gift_wrap_total' => 0,
        'savings_total' => 0,
        'currency' => 'INR',
        'source' => 'web',
        'channel' => 'marketplace',
    ];

    protected static function booted(): void
    {
        static::created(function (Order $order): void {
            $order->payment()->create([
                'provider' => $order->payment_method,
                'amount' => $order->total,
                'status' => $order->payment_status,
                'paid_at' => $order->payment_status === 'paid' ? now() : null,
            ]);

            $order->shipment()->create();
        });
    }

    protected function casts(): array
    {
        return [
            'shipping_address' => 'array',
            'billing_address' => 'array',
            'subtotal' => 'decimal:2',
            'shipping_total' => 'decimal:2',
            'discount_total' => 'decimal:2',
            'tax_total' => 'decimal:2',
            'gift_wrap_total' => 'decimal:2',
            'savings_total' => 'decimal:2',
            'total' => 'decimal:2',
            'placed_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /** @return BelongsTo<Coupon, $this> */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /** @return HasMany<OrderItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /** @return HasMany<ReturnCase, $this> */
    public function returns(): HasMany
    {
        return $this->hasMany(ReturnCase::class);
    }

    /** @return HasMany<TaxInvoice, $this> */
    public function taxInvoices(): HasMany
    {
        return $this->hasMany(TaxInvoice::class);
    }

    /** @return HasOne<Payment, $this> */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    /** @return HasOne<Shipment, $this> */
    public function shipment(): HasOne
    {
        return $this->hasOne(Shipment::class);
    }

    /** @return HasMany<OrderStatusHistory, $this> */
    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->latest('occurred_at');
    }

    /** @return HasMany<InventoryReservation, $this> */
    public function inventoryReservations(): HasMany
    {
        return $this->hasMany(InventoryReservation::class);
    }

    /** @return list<string> */
    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_PROCESSING,
            self::STATUS_SHIPPED,
            self::STATUS_DELIVERED,
            self::STATUS_CANCELLED,
        ];
    }
}
