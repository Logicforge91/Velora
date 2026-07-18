<?php

namespace App\Models;

use Database\Factories\WishlistItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WishlistItem extends Model
{
    /** @use HasFactory<WishlistItemFactory> */
    use HasFactory;

    protected $fillable = [
        'wishlist_id', 'product_id', 'product_variant_id',
        'price_when_added', 'priority', 'notify_price_drop',
        'notify_back_in_stock', 'notes', 'added_at',
    ];

    protected $attributes = [
        'priority' => 0,
        'notify_price_drop' => true,
        'notify_back_in_stock' => true,
    ];

    protected function casts(): array
    {
        return [
            'price_when_added' => 'decimal:2',
            'priority' => 'integer',
            'notify_price_drop' => 'boolean',
            'notify_back_in_stock' => 'boolean',
            'added_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Wishlist, $this> */
    public function wishlist(): BelongsTo
    {
        return $this->belongsTo(Wishlist::class);
    }

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<ProductVariant, $this> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
