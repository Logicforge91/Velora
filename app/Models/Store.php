<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    protected $fillable = [
        'code', 'name', 'type', 'contact_name', 'contact_phone', 'address',
        'city', 'state', 'postal_code', 'capacity', 'priority', 'status',
    ];

    protected $attributes = [
        'type' => 'warehouse',
        'capacity' => 0,
        'priority' => 100,
        'status' => true,
    ];

    protected function casts(): array
    {
        return ['address' => 'array', 'capacity' => 'integer', 'priority' => 'integer', 'status' => 'boolean'];
    }

    /** @return HasMany<Inventory, $this> */
    public function inventories(): HasMany
    {
        return $this->hasMany(Inventory::class);
    }
}
