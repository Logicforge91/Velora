<?php

namespace App\Models;

use Database\Factories\PaymentTransactionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PaymentTransaction extends Model
{
    /** @use HasFactory<PaymentTransactionFactory> */
    use HasFactory;

    protected $fillable = ['payment_id', 'uuid', 'provider_reference', 'type', 'amount', 'currency', 'status', 'gateway', 'failure_code', 'failure_message', 'processed_at', 'metadata'];

    protected $attributes = ['currency' => 'INR', 'status' => 'pending'];

    protected static function booted(): void
    {
        static::creating(function (PaymentTransaction $transaction): void {
            $transaction->uuid ??= (string) Str::uuid();
        });
    }

    protected function casts(): array
    {
        return ['amount' => 'decimal:2', 'processed_at' => 'datetime', 'metadata' => 'array'];
    }

    /** @return BelongsTo<Payment, $this> */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
