<?php

namespace App\Models;

use Database\Factories\ProductAnswerFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductAnswer extends Model
{
    /** @use HasFactory<ProductAnswerFactory> */
    use HasFactory;

    protected $fillable = ['product_question_id', 'user_id', 'vendor_id', 'answer', 'is_seller', 'is_verified', 'helpful_count', 'status'];

    protected $attributes = ['is_seller' => false, 'is_verified' => false, 'helpful_count' => 0, 'status' => 'pending'];

    protected function casts(): array
    {
        return ['is_seller' => 'boolean', 'is_verified' => 'boolean', 'helpful_count' => 'integer'];
    }

    /** @return BelongsTo<ProductQuestion, $this> */
    public function productQuestion(): BelongsTo
    {
        return $this->belongsTo(ProductQuestion::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Vendor, $this> */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }
}
