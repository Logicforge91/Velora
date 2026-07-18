<?php

namespace App\Models;

use Database\Factories\ServiceAreaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceArea extends Model
{
    /** @use HasFactory<ServiceAreaFactory> */
    use HasFactory;

    protected $fillable = [
        'store_id', 'postal_code', 'city', 'district', 'state', 'country_code',
        'prepaid_available', 'cod_available', 'express_available',
        'minimum_delivery_days', 'maximum_delivery_days', 'shipping_charge',
        'free_shipping_threshold', 'cod_charge', 'daily_capacity', 'status',
        'cutoff_time', 'metadata',
    ];

    protected $attributes = [
        'country_code' => 'IN', 'prepaid_available' => true,
        'cod_available' => true, 'express_available' => false,
        'minimum_delivery_days' => 2, 'maximum_delivery_days' => 7,
        'shipping_charge' => 0, 'cod_charge' => 0, 'status' => 'active',
    ];

    protected function casts(): array
    {
        return [
            'prepaid_available' => 'boolean', 'cod_available' => 'boolean',
            'express_available' => 'boolean', 'minimum_delivery_days' => 'integer',
            'maximum_delivery_days' => 'integer', 'shipping_charge' => 'decimal:2',
            'free_shipping_threshold' => 'decimal:2', 'cod_charge' => 'decimal:2',
            'daily_capacity' => 'integer', 'metadata' => 'array',
        ];
    }

    /** @return BelongsTo<Store, $this> */
    public function store(): BelongsTo { return $this->belongsTo(Store::class); }
}
