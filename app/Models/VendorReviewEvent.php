<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorReviewEvent extends Model
{
    /** @use HasFactory<\Database\Factories\VendorReviewEventFactory> */
    use HasFactory;

    protected $fillable = ['vendor_id', 'actor_id', 'action', 'from_status', 'to_status', 'notes', 'metadata'];

    protected function casts(): array { return ['metadata' => 'array']; }

    /** @return BelongsTo<Vendor, $this> */
    public function vendor(): BelongsTo { return $this->belongsTo(Vendor::class); }

    /** @return BelongsTo<User, $this> */
    public function actor(): BelongsTo { return $this->belongsTo(User::class, 'actor_id')->withTrashed(); }
}
