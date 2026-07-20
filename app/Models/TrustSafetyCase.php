<?php

namespace App\Models;

use Database\Factories\TrustSafetyCaseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Str;

class TrustSafetyCase extends Model
{
    /** @use HasFactory<TrustSafetyCaseFactory> */
    use HasFactory;

    protected $fillable = [
        'number', 'category', 'status', 'severity', 'risk_score', 'source', 'summary', 'description', 'evidence',
        'subject_type', 'subject_id', 'order_id', 'payment_id', 'vendor_id', 'product_id', 'customer_id',
        'assigned_to', 'reviewed_by', 'resolution_notes', 'detected_at', 'reviewed_at', 'resolved_at',
    ];

    protected $attributes = ['status' => 'open', 'severity' => 'medium', 'risk_score' => 0, 'source' => 'manual'];

    protected static function booted(): void
    {
        static::creating(function (TrustSafetyCase $case): void {
            $case->number ??= 'TS-'.now()->format('ymd').'-'.Str::upper(Str::random(6));
            $case->detected_at ??= now();
        });
    }

    protected function casts(): array
    {
        return ['risk_score' => 'integer', 'evidence' => 'array', 'detected_at' => 'datetime', 'reviewed_at' => 'datetime', 'resolved_at' => 'datetime'];
    }

    /** @return MorphTo<Model, $this> */
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    /** @return BelongsTo<User, $this> */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to')->withTrashed();
    }

    /** @return BelongsTo<User, $this> */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by')->withTrashed();
    }
}
