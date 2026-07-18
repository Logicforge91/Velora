<?php

namespace App\Models;

use Database\Factories\ProductAttributeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductAttribute extends Model
{
    /** @use HasFactory<ProductAttributeFactory> */
    use HasFactory;

    protected $fillable = ['code', 'name', 'data_type', 'unit', 'options', 'is_filterable', 'is_variant', 'is_required', 'status', 'sort_order'];

    protected $attributes = ['data_type' => 'text', 'is_filterable' => false, 'is_variant' => false, 'is_required' => false, 'status' => true, 'sort_order' => 0];

    protected function casts(): array
    {
        return ['options' => 'array', 'is_filterable' => 'boolean', 'is_variant' => 'boolean', 'is_required' => 'boolean', 'status' => 'boolean', 'sort_order' => 'integer'];
    }

    /** @return BelongsToMany<Category, $this> */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class)->withPivot(['is_required', 'is_filterable', 'is_variant', 'sort_order'])->withTimestamps();
    }

    /** @return HasMany<ProductAttributeValue, $this> */
    public function values(): HasMany
    {
        return $this->hasMany(ProductAttributeValue::class);
    }
}
