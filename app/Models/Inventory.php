<?php

namespace App\Models;

use Database\Factories\InventoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    /** @use HasFactory<InventoryFactory> */
    use HasFactory;

    protected $fillable = [
        'store_id', 'product_id', 'product_variant_id', 'on_hand', 'reserved',
        'reorder_level', 'safety_stock', 'damaged', 'inbound', 'bin_location',
        'lot_number', 'expiry_date', 'last_counted_at', 'updated_by',
    ];

    protected $attributes = [
        'on_hand' => 0,
        'reserved' => 0,
        'reorder_level' => 5,
        'safety_stock' => 0,
        'damaged' => 0,
        'inbound' => 0,
    ];

    protected function casts(): array
    {
        return [
            'on_hand' => 'integer',
            'reserved' => 'integer',
            'reorder_level' => 'integer',
            'safety_stock' => 'integer',
            'damaged' => 'integer',
            'inbound' => 'integer',
            'expiry_date' => 'date',
            'last_counted_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Store, $this> */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
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

    /** @return BelongsTo<User, $this> */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }

    public function available(): int
    {
        return max(0, $this->on_hand - $this->reserved - $this->damaged - $this->safety_stock);
    }
}
