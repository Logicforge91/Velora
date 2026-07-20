<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentRefund;
use App\Models\Product;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

/**
 * @phpstan-type ReportColumn array{key: string, label: string, format: string}
 * @phpstan-type ReportDataset array{columns: list<ReportColumn>, rows: list<array<string, mixed>>}
 */
class AnalyticsService
{
    /** @var array<string, array{label: string, group: string, description: string, dataset: string}> */
    private const REPORTS = [
        'sales' => ['label' => 'Sales Reports', 'group' => 'Commerce', 'description' => 'Daily sales value and order volume.', 'dataset' => 'daily'],
        'orders' => ['label' => 'Order Reports', 'group' => 'Commerce', 'description' => 'Order distribution across operational statuses.', 'dataset' => 'orders'],
        'revenue' => ['label' => 'Revenue Reports', 'group' => 'Commerce', 'description' => 'Gross revenue, discounts, tax, and shipping income.', 'dataset' => 'daily'],
        'products' => ['label' => 'Product Reports', 'group' => 'Catalogue', 'description' => 'Best-selling products ranked by units and revenue.', 'dataset' => 'products'],
        'categories' => ['label' => 'Category Reports', 'group' => 'Catalogue', 'description' => 'Category contribution to marketplace sales.', 'dataset' => 'categories'],
        'brands' => ['label' => 'Brand Reports', 'group' => 'Catalogue', 'description' => 'Brand performance across orders and units.', 'dataset' => 'brands'],
        'sellers' => ['label' => 'Seller Reports', 'group' => 'Marketplace', 'description' => 'Seller sales, commissions, and order volume.', 'dataset' => 'sellers'],
        'seller-performance' => ['label' => 'Seller Performance', 'group' => 'Marketplace', 'description' => 'Compare seller revenue and commission efficiency.', 'dataset' => 'sellers'],
        'customers' => ['label' => 'Customer Reports', 'group' => 'Audience', 'description' => 'Top customers by spend and order frequency.', 'dataset' => 'customers'],
        'inventory' => ['label' => 'Inventory Reports', 'group' => 'Operations', 'description' => 'Stock position and products requiring attention.', 'dataset' => 'inventory'],
        'fulfilment' => ['label' => 'Fulfilment Reports', 'group' => 'Operations', 'description' => 'Item fulfilment progress across the selected period.', 'dataset' => 'fulfilment'],
        'logistics' => ['label' => 'Logistics Reports', 'group' => 'Operations', 'description' => 'Shipment performance grouped by carrier and status.', 'dataset' => 'logistics'],
        'returns' => ['label' => 'Returns Reports', 'group' => 'After sales', 'description' => 'Return volume, reasons, and refund exposure.', 'dataset' => 'returns'],
        'rto' => ['label' => 'RTO Reports', 'group' => 'After sales', 'description' => 'Return-to-origin shipment outcomes and exposure.', 'dataset' => 'rto'],
        'refunds' => ['label' => 'Refund Reports', 'group' => 'After sales', 'description' => 'Refund requests, status, and processed value.', 'dataset' => 'refunds'],
        'settlements' => ['label' => 'Settlement Reports', 'group' => 'Finance', 'description' => 'Seller settlement value and payout status.', 'dataset' => 'settlements'],
        'commission' => ['label' => 'Commission Reports', 'group' => 'Finance', 'description' => 'Marketplace commission earned by seller.', 'dataset' => 'sellers'],
        'tax' => ['label' => 'Tax Reports', 'group' => 'Finance', 'description' => 'Issued tax documents and GST components.', 'dataset' => 'tax'],
        'campaigns' => ['label' => 'Campaign Reports', 'group' => 'Growth', 'description' => 'Coupon redemption and discount performance.', 'dataset' => 'campaigns'],
        'conversion' => ['label' => 'Conversion Reports', 'group' => 'Growth', 'description' => 'Completed order value by acquisition channel.', 'dataset' => 'conversion'],
        'profitability' => ['label' => 'Profitability Reports', 'group' => 'Finance', 'description' => 'Net contribution after discounts, refunds, and seller commission.', 'dataset' => 'daily'],
        'custom' => ['label' => 'Custom Report Builder', 'group' => 'Custom', 'description' => 'Build an order summary using a selected business dimension.', 'dataset' => 'custom'],
    ];

