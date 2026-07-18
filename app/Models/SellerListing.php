<?php

namespace App\Models;

use Database\Factories\SellerListingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class SellerListing extends Model
{
    /** @use HasFactory<SellerListingFactory> */
    use HasFactory;

    protected $fillable = [
        'uuid', 'vendor_id', 'product_id', 'product_variant_id', 'store_id',
        'seller_sku', 'condition', 'mrp', 'selling_price', 'cost_price',
        'stock', 'reserved', 'minimum_order_quantity',
        'maximum_order_quantity', 'handling_time_days', 'fulfilment_type',
        'commission_rate', 'is_buy_box_winner', 'status', 'rejection_reason',
        'published_at', 'suspended_at',
    ];

    protected $attributes = [
        'condition' => 'new', 'stock' => 0, 'reserved' => 0,
        'minimum_order_quantity' => 1, 'handling_time_days' => 1,
        'fulfilment_type' => 'seller', 'commission_rate' => 0,
        'is_buy_box_winner' => false, 'status' => 'draft',
    ];

    protected static function booted(): void
    {
        static::creating(fn (SellerListing $listing) => $listing->uuid ??= (string) Str::uuid());
    }

    protected function casts(): array
    {
        return [
            'mrp' => 'decimal:2', 'selling_price' => 'decimal:2',
            'cost_price' => 'decimal:2', 'stock' => 'integer',
            'reserved' => 'integer', 'minimum_order_quantity' => 'integer',
            'maximum_order_quantity' => 'integer', 'handling_time_days' => 'integer',
            'commission_rate' => 'decimal:2', 'is_buy_box_winner' => 'boolean',
            'published_at' => 'datetime', 'suspended_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Vendor, $this> */
    public function vendor(): BelongsTo { return $this->belongsTo(Vendor::class); }

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }

    /** @return BelongsTo<ProductVariant, $this> */
    public function variant(): BelongsTo { return $this->belongsTo(ProductVariant::class, 'product_variant_id'); }

    /** @return BelongsTo<Store, $this> */
    public function store(): BelongsTo { return $this->belongsTo(Store::class); }

    /** @return HasMany<PriceHistory, $this> */
    public function priceHistories(): HasMany { return $this->hasMany(PriceHistory::class); }

    /** @return HasMany<InventoryMovement, $this> */
    public function inventoryMovements(): HasMany { return $this->hasMany(InventoryMovement::class); }

    public function available(): int
    {
        return max(0, $this->stock - $this->reserved);
    }
}
