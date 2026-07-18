<?php

namespace App\Models;

use Database\Factories\ProductAttributeValueFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductAttributeValue extends Model
{
    /** @use HasFactory<ProductAttributeValueFactory> */
    use HasFactory;

    protected $fillable = ['product_id', 'product_variant_id', 'product_attribute_id', 'value_text', 'value_number', 'value_boolean', 'value_json', 'search_value'];

    protected function casts(): array
    {
        return ['value_number' => 'decimal:6', 'value_boolean' => 'boolean', 'value_json' => 'array'];
    }

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<ProductVariant, $this> */
    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    /** @return BelongsTo<ProductAttribute, $this> */
    public function productAttribute(): BelongsTo
    {
        return $this->belongsTo(ProductAttribute::class);
    }
}
