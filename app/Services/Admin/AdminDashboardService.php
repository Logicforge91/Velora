<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class AdminDashboardService
{
    /**
     * @return array{
     *     total_users: int,
     *     total_admins: int,
     *     total_vendors: int,
     *     total_customers: int,
     *     total_delivery_agents: int,
     *     total_support_agents: int,
     *     active_users: int,
     *     inactive_users: int,
     *     new_users_30_days: int,
     *     active_rate: int,
     *     total_products: int,
     *     low_stock_products: int,
     *     total_orders: int,
     *     pending_orders: int,
     *     gross_revenue: float
     * }
     */
    public function getStatistics(): array
    {
        $statistics = User::query()
            ->selectRaw(
                'COUNT(*) as total_users,
                SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) as total_admins,
                SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) as total_vendors,
                SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) as total_customers,
                SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) as total_delivery_agents,
                SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) as total_support_agents,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as active_users,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as inactive_users,
                SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) as new_users_30_days',
                [
                    User::ROLE_ADMIN,
                    User::ROLE_VENDOR,
                    User::ROLE_CUSTOMER,
                    User::ROLE_DELIVERY_AGENT,
                    User::ROLE_SUPPORT_AGENT,
                    true,
                    false,
                    now()->subDays(30),
                ],
            )
            ->toBase()
            ->firstOrFail();

        $totalUsers = (int) $statistics->total_users;
        $activeUsers = (int) $statistics->active_users;
        $productStatistics = Product::query()
            ->selectRaw('COUNT(*) as total_products')
            ->selectRaw('SUM(CASE WHEN stock <= low_stock_threshold THEN 1 ELSE 0 END) as low_stock_products')
            ->toBase()
            ->firstOrFail();
        $orderStatistics = Order::query()
            ->selectRaw('COUNT(*) as total_orders')
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending_orders', [Order::STATUS_PENDING])
            ->selectRaw('COALESCE(SUM(CASE WHEN status != ? THEN total ELSE 0 END), 0) as gross_revenue', [Order::STATUS_CANCELLED])
            ->toBase()
            ->firstOrFail();

        return [
            'total_users' => $totalUsers,
            'total_admins' => (int) $statistics->total_admins,
            'total_vendors' => (int) $statistics->total_vendors,
            'total_customers' => (int) $statistics->total_customers,
            'total_delivery_agents' => (int) $statistics->total_delivery_agents,
            'total_support_agents' => (int) $statistics->total_support_agents,
            'active_users' => $activeUsers,
            'inactive_users' => (int) $statistics->inactive_users,
            'new_users_30_days' => (int) $statistics->new_users_30_days,
            'active_rate' => $totalUsers === 0 ? 0 : (int) round(($activeUsers / $totalUsers) * 100),
            'total_products' => (int) $productStatistics->total_products,
            'low_stock_products' => (int) $productStatistics->low_stock_products,
            'total_orders' => (int) $orderStatistics->total_orders,
            'pending_orders' => (int) $orderStatistics->pending_orders,
            'gross_revenue' => (float) $orderStatistics->gross_revenue,
        ];
    }

    /** @return Collection<int, User> */
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
