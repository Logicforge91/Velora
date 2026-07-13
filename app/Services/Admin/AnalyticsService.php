<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

class AnalyticsService
{
    /** @return array<string, mixed> */
    public function getReport(): array
    {
        return [
            'summary' => $this->summary(),
            'dailyRevenue' => $this->dailyRevenue(),
            'orderStatuses' => $this->orderStatuses(),
            'topProducts' => $this->topProducts(),
            'lowStockProducts' => $this->lowStockProducts(),
        ];
    }

    /** @return array<string, int|float> */
    private function summary(): array
    {
        $orders = Order::query()->selectRaw('COUNT(*) as orders')
            ->selectRaw('COALESCE(SUM(CASE WHEN status != ? THEN total ELSE 0 END), 0) as revenue', [Order::STATUS_CANCELLED])
            ->selectRaw('COALESCE(AVG(CASE WHEN status != ? THEN total END), 0) as average_order_value', [Order::STATUS_CANCELLED])
            ->toBase()->firstOrFail();
        $products = Product::query()->selectRaw('COALESCE(SUM(stock), 0) as units_in_stock')
            ->selectRaw('SUM(CASE WHEN stock <= low_stock_threshold THEN 1 ELSE 0 END) as stock_alerts')
            ->toBase()->firstOrFail();

        return [
            'orders' => (int) $orders->orders,
            'revenue' => (float) $orders->revenue,
            'average_order_value' => (float) $orders->average_order_value,
            'units_in_stock' => (int) $products->units_in_stock,
            'stock_alerts' => (int) $products->stock_alerts,
        ];
    }

    /** @return array<int, array{date: string, orders: int, revenue: float}> */
    private function dailyRevenue(): array
    {
        return Order::query()->selectRaw('DATE(placed_at) as period, COUNT(*) as orders, SUM(total) as revenue')
            ->where('status', '!=', Order::STATUS_CANCELLED)
            ->where('placed_at', '>=', now()->subDays(29)->startOfDay())
            ->groupByRaw('DATE(placed_at)')->orderBy('period')->toBase()->get()
            ->map(fn (object $row): array => ['date' => (string) $row->period, 'orders' => (int) $row->orders, 'revenue' => (float) $row->revenue])
            ->values()->all();
    }

    /** @return array<int, array{status: string, total: int}> */
    private function orderStatuses(): array
    {
        return Order::query()->selectRaw('status, COUNT(*) as total')->groupBy('status')->orderByDesc('total')->toBase()->get()
            ->map(fn (object $row): array => ['status' => (string) $row->status, 'total' => (int) $row->total])
            ->values()->all();
    }

    /** @return array<int, array{product_name: string, sku: string, units: int, revenue: float}> */
    private function topProducts(): array
    {
        return OrderItem::query()->selectRaw('product_name, sku, SUM(quantity) as units, SUM(total) as revenue')
            ->groupBy(['product_name', 'sku'])->orderByDesc('units')->limit(8)->toBase()->get()
            ->map(fn (object $row): array => ['product_name' => (string) $row->product_name, 'sku' => (string) $row->sku, 'units' => (int) $row->units, 'revenue' => (float) $row->revenue])
            ->values()->all();
    }

    /** @return array<int, array{id: int, name: string, sku: string, stock: int, threshold: int, category: string|null}> */
    private function lowStockProducts(): array
    {
        return Product::query()->select(['id', 'category_id', 'name', 'sku', 'stock', 'low_stock_threshold'])
            ->with('category:id,name')->whereColumn('stock', '<=', 'low_stock_threshold')->orderBy('stock')->limit(8)->get()
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'stock' => $product->stock,
                'threshold' => $product->low_stock_threshold,
                'category' => $product->category?->name,
            ])->values()->all();
    }
}
