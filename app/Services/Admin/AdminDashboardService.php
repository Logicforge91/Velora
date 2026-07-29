<?php

namespace App\Services\Admin;

use App\Models\AdminAuditLog;
use App\Models\AdminRole;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ReturnCase;
use App\Models\SellerListing;
use App\Models\Shipment;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class AdminDashboardService
{
    /**
     * @return array{
     *     total_users: int,
     *     total_admins: int,
     *     total_vendors: int,
     *     total_customers: int,
     *     pending_vendors: int,
     *     pending_approvals: int,
     *     active_sellers: int,
     *     active_customers: int,
     *     active_users: int,
     *     inactive_users: int,
     *     new_users_30_days: int,
     *     active_rate: int,
     *     total_products: int,
     *     low_stock_products: int,
     *     total_orders: int,
     *     today_orders: int,
     *     pending_orders: int,
     *     gross_revenue: float,
     *     net_revenue: float,
     *     total_returns: int,
     *     pending_returns: int,
     *     returned_value: float,
     *     fulfilled_shipments: int,
     *     active_shipments: int,
     *     fulfilment_rate: int
     * }
     */
    public function getStatistics(): array
    {
        $statistics = User::query()
            ->selectRaw(
                'COUNT(*) as total_users,
                SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) as total_admins,
                SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) as total_customers,
                SUM(CASE WHEN role = ? AND status = ? THEN 1 ELSE 0 END) as active_customers,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as active_users,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as inactive_users,
                SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) as new_users_30_days',
                [
                    User::ROLE_ADMIN,
                    User::ROLE_CUSTOMER,
                    User::ROLE_CUSTOMER,
                    true,
                    true,
                    false,
                    now()->subDays(30),
                ],
            )
            ->toBase()
            ->firstOrFail();

        $totalUsers = (int) $statistics->total_users;
        $activeUsers = (int) $statistics->active_users;
        $vendorStatistics = Vendor::query()
            ->selectRaw('COUNT(*) as total_vendors')
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending_vendors', [Vendor::STATUS_PENDING])
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as active_sellers', [Vendor::STATUS_APPROVED])
            ->toBase()
            ->firstOrFail();
        $productStatistics = Product::query()
            ->selectRaw('COUNT(*) as total_products')
            ->selectRaw('SUM(CASE WHEN stock <= low_stock_threshold THEN 1 ELSE 0 END) as low_stock_products')
            ->toBase()
            ->firstOrFail();
        $orderStatistics = Order::query()
            ->selectRaw('COUNT(*) as total_orders')
            ->selectRaw('SUM(CASE WHEN placed_at >= ? AND placed_at < ? THEN 1 ELSE 0 END) as today_orders', [today()->startOfDay(), today()->addDay()->startOfDay()])
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending_orders', [Order::STATUS_PENDING])
            ->selectRaw('COALESCE(SUM(CASE WHEN status != ? THEN total ELSE 0 END), 0) as gross_revenue', [Order::STATUS_CANCELLED])
            ->toBase()
            ->firstOrFail();
        $refundedAmount = (float) Payment::query()->sum('refunded_amount');
        $returnStatistics = ReturnCase::query()
            ->selectRaw('COUNT(*) as total_returns')
            ->selectRaw('SUM(CASE WHEN status IN (?, ?, ?, ?, ?) THEN 1 ELSE 0 END) as pending_returns', ['requested', 'approved', 'pickup_scheduled', 'in_transit', 'received'])
            ->selectRaw('COALESCE(SUM(CASE WHEN status = ? THEN refund_amount ELSE 0 END), 0) as returned_value', ['refunded'])
            ->toBase()
            ->firstOrFail();
        $shipmentStatistics = Shipment::query()
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as fulfilled_shipments', ['delivered'])
            ->selectRaw('SUM(CASE WHEN status IN (?, ?, ?) THEN 1 ELSE 0 END) as active_shipments', ['packed', 'shipped', 'in_transit'])
            ->selectRaw('SUM(CASE WHEN status != ? THEN 1 ELSE 0 END) as measurable_shipments', ['pending'])
            ->toBase()
            ->firstOrFail();
        $pendingListingApprovals = SellerListing::query()->where('status', 'pending')->count();
        $grossRevenue = (float) $orderStatistics->gross_revenue;
        $measurableShipments = (int) $shipmentStatistics->measurable_shipments;

        return [
            'total_users' => $totalUsers,
            'total_admins' => (int) $statistics->total_admins,
            'total_vendors' => (int) $vendorStatistics->total_vendors,
            'total_customers' => (int) $statistics->total_customers,
            'pending_vendors' => (int) $vendorStatistics->pending_vendors,
            'pending_approvals' => (int) $vendorStatistics->pending_vendors + $pendingListingApprovals,
            'active_sellers' => (int) $vendorStatistics->active_sellers,
            'active_customers' => (int) $statistics->active_customers,
            'active_users' => $activeUsers,
            'inactive_users' => (int) $statistics->inactive_users,
            'new_users_30_days' => (int) $statistics->new_users_30_days,
            'active_rate' => $totalUsers === 0 ? 0 : (int) round(($activeUsers / $totalUsers) * 100),
            'total_products' => (int) $productStatistics->total_products,
            'low_stock_products' => (int) $productStatistics->low_stock_products,
            'total_orders' => (int) $orderStatistics->total_orders,
            'today_orders' => (int) $orderStatistics->today_orders,
            'pending_orders' => (int) $orderStatistics->pending_orders,
            'gross_revenue' => $grossRevenue,
            'net_revenue' => max($grossRevenue - $refundedAmount, 0),
            'total_returns' => (int) $returnStatistics->total_returns,
            'pending_returns' => (int) $returnStatistics->pending_returns,
            'returned_value' => (float) $returnStatistics->returned_value,
            'fulfilled_shipments' => (int) $shipmentStatistics->fulfilled_shipments,
            'active_shipments' => (int) $shipmentStatistics->active_shipments,
            'fulfilment_rate' => $measurableShipments === 0
                ? 0
                : (int) round(((int) $shipmentStatistics->fulfilled_shipments / $measurableShipments) * 100),
        ];
    }

    /** @return Collection<int, AdminAuditLog> */
    public function getRecentActivities(int $limit = 8): Collection
    {
        return AdminAuditLog::query()
            ->select([
                'id',
                'actor_id',
                'category',
                'action',
                'severity',
                'description',
                'succeeded',
                'occurred_at',
            ])
            ->with('actor:id,name,email')
            ->latest('occurred_at')
            ->limit($limit)
            ->get();
    }

    /** @return list<array{name: string, administrators_count: int}> */
    public function getAdminRoleMix(): array
    {
        return AdminRole::query()
            ->select(['id', 'name'])
            ->withCount([
                'users as administrators_count' => fn (Builder $query): Builder => $query
                    ->where('role', User::ROLE_ADMIN),
            ])
            ->orderByDesc('administrators_count')
            ->orderBy('name')
            ->get()
            ->map(fn (AdminRole $role): array => [
                'name' => $role->name,
                'administrators_count' => (int) $role->administrators_count,
            ])
            ->all();
    }
}
