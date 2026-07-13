<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    protected $fillable = ['store_id', 'product_id', 'on_hand', 'reserved', 'reorder_level', 'bin_location', 'updated_by'];

    protected $attributes = ['on_hand' => 0, 'reserved' => 0, 'reorder_level' => 5];

    protected function casts(): array
    {
        return ['on_hand' => 'integer', 'reserved' => 'integer', 'reorder_level' => 'integer'];
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

    /** @return BelongsTo<User, $this> */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }

    public function available(): int
    {
        return max(0, $this->on_hand - $this->reserved);
    }
}
