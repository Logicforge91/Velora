<?php

namespace App\Models;

use Database\Factories\WishlistFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Wishlist extends Model
{
    /** @use HasFactory<WishlistFactory> */
    use HasFactory;

    protected $fillable = [
        'uuid', 'user_id', 'name', 'is_default', 'is_public', 'share_token',
    ];

    protected $attributes = [
        'name' => 'My Wishlist',
        'is_default' => false,
        'is_public' => false,
    ];

    protected static function booted(): void
    {
        static::creating(function (Wishlist $wishlist): void {
            $wishlist->uuid ??= (string) Str::uuid();
        });
    }

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'is_public' => 'boolean',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<WishlistItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(WishlistItem::class)->latest('added_at');
    }
}
