<?php

namespace App\Services\Admin;

use App\Models\Review;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class ReviewModerationService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, Review>
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');
        $rating = $filters['rating'] ?? null;

        return Review::query()->with(['product:id,name,sku', 'user:id,name,email', 'moderator:id,name'])
            ->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query->where('title', 'like', "%{$search}%")->orWhere('body', 'like', "%{$search}%")->orWhereHas('product', fn (Builder $query): Builder => $query->where('name', 'like', "%{$search}%"))))
            ->when(in_array($status, ['pending', 'approved', 'rejected'], true), fn (Builder $query): Builder => $query->where('status', $status))->when($rating, fn (Builder $query): Builder => $query->where('rating', $rating))->latest()->paginate(15)->withQueryString();
    }

    /** @return array<string, int|float> */
    public function counts(): array
    {
        $row = Review::query()->selectRaw('COUNT(*) total')->selectRaw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) pending")->selectRaw("SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) approved")->selectRaw('COALESCE(AVG(rating), 0) average_rating')->toBase()->firstOrFail();

        return ['total' => (int) $row->total, 'pending' => (int) $row->pending, 'approved' => (int) $row->approved, 'average_rating' => (float) $row->average_rating];
    }

    public function moderate(Review $review, User $moderator, string $status): Review
    {
        $review->update(['status' => $status, 'moderated_by' => $moderator->id, 'moderated_at' => now()]);

        return $review->fresh(['product', 'user', 'moderator']);
    }
}
