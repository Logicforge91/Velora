<?php

namespace App\Models;

use Database\Factories\IntegrationLogFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IntegrationLog extends Model
{
    /** @use HasFactory<IntegrationLogFactory> */
    use HasFactory;

    protected $fillable = [
        'integration_id', 'category', 'action', 'status', 'message',
        'context', 'actor_id', 'occurred_at',
    ];

    protected function casts(): array
    {
        return ['context' => 'array', 'occurred_at' => 'datetime'];
    }

    /** @return BelongsTo<Integration, $this> */
    public function integration(): BelongsTo
    {
        return $this->belongsTo(Integration::class);
    }

    /** @return BelongsTo<User, $this> */
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id')->withTrashed();
    }
}
