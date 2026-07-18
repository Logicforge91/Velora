<?php

namespace App\Models;

use Database\Factories\ProductQuestionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductQuestion extends Model
{
    /** @use HasFactory<ProductQuestionFactory> */
    use HasFactory;

    protected $fillable = ['product_id', 'user_id', 'question', 'status', 'answer_count', 'helpful_count', 'is_verified_purchase', 'answered_at'];

    protected $attributes = ['status' => 'pending', 'answer_count' => 0, 'helpful_count' => 0, 'is_verified_purchase' => false];

    protected function casts(): array
    {
        return ['answer_count' => 'integer', 'helpful_count' => 'integer', 'is_verified_purchase' => 'boolean', 'answered_at' => 'datetime'];
    }

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<ProductAnswer, $this> */
    public function answers(): HasMany
    {
        return $this->hasMany(ProductAnswer::class);
    }
}
