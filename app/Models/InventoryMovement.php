<?php

namespace App\Models;

use Database\Factories\InventoryMovementFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Str;

class InventoryMovement extends Model
{
    /** @use HasFactory<InventoryMovementFactory> */
    use HasFactory;

    protected $fillable = [
        'uuid', 'inventory_id', 'seller_listing_id', 'type', 'quantity',
        'before_quantity', 'after_quantity', 'reference_type', 'reference_id',
        'reason', 'created_by', 'occurred_at', 'metadata',
    ];

    protected static function booted(): void
    {
        static::creating(fn (InventoryMovement $movement) => $movement->uuid ??= (string) Str::uuid());
    }

    protected function casts(): array
    {
        return [
            'quantity' => 'integer', 'before_quantity' => 'integer',
            'after_quantity' => 'integer', 'occurred_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    /** @return BelongsTo<Inventory, $this> */
    public function inventory(): BelongsTo { return $this->belongsTo(Inventory::class); }

    /** @return BelongsTo<SellerListing, $this> */
    public function sellerListing(): BelongsTo { return $this->belongsTo(SellerListing::class); }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by')->withTrashed(); }

    /** @return MorphTo<Model, $this> */
    public function reference(): MorphTo { return $this->morphTo(); }
}
