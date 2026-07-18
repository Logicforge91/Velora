<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shipment extends Model
{
    protected $fillable = ['order_id', 'carrier', 'tracking_number', 'status', 'estimated_delivery_at', 'shipped_at', 'delivered_at', 'notes'];

    protected $attributes = ['status' => 'pending'];

    protected function casts(): array
    {
        return ['estimated_delivery_at' => 'datetime', 'shipped_at' => 'datetime', 'delivered_at' => 'datetime'];
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return HasMany<ShipmentEvent, $this> */
    public function events(): HasMany
    {
        return $this->hasMany(ShipmentEvent::class)->latest('occurred_at');
    }
}
