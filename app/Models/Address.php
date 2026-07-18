<?php

namespace App\Models;

use Database\Factories\AddressFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    /** @use HasFactory<AddressFactory> */
    use HasFactory;

    public const TYPE_HOME = 'home';

    public const TYPE_WORK = 'work';

    public const TYPE_OTHER = 'other';

    protected $fillable = [
        'user_id', 'type', 'label', 'recipient_name', 'phone',
        'alternate_phone', 'line_1', 'line_2', 'landmark', 'city',
        'district', 'state', 'state_code', 'postal_code', 'country_code',
        'latitude', 'longitude', 'delivery_instructions',
        'is_default_shipping', 'is_default_billing', 'is_serviceable',
        'verified_at',
    ];

    protected $attributes = [
        'type' => self::TYPE_HOME,
        'country_code' => 'IN',
        'is_default_shipping' => false,
        'is_default_billing' => false,
        'is_serviceable' => true,
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'is_default_shipping' => 'boolean',
            'is_default_billing' => 'boolean',
            'is_serviceable' => 'boolean',
            'verified_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return list<string> */
    public static function types(): array
    {
        return [self::TYPE_HOME, self::TYPE_WORK, self::TYPE_OTHER];
    }
}
