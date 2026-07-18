<?php

namespace App\Models;

use Database\Factories\PaymentRefundFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PaymentRefund extends Model
{
    /** @use HasFactory<PaymentRefundFactory> */
    use HasFactory;

    protected $fillable = [
        'uuid', 'payment_id', 'return_case_id', 'number', 'provider_reference',
        'amount', 'reason_code', 'reason_details', 'status', 'failure_reason',
        'requested_by', 'processed_by', 'requested_at', 'processed_at',
        'metadata',
    ];

    protected $attributes = ['status' => 'requested'];

    protected static function booted(): void
    {
        static::creating(fn (PaymentRefund $refund) => $refund->uuid ??= (string) Str::uuid());
    }

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2', 'requested_at' => 'datetime',
            'processed_at' => 'datetime', 'metadata' => 'array',
        ];
    }

    /** @return BelongsTo<Payment, $this> */
    public function payment(): BelongsTo { return $this->belongsTo(Payment::class); }

    /** @return BelongsTo<ReturnCase, $this> */
    public function returnCase(): BelongsTo { return $this->belongsTo(ReturnCase::class); }

    /** @return BelongsTo<User, $this> */
    public function requester(): BelongsTo { return $this->belongsTo(User::class, 'requested_by')->withTrashed(); }

    /** @return BelongsTo<User, $this> */
    public function processor(): BelongsTo { return $this->belongsTo(User::class, 'processed_by')->withTrashed(); }
}