    /** @return list<string> */
    public static function reportKeys(): array
    {
        return array_keys(self::REPORTS);
    }

    /**
     * @param  array{report?: string, from?: string, to?: string, dimension?: string}  $filters
     * @return array<string, mixed>
     */
    public function getReport(array $filters = []): array
    {
        $key = $filters['report'] ?? 'sales';
        $to = isset($filters['to']) ? CarbonImmutable::parse($filters['to'])->endOfDay() : CarbonImmutable::now()->endOfDay();
        $from = isset($filters['from']) ? CarbonImmutable::parse($filters['from'])->startOfDay() : $to->subDays(29)->startOfDay();
        $dimension = $filters['dimension'] ?? 'status';
        $definition = self::REPORTS[$key];

        return [
            'catalog' => collect(self::REPORTS)->map(fn (array $report, string $reportKey): array => [
                'key' => $reportKey,
                'label' => $report['label'],
                'group' => $report['group'],
            ])->values()->all(),
            'filters' => ['report' => $key, 'from' => $from->toDateString(), 'to' => $to->toDateString(), 'dimension' => $dimension],
            'report' => [
                'key' => $key,
                'label' => $definition['label'],
                'description' => $definition['description'],
                ...$this->dataset($definition['dataset'], $from, $to, $dimension),
            ],
            'summary' => $this->summary($from, $to),
            'dailyRevenue' => $this->dailyRevenue($from, $to),
        ];
    }

    /** @return ReportDataset */
    private function dataset(string $dataset, CarbonImmutable $from, CarbonImmutable $to, string $dimension): array
    {
        return match ($dataset) {
            'daily' => $this->dailyDataset($from, $to),
            'orders' => $this->groupedOrderDataset($from, $to, 'status', 'Status'),
            'products' => $this->productDataset($from, $to),
            'categories' => $this->catalogueDataset($from, $to, 'categories', 'category'),
            'brands' => $this->catalogueDataset($from, $to, 'brands', 'brand'),
            'sellers' => $this->sellerDataset($from, $to),
            'customers' => $this->customerDataset($from, $to),
            'inventory' => $this->inventoryDataset(),
            'fulfilment' => $this->fulfilmentDataset($from, $to),
            'logistics' => $this->logisticsDataset($from, $to),
            'returns' => $this->returnDataset($from, $to),
            'rto' => $this->rtoDataset($from, $to),
            'refunds' => $this->refundDataset($from, $to),
            'settlements' => $this->settlementDataset($from, $to),
            'tax' => $this->taxDataset($from, $to),
            'campaigns' => $this->campaignDataset($from, $to),
            'conversion' => $this->groupedOrderDataset($from, $to, 'channel', 'Channel'),
            'custom' => $this->groupedOrderDataset($from, $to, $dimension, str($dimension)->replace('_', ' ')->title()->toString()),
            default => $this->table([], []),
        };
    }

    /** @return ReportDataset */
    private function dailyDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = Order::query()->whereBetween('placed_at', [$from, $to])->where('status', '!=', Order::STATUS_CANCELLED)
            ->selectRaw('DATE(placed_at) as label, COUNT(*) as orders, SUM(total) as revenue, SUM(discount_total) as discounts, SUM(tax_total) as tax')
            ->groupByRaw('DATE(placed_at)')->orderBy('label')->toBase()->get();

