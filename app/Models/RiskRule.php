<?php

namespace App\Models;

use Database\Factories\RiskRuleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiskRule extends Model
{
    /** @use HasFactory<RiskRuleFactory> */
    use HasFactory;

    protected $fillable = ['name', 'category', 'description', 'conditions', 'action', 'risk_score', 'enabled', 'matches_count', 'last_matched_at', 'created_by', 'updated_by'];

    protected $attributes = ['risk_score' => 0, 'enabled' => true, 'matches_count' => 0];

    protected function casts(): array
    {
        return ['conditions' => 'array', 'risk_score' => 'integer', 'enabled' => 'boolean', 'matches_count' => 'integer', 'last_matched_at' => 'datetime'];
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }
}
