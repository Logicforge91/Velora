<?php

namespace App\Models;

use Database\Factories\PriceHistoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceHistory extends Model
{
    /** @use HasFactory<PriceHistoryFactory> */
    use HasFactory;

    protected $fillable = [
        'product_id', 'product_variant_id', 'seller_listing_id', 'price_type',
        'old_price', 'new_price', 'change_source', 'reason', 'changed_by',
        'effective_from', 'effective_until', 'metadata',
    ];

    protected $attributes = ['price_type' => 'selling_price', 'change_source' => 'manual'];

    protected function casts(): array
    {
        return [
            'old_price' => 'decimal:2', 'new_price' => 'decimal:2',
            'effective_from' => 'datetime', 'effective_until' => 'datetime',
            'metadata' => 'array',
        ];
    }

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }

    /** @return BelongsTo<ProductVariant, $this> */
    public function variant(): BelongsTo { return $this->belongsTo(ProductVariant::class, 'product_variant_id'); }

    /** @return BelongsTo<SellerListing, $this> */
    public function sellerListing(): BelongsTo { return $this->belongsTo(SellerListing::class); }

    /** @return BelongsTo<User, $this> */
    public function changedBy(): BelongsTo { return $this->belongsTo(User::class, 'changed_by')->withTrashed(); }
}
