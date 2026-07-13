<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorKycDocument extends Model
{
    /** @use HasFactory<\Database\Factories\VendorKycDocumentFactory> */
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_VERIFIED = 'verified';

    public const STATUS_REJECTED = 'rejected';

    protected $fillable = ['vendor_id', 'type', 'document_number', 'file_path', 'original_name', 'mime_type', 'size', 'status', 'rejection_reason', 'expires_on', 'uploaded_by', 'reviewed_by', 'reviewed_at'];

    protected $hidden = ['document_number', 'file_path'];

    protected $attributes = ['status' => self::STATUS_PENDING];

    protected function casts(): array
    {
        return ['document_number' => 'encrypted', 'expires_on' => 'date', 'reviewed_at' => 'datetime'];
    }

    /** @return BelongsTo<Vendor, $this> */
    public function vendor(): BelongsTo { return $this->belongsTo(Vendor::class); }

    /** @return BelongsTo<User, $this> */
    public function uploader(): BelongsTo { return $this->belongsTo(User::class, 'uploaded_by')->withTrashed(); }

    /** @return BelongsTo<User, $this> */
    public function reviewer(): BelongsTo { return $this->belongsTo(User::class, 'reviewed_by')->withTrashed(); }

    /** @return list<string> */
    public static function types(): array { return ['pan', 'gst_registration', 'cin', 'bank_proof', 'address_proof', 'identity_proof', 'business_license']; }
}
