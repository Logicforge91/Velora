<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ReturnCase;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class GrowthCentreService
{
    /** @return array{approved_sellers: int, active_listings: int, catalogue_health: int, return_rate: float} */
    public function overview(): array
    {
        $catalogue = Product::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as active', [Product::STATUS_ACTIVE])
            ->selectRaw('SUM(CASE WHEN status = ? OR stock <= low_stock_threshold THEN 1 ELSE 0 END) as unhealthy', [Product::STATUS_DRAFT])
            ->toBase()
            ->firstOrFail();
        $soldItems = OrderItem::query()->whereHas('order', fn ($query) => $query->where('status', '!=', Order::STATUS_CANCELLED))->count();
        $returns = ReturnCase::query()->count();
        $total = (int) $catalogue->total;

        return [
            'approved_sellers' => Vendor::query()->where('status', Vendor::STATUS_APPROVED)->count(),
            'active_listings' => (int) $catalogue->active,
            'catalogue_health' => $total === 0 ? 100 : (int) round((($total - (int) $catalogue->unhealthy) / $total) * 100),
            'return_rate' => $soldItems === 0 ? 0 : round(($returns / $soldItems) * 100, 1),
        ];
    }

    /** @return list<array{id: int, business_name: string, products: int, active_products: int, orders: int, units: int, revenue: float, returns: int, score: int}> */
    public function sellerPerformance(): array
    {
        $vendors = Vendor::query()
            ->select(['id', 'business_name'])
            ->where('status', Vendor::STATUS_APPROVED)
            ->withCount(['products', 'products as active_products_count' => fn ($query) => $query->where('status', Product::STATUS_ACTIVE)])
            ->latest()
            ->limit(12)
            ->get();
        $vendorIds = $vendors->modelKeys();
        $sales = OrderItem::query()
            ->select('vendor_id')
            ->selectRaw('COUNT(DISTINCT order_id) as orders_count, COALESCE(SUM(quantity), 0) as units, COALESCE(SUM(total), 0) as revenue')
            ->whereIn('vendor_id', $vendorIds)
            ->whereHas('order', fn ($query) => $query->where('status', '!=', Order::STATUS_CANCELLED))
            ->groupBy('vendor_id')
            ->get()
            ->keyBy('vendor_id');
        $returns = ReturnCase::query()
            ->whereHas('orderItem', fn ($query) => $query->whereIn('vendor_id', $vendorIds))
            ->with('orderItem:id,vendor_id')
            ->get()
            ->countBy('orderItem.vendor_id');

        return $vendors->map(function (Vendor $vendor) use ($sales, $returns): array {
            $sale = $sales->get($vendor->id);
            $orders = (int) ($sale?->orders_count ?? 0);
            $returnCount = (int) $returns->get($vendor->id, 0);
            $catalogueScore = $vendor->products_count === 0 ? 0 : ($vendor->active_products_count / $vendor->products_count) * 40;
            $returnScore = $orders === 0 ? 30 : max(0, 30 - (($returnCount / $orders) * 100));
            $activityScore = min(30, $orders * 3);

            return [
                'id' => $vendor->id,
                'business_name' => $vendor->business_name,
                'products' => (int) $vendor->products_count,
                'active_products' => (int) $vendor->active_products_count,
                'orders' => $orders,
                'units' => (int) ($sale?->units ?? 0),
                'revenue' => (float) ($sale?->revenue ?? 0),
                'returns' => $returnCount,
                'score' => (int) round($catalogueScore + $returnScore + $activityScore),
            ];
        })->sortByDesc('score')->values()->all();
    }

    /** @return Collection<int, Product> */
    public function priceRecommendations(): Collection
    {
        return Product::query()
            ->select(['id', 'vendor_id', 'name', 'sku', 'price', 'compare_at_price', 'stock'])
            ->with('vendor:id,business_name')
            ->where('status', Product::STATUS_ACTIVE)
            ->whereColumn('stock', '>', 'low_stock_threshold')
            ->withCount('orderItems')
            ->orderBy('order_items_count')
            ->orderByDesc('stock')
            ->limit(10)
            ->get()
            ->each(fn (Product $product) => $product->setAttribute('recommended_price', $this->recommendedPrice($product)));
    }

    /** @return array{low_stock: Collection<int, Product>, draft_listings: Collection<int, Product>} */
    public function catalogueAlerts(): array
    {
        return [
            'low_stock' => Product::query()->select(['id', 'name', 'sku', 'stock', 'low_stock_threshold'])->whereColumn('stock', '<=', 'low_stock_threshold')->orderBy('stock')->limit(8)->get(),
            'draft_listings' => Product::query()->select(['id', 'name', 'sku', 'stock'])->where('status', Product::STATUS_DRAFT)->latest()->limit(8)->get(),
        ];
    }

    public function applyPriceRecommendation(Product $product): Product
    {
        if ($product->status !== Product::STATUS_ACTIVE || $product->stock <= $product->low_stock_threshold) {
            throw ValidationException::withMessages(['product' => 'Only active listings with healthy stock qualify for price recommendations.']);
        }

        $currentPrice = (float) $product->price;
        $product->update([
            'compare_at_price' => max((float) ($product->compare_at_price ?? 0), $currentPrice),
            'price' => $this->recommendedPrice($product),
        ]);

        return $product->fresh();
    }

    private function recommendedPrice(Product $product): float
    {
        return round(max(1, (float) $product->price * 0.95), 2);
    }
}