        return $this->table([
            $this->column('label', 'Date', 'date'), $this->column('orders', 'Orders', 'number'), $this->column('revenue', 'Revenue', 'money'),
            $this->column('discounts', 'Discounts', 'money'), $this->column('tax', 'Tax', 'money'),
        ], $rows);
    }

    /** @return ReportDataset */
    private function groupedOrderDataset(CarbonImmutable $from, CarbonImmutable $to, string $dimension, string $label): array
    {
        $query = Order::query()->whereBetween('placed_at', [$from, $to]);
        $rows = (match ($dimension) {
            'status' => $query->selectRaw('status as label, COUNT(*) as orders, SUM(total) as revenue, AVG(total) as average_value')->groupBy('status'),
            'channel' => $query->selectRaw('channel as label, COUNT(*) as orders, SUM(total) as revenue, AVG(total) as average_value')->groupBy('channel'),
            'payment_method' => $query->selectRaw('payment_method as label, COUNT(*) as orders, SUM(total) as revenue, AVG(total) as average_value')->groupBy('payment_method'),
            default => throw new \LogicException('Unsupported report dimension.'),
        })->orderByDesc('orders')->toBase()->get();

        return $this->table([
            $this->column('label', $label, 'status'), $this->column('orders', 'Orders', 'number'),
            $this->column('revenue', 'Revenue', 'money'), $this->column('average_value', 'Average value', 'money'),
        ], $rows);
    }

    /** @return ReportDataset */
    private function productDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = DB::table('order_items')->join('orders', 'orders.id', '=', 'order_items.order_id')->whereBetween('orders.placed_at', [$from, $to])
            ->where('orders.status', '!=', Order::STATUS_CANCELLED)
            ->selectRaw('order_items.product_name as label, order_items.sku, SUM(order_items.quantity) as units, SUM(order_items.total) as revenue')
            ->groupBy(['order_items.product_name', 'order_items.sku'])->orderByDesc('revenue')->limit(50)->get();

        return $this->table([$this->column('label', 'Product'), $this->column('sku', 'SKU'), $this->column('units', 'Units', 'number'), $this->column('revenue', 'Revenue', 'money')], $rows);
    }

    /** @return ReportDataset */
    private function catalogueDataset(CarbonImmutable $from, CarbonImmutable $to, string $table, string $singular): array
    {
        $query = DB::table('order_items')->join('orders', 'orders.id', '=', 'order_items.order_id')->join('products', 'products.id', '=', 'order_items.product_id')
            ->whereBetween('orders.placed_at', [$from, $to])->where('orders.status', '!=', Order::STATUS_CANCELLED);
        $rows = (match ($table) {
            'categories' => $query->leftJoin('categories', 'categories.id', '=', 'products.category_id')
                ->selectRaw("COALESCE(categories.name, 'Unassigned') as label, COUNT(DISTINCT orders.id) as orders, SUM(order_items.quantity) as units, SUM(order_items.total) as revenue")
                ->groupBy('categories.name'),
            'brands' => $query->leftJoin('brands', 'brands.id', '=', 'products.brand_id')
                ->selectRaw("COALESCE(brands.name, 'Unassigned') as label, COUNT(DISTINCT orders.id) as orders, SUM(order_items.quantity) as units, SUM(order_items.total) as revenue")
                ->groupBy('brands.name'),
            default => throw new \LogicException('Unsupported catalogue report.'),
        })->orderByDesc('revenue')->limit(50)->get();

        return $this->table([$this->column('label', ucfirst($singular)), $this->column('orders', 'Orders', 'number'), $this->column('units', 'Units', 'number'), $this->column('revenue', 'Revenue', 'money')], $rows);
    }

    /** @return ReportDataset */
    private function sellerDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = DB::table('order_items')->join('orders', 'orders.id', '=', 'order_items.order_id')->leftJoin('vendors', 'vendors.id', '=', 'order_items.vendor_id')
            ->whereBetween('orders.placed_at', [$from, $to])->where('orders.status', '!=', Order::STATUS_CANCELLED)
            ->selectRaw("COALESCE(vendors.business_name, 'Marketplace') as label, COUNT(DISTINCT orders.id) as orders, SUM(order_items.total) as revenue, SUM(order_items.commission_amount) as commission")
            ->groupBy('vendors.business_name')->orderByDesc('revenue')->limit(50)->get();

        return $this->table([$this->column('label', 'Seller'), $this->column('orders', 'Orders', 'number'), $this->column('revenue', 'Gross sales', 'money'), $this->column('commission', 'Commission', 'money')], $rows);
    }

    /** @return ReportDataset */
    private function customerDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = DB::table('orders')->leftJoin('users', 'users.id', '=', 'orders.user_id')->whereBetween('orders.placed_at', [$from, $to])->where('orders.status', '!=', Order::STATUS_CANCELLED)
            ->selectRaw("COALESCE(users.name, 'Guest customer') as label, users.email, COUNT(orders.id) as orders, SUM(orders.total) as revenue")
            ->groupBy(['users.id', 'users.name', 'users.email'])->orderByDesc('revenue')->limit(50)->get();

        return $this->table([$this->column('label', 'Customer'), $this->column('email', 'Email'), $this->column('orders', 'Orders', 'number'), $this->column('revenue', 'Spend', 'money')], $rows);
    }

    /** @return ReportDataset */
    private function inventoryDataset(): array
    {
        $rows = Product::query()->selectRaw('name as label, sku, stock, low_stock_threshold, price as value')->orderBy('stock')->limit(50)->toBase()->get();

        return $this->table([$this->column('label', 'Product'), $this->column('sku', 'SKU'), $this->column('stock', 'Available', 'number'), $this->column('low_stock_threshold', 'Reorder level', 'number'), $this->column('value', 'Unit value', 'money')], $rows);
    }

    /** @return ReportDataset */
    private function fulfilmentDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = DB::table('order_items')->join('orders', 'orders.id', '=', 'order_items.order_id')->whereBetween('orders.placed_at', [$from, $to])
            ->selectRaw('order_items.fulfilment_status as label, COUNT(*) as items, SUM(order_items.quantity) as units, SUM(order_items.total) as revenue')
            ->groupBy('order_items.fulfilment_status')->orderByDesc('items')->get();

        return $this->table([$this->column('label', 'Status', 'status'), $this->column('items', 'Lines', 'number'), $this->column('units', 'Units', 'number'), $this->column('revenue', 'Value', 'money')], $rows);
    }

    /** @return ReportDataset */
    private function logisticsDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = DB::table('shipments')->join('orders', 'orders.id', '=', 'shipments.order_id')->whereBetween('orders.placed_at', [$from, $to])
            ->selectRaw("COALESCE(shipments.carrier, 'Unassigned') as label, shipments.status, COUNT(*) as shipments")
            ->groupBy(['shipments.carrier', 'shipments.status'])->orderByDesc('shipments')->get();

        return $this->table([$this->column('label', 'Carrier'), $this->column('status', 'Status', 'status'), $this->column('shipments', 'Shipments', 'number')], $rows);
    }

    /** @return ReportDataset */
    private function returnDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = DB::table('return_cases')->whereBetween('requested_at', [$from, $to])->selectRaw('reason_code as label, status, COUNT(*) as cases, SUM(refund_amount) as amount')
            ->groupBy(['reason_code', 'status'])->orderByDesc('cases')->get();

        return $this->table([$this->column('label', 'Reason'), $this->column('status', 'Status', 'status'), $this->column('cases', 'Cases', 'number'), $this->column('amount', 'Exposure', 'money')], $rows);
    }

    /** @return ReportDataset */
    private function rtoDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = DB::table('shipments')->join('orders', 'orders.id', '=', 'shipments.order_id')->whereBetween('orders.placed_at', [$from, $to])
            ->whereIn('shipments.status', ['rto', 'return_to_origin', 'returned'])->selectRaw("COALESCE(shipments.carrier, 'Unassigned') as label, shipments.status, COUNT(*) as cases")
            ->groupBy(['shipments.carrier', 'shipments.status'])->orderByDesc('cases')->get();

        return $this->table([$this->column('label', 'Carrier'), $this->column('status', 'Status', 'status'), $this->column('cases', 'Cases', 'number')], $rows);
    }

    /** @return ReportDataset */
    private function refundDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = DB::table('payment_refunds')->whereBetween('requested_at', [$from, $to])->selectRaw('status as label, COUNT(*) as refunds, SUM(amount) as amount')->groupBy('status')->orderByDesc('refunds')->get();

        return $this->table([$this->column('label', 'Status', 'status'), $this->column('refunds', 'Refunds', 'number'), $this->column('amount', 'Amount', 'money')], $rows);
    }

    /** @return ReportDataset */
    private function settlementDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = DB::table('settlements')->whereBetween('period_end', [$from->toDateString(), $to->toDateString()])
            ->selectRaw('status as label, COUNT(*) as settlements, SUM(gross_sales) as revenue, SUM(net_amount) as amount')->groupBy('status')->orderByDesc('settlements')->get();

        return $this->table([$this->column('label', 'Status', 'status'), $this->column('settlements', 'Settlements', 'number'), $this->column('revenue', 'Gross sales', 'money'), $this->column('amount', 'Net payout', 'money')], $rows);
    }

    /** @return ReportDataset */
    private function taxDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = DB::table('tax_invoices')->whereBetween('issued_on', [$from->toDateString(), $to->toDateString()])
            ->selectRaw('status as label, COUNT(*) as invoices, SUM(taxable_value) as taxable_value, SUM(cgst_amount + sgst_amount + igst_amount + cess_amount) as tax')->groupBy('status')->orderByDesc('invoices')->get();

        return $this->table([$this->column('label', 'Status', 'status'), $this->column('invoices', 'Invoices', 'number'), $this->column('taxable_value', 'Taxable value', 'money'), $this->column('tax', 'GST', 'money')], $rows);
    }

    /** @return ReportDataset */
    private function campaignDataset(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $rows = DB::table('coupon_redemptions')->whereBetween('redeemed_at', [$from, $to])->selectRaw('code_snapshot as label, COUNT(*) as redemptions, SUM(discount_amount) as amount')
            ->groupBy('code_snapshot')->orderByDesc('redemptions')->limit(50)->get();

        return $this->table([$this->column('label', 'Campaign code'), $this->column('redemptions', 'Redemptions', 'number'), $this->column('amount', 'Discount value', 'money')], $rows);
    }

    /** @return ReportColumn */
    private function column(string $key, string $label, string $format = 'text'): array
    {
        return compact('key', 'label', 'format');
    }

    /**
     * @param  list<ReportColumn>  $columns
     * @param  iterable<int, object>  $rows
     * @return ReportDataset
     */
    private function table(array $columns, iterable $rows): array
    {
        return ['columns' => $columns, 'rows' => array_values(collect($rows)->map(fn (object $row): array => get_object_vars($row))->all())];
    }

    /** @return array<string, int|float> */
    private function summary(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $orders = Order::query()->whereBetween('placed_at', [$from, $to])->selectRaw('COUNT(*) as orders')
            ->selectRaw('COALESCE(SUM(CASE WHEN status != ? THEN total ELSE 0 END), 0) as revenue', [Order::STATUS_CANCELLED])
            ->selectRaw('COALESCE(AVG(CASE WHEN status != ? THEN total END), 0) as average_order_value', [Order::STATUS_CANCELLED])->toBase()->firstOrFail();
        $products = Product::query()->selectRaw('COALESCE(SUM(stock), 0) as units_in_stock')->selectRaw('SUM(CASE WHEN stock <= low_stock_threshold THEN 1 ELSE 0 END) as stock_alerts')->toBase()->firstOrFail();
        $refunds = PaymentRefund::query()->whereBetween('requested_at', [$from, $to])->sum('amount');
        $commission = OrderItem::query()->whereIn('order_id', Order::query()->whereBetween('placed_at', [$from, $to])->select('id'))->sum('commission_amount');

        return ['orders' => (int) $orders->orders, 'revenue' => (float) $orders->revenue, 'average_order_value' => (float) $orders->average_order_value,
            'units_in_stock' => (int) $products->units_in_stock, 'stock_alerts' => (int) $products->stock_alerts,
            'refunds' => (float) $refunds, 'commission' => (float) $commission];
    }

    /** @return list<array{date: string, orders: int, revenue: float}> */
    private function dailyRevenue(CarbonImmutable $from, CarbonImmutable $to): array
    {
        return array_values(Order::query()->selectRaw('DATE(placed_at) as period, COUNT(*) as orders, SUM(total) as revenue')->where('status', '!=', Order::STATUS_CANCELLED)
            ->whereBetween('placed_at', [$from, $to])->groupByRaw('DATE(placed_at)')->orderBy('period')->toBase()->get()
            ->map(fn (object $row): array => ['date' => (string) $row->period, 'orders' => (int) $row->orders, 'revenue' => (float) $row->revenue])->all());
    }
}
