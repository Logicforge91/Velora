<?php

namespace App\Models;

use Database\Factories\ShipmentEventFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShipmentEvent extends Model
{
    /** @use HasFactory<ShipmentEventFactory> */
    use HasFactory;

    protected $fillable = ['shipment_id', 'status', 'provider_code', 'location', 'message', 'occurred_at', 'customer_visible', 'payload'];

    protected $attributes = ['customer_visible' => true];

    protected function casts(): array
    {
        return ['occurred_at' => 'datetime', 'customer_visible' => 'boolean', 'payload' => 'array'];
    }

    /** @return BelongsTo<Shipment, $this> */
    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }
}
