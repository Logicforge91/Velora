<?php

namespace App\Services\Admin;

use App\Models\Coupon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class CouponManagementService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, Coupon>
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $state = (string) ($filters['state'] ?? '');

        return Coupon::query()->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query->where('code', 'like', "%{$search}%")->orWhere('name', 'like', "%{$search}%")))
            ->when($state === 'active', fn (Builder $query): Builder => $query->where('status', true)->where(fn (Builder $query): Builder => $query->whereNull('expires_at')->orWhere('expires_at', '>=', now())))
            ->when($state === 'expired', fn (Builder $query): Builder => $query->where('expires_at', '<', now()))
            ->when($state === 'disabled', fn (Builder $query): Builder => $query->where('status', false))->latest()->paginate(15)->withQueryString();
    }

    /** @return array<string, int> */
    public function counts(): array
    {
        $row = Coupon::query()->selectRaw('COUNT(*) total')->selectRaw('SUM(CASE WHEN status = 1 AND (expires_at IS NULL OR expires_at >= ?) THEN 1 ELSE 0 END) active', [now()])->selectRaw('SUM(CASE WHEN expires_at < ? THEN 1 ELSE 0 END) expired', [now()])->selectRaw('COALESCE(SUM(used_count), 0) redemptions')->toBase()->firstOrFail();

        return ['total' => (int) $row->total, 'active' => (int) $row->active, 'expired' => (int) $row->expired, 'redemptions' => (int) $row->redemptions];
    }

    /** @param array<string, mixed> $data */
    public function create(array $data): Coupon
    {
        return Coupon::query()->create($data);
    }

    /** @param array<string, mixed> $data */
    public function update(Coupon $coupon, array $data): Coupon
    {
        $coupon->update($data);

        return $coupon->fresh();
    }

    public function delete(Coupon $coupon): void
    {
        $coupon->delete();
    }
}
