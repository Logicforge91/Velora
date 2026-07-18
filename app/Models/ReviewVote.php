<?php

namespace App\Models;

use Database\Factories\ReviewVoteFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewVote extends Model
{
    /** @use HasFactory<ReviewVoteFactory> */
    use HasFactory;

    protected $fillable = ['review_id', 'user_id', 'is_helpful'];

    protected function casts(): array
    {
        return ['is_helpful' => 'boolean'];
    }

    /** @return BelongsTo<Review, $this> */
    public function review(): BelongsTo
    {
        return $this->belongsTo(Review::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
