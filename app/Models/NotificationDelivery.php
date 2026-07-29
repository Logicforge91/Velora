<?php

namespace App\Models;

use Database\Factories\NotificationDeliveryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Str;

class NotificationDelivery extends Model
{
    /** @use HasFactory<NotificationDeliveryFactory> */
    use HasFactory;

    protected $fillable = ['uuid', 'notification_rule_id', 'notification_template_id', 'notifiable_type', 'notifiable_id', 'channel', 'audience', 'recipient', 'status', 'payload', 'error_message', 'attempts', 'queued_at', 'sent_at', 'failed_at'];

    protected $attributes = ['status' => 'queued', 'attempts' => 0];

    protected static function booted(): void
    {
        static::creating(fn (NotificationDelivery $delivery) => $delivery->uuid ??= (string) Str::uuid());
    }

    protected function casts(): array
    {
        return ['payload' => 'array', 'attempts' => 'integer', 'queued_at' => 'datetime', 'sent_at' => 'datetime', 'failed_at' => 'datetime'];
    }

    /** @return BelongsTo<NotificationRule, $this> */
    public function rule(): BelongsTo
    {
        return $this->belongsTo(NotificationRule::class, 'notification_rule_id');
    }

    /** @return BelongsTo<NotificationTemplate, $this> */
    public function template(): BelongsTo
    {
        return $this->belongsTo(NotificationTemplate::class, 'notification_template_id');
    }

    /** @return MorphTo<Model, $this> */
    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }
}
