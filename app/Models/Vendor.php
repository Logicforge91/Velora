<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{
    /** @use HasFactory<\Database\Factories\VendorFactory> */
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_SUSPENDED = 'suspended';

    protected $attributes = ['status' => self::STATUS_PENDING, 'kyc_status' => 'pending', 'onboarding_stage' => 'business_details', 'risk_level' => 'unassessed', 'risk_score' => 0];

    protected $fillable = [
        'user_id',
        'business_name',
        'business_email',
        'business_phone',
        'tax_number',
        'address',
        'status',
        'rejection_reason',
        'approved_at',
        'approved_by',
        'commission_rate',
        'settlement_cycle',
        'bank_account_name',
        'bank_account_number',
        'bank_ifsc',
        'kyc_status',
        'onboarding_stage',
        'risk_level',
        'risk_score',
        'risk_flags',
        'submitted_at',
        'kyc_verified_at',
        'kyc_verified_by',
    ];

    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
            'commission_rate' => 'decimal:2',
            'risk_score' => 'integer',
            'risk_flags' => 'array',
            'submitted_at' => 'datetime',
            'kyc_verified_at' => 'datetime',
        ];
    }

    /** @return HasMany<Product, $this> */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /** @return HasMany<Settlement, $this> */
    public function settlements(): HasMany
    {
        return $this->hasMany(Settlement::class);
    }

    /** @return HasMany<VendorKycDocument, $this> */
    public function kycDocuments(): HasMany { return $this->hasMany(VendorKycDocument::class); }

    /** @return HasMany<VendorReviewEvent, $this> */
    public function reviewEvents(): HasMany { return $this->hasMany(VendorReviewEvent::class)->latest(); }

    /** @return BelongsTo<User, $this> */
    public function kycVerifiedBy(): BelongsTo { return $this->belongsTo(User::class, 'kyc_verified_by')->withTrashed(); }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /** @return BelongsTo<User, $this> */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'approved_by'
        )->withTrashed();
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function isSuspended(): bool
    {
        return $this->status === self::STATUS_SUSPENDED;
    }

    /** @return list<string> */
    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_APPROVED,
            self::STATUS_REJECTED,
            self::STATUS_SUSPENDED,
        ];
    }
}
