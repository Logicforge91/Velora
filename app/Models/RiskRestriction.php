<?php

namespace App\Models;

use Database\Factories\RiskRestrictionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiskRestriction extends Model
{
    /** @use HasFactory<RiskRestrictionFactory> */
    use HasFactory;

    protected $fillable = ['type', 'identifier', 'reason', 'notes', 'active', 'created_by', 'released_by', 'expires_at', 'released_at'];

    protected $attributes = ['active' => true];

    protected function casts(): array
    {
        return ['active' => 'boolean', 'expires_at' => 'datetime', 'released_at' => 'datetime'];
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }
}
