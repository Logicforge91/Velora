<?php

namespace App\Models;

use Database\Factories\NotificationRuleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotificationRule extends Model
{
    /** @use HasFactory<NotificationRuleFactory> */
    use HasFactory;

    protected $fillable = ['name', 'event', 'audience', 'channels', 'templates', 'conditions', 'enabled', 'updated_by'];

    protected $attributes = ['enabled' => true];

    protected function casts(): array
    {
        return ['channels' => 'array', 'templates' => 'array', 'conditions' => 'array', 'enabled' => 'boolean'];
    }

    /** @return BelongsTo<User, $this> */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /** @return HasMany<NotificationDelivery, $this> */
    public function deliveries(): HasMany
    {
        return $this->hasMany(NotificationDelivery::class);
    }
}
