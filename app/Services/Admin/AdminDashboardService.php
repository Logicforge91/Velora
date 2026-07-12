<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class AdminDashboardService
{
    public function getStatistics(): array
    {
        $roleCounts = User::query()
            ->selectRaw('role, COUNT(*) as total')
            ->groupBy('role')
            ->pluck('total', 'role');

        return [
            'total_users' => $roleCounts->sum(),

            'total_admins' => (int) $roleCounts->get(
                User::ROLE_ADMIN,
                0
            ),

            'total_vendors' => (int) $roleCounts->get(
                User::ROLE_VENDOR,
                0
            ),

            'total_customers' => (int) $roleCounts->get(
                User::ROLE_CUSTOMER,
                0
            ),

            'active_users' => User::query()
                ->where('status', true)
                ->count(),

            'inactive_users' => User::query()
                ->where('status', false)
                ->count(),
        ];
    }

    public function getRecentUsers(int $limit = 8): Collection
    {
        return User::query()
            ->select([
                'id',
                'name',
                'email',
                'role',
                'status',
                'created_at',
            ])
            ->latest()
            ->limit($limit)
            ->get();
    }
}
