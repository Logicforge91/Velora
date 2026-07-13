<?php

namespace App\Models;

use Database\Factories\AdminAuditLogFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use LogicException;

class AdminAuditLog extends Model
{
    /** @use HasFactory<AdminAuditLogFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['event_uuid', 'actor_id', 'category', 'action', 'severity', 'description', 'auditable_type', 'auditable_id', 'route_name', 'method', 'path', 'response_status', 'succeeded', 'duration_ms', 'ip_address', 'user_agent', 'before_values', 'after_values', 'metadata', 'record_hash', 'occurred_at'];

    protected function casts(): array
    {
        return ['succeeded' => 'boolean', 'before_values' => 'array', 'after_values' => 'array', 'metadata' => 'array', 'occurred_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        static::updating(fn (): never => throw new LogicException('Audit records are immutable.'));
        static::deleting(fn (): never => throw new LogicException('Audit records are immutable.'));
    }

    /** @return BelongsTo<User, $this> */
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id')->withTrashed();
    }

    /** @return MorphTo<Model, $this> */
    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }
}
