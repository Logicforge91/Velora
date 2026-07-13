import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Banknote,
    Boxes,
    PackageCheck,
    ReceiptIndianRupee,
    TrendingUp,
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import admin from '@/routes/admin';

type Props = {
    summary: {
        orders: number;
        revenue: number;
        average_order_value: number;
        units_in_stock: number;
        stock_alerts: number;
    };
    dailyRevenue: { date: string; orders: number; revenue: number }[];
    orderStatuses: { status: string; total: number }[];
    topProducts: {
        product_name: string;
        sku: string;
        units: number;
        revenue: number;
    }[];
    lowStockProducts: {
        id: number;
        name: string;
        sku: string;
        stock: number;
        threshold: number;
        category: string | null;
    }[];
};

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

export default function Analytics({
    summary,
    dailyRevenue,
    orderStatuses,
    topProducts,
    lowStockProducts,
}: Props) {
    const maxRevenue = Math.max(...dailyRevenue.map((day) => day.revenue), 1);
    const totalStatuses = Math.max(
        orderStatuses.reduce((total, item) => total + item.total, 0),
        1,
    );
    const cards = [
        {
            label: 'Gross revenue',
            value: money.format(summary.revenue),
            note: 'Excludes cancelled orders',
            icon: Banknote,
            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
        },
        {
            label: 'Orders',
            value: summary.orders.toLocaleString(),
            note: `${money.format(summary.average_order_value)} average value`,
            icon: PackageCheck,
            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
        },
        {
            label: 'Units in stock',
            value: summary.units_in_stock.toLocaleString(),
            note: 'Across the full catalogue',
            icon: Boxes,
            tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
        },
        {
            label: 'Inventory alerts',
            value: summary.stock_alerts.toLocaleString(),
            note: 'At or below threshold',
            icon: AlertTriangle,
            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
        },
    ];

    return (
        <AdminLayout
            title="Commerce Analytics"
            breadcrumb="Analytics / Overview"
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">
                        Marketplace intelligence
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                        Performance at a glance
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Revenue, fulfilment and inventory signals from live
                        operational data.
                    </p>
                </div>
                <Link
                    href={admin.orders.index.url()}
                    className="rounded-xl bg-slate-950 px-4 py-2.5 text-center text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                >
                    Open order operations
                </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map(({ label, value, note, icon: Icon, tone }) => (
                    <div
                        key={label}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
                    >
                        <div
                            className={`grid size-10 place-items-center rounded-xl ${tone}`}
                        >
                            <Icon className="size-5" />
                        </div>
                        <p className="mt-5 text-2xl font-black">{value}</p>
                        <p className="mt-1 text-sm font-semibold">{label}</p>
                        <p className="mt-1 text-xs text-slate-500">{note}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.75fr)]">
                <Panel title="30-day revenue trend" icon={TrendingUp}>
                    <div className="mt-8 flex h-64 items-end gap-2 overflow-x-auto border-b border-slate-200 px-1 dark:border-white/10">
                        {dailyRevenue.length > 0 ? (
                            dailyRevenue.map((day) => (
                                <div
                                    key={day.date}
                                    className="group flex h-full min-w-7 flex-1 flex-col justify-end gap-2"
                                >
                                    <div
                                        className="relative min-h-1 rounded-t-lg bg-gradient-to-t from-orange-500 to-amber-300 transition group-hover:from-orange-600"
                                        style={{
                                            height: `${Math.max((day.revenue / maxRevenue) * 100, 3)}%`,
                                        }}
                                    >
                                        <div className="pointer-events-none absolute -top-14 left-1/2 z-10 hidden -translate-x-1/2 rounded-lg bg-slate-950 px-2 py-1 text-center text-[10px] whitespace-nowrap text-white shadow-xl group-hover:block">
                                            {money.format(day.revenue)}
                                            <br />
                                            {day.orders} orders
                                        </div>
                                    </div>
                                    <span className="pb-2 text-center text-[9px] text-slate-400">
                                        {new Date(day.date).getDate()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <Empty label="Revenue will appear after orders are placed." />
                        )}
                    </div>
                </Panel>
                <Panel title="Order status mix" icon={ReceiptIndianRupee}>
                    <div className="mt-6 grid gap-4">
                        {orderStatuses.length > 0 ? (
                            orderStatuses.map((item) => (
                                <div key={item.status}>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold capitalize">
                                            {item.status}
                                        </span>
                                        <span className="text-slate-500">
                                            {item.total}
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-orange-500"
                                            style={{
                                                width: `${(item.total / totalStatuses) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Empty label="No fulfilment data yet." />
                        )}
                    </div>
                </Panel>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <Panel title="Top-selling products" icon={TrendingUp}>
                    <div className="mt-5 overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="text-xs text-slate-400 uppercase">
                                <tr>
                                    <th className="pb-3">Product</th>
                                    <th className="pb-3 text-right">Units</th>
                                    <th className="pb-3 text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {topProducts.map((product) => (
                                    <tr
                                        key={`${product.sku}-${product.product_name}`}
                                    >
                                        <td className="py-3">
                                            <p className="font-bold">
                                                {product.product_name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {product.sku}
                                            </p>
                                        </td>
                                        <td className="py-3 text-right font-semibold">
                                            {product.units}
                                        </td>
                                        <td className="py-3 text-right font-bold">
                                            {money.format(product.revenue)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {topProducts.length === 0 && (
                            <Empty label="Top sellers will appear after order activity." />
                        )}
                    </div>
                </Panel>
                <Panel title="Inventory risk" icon={AlertTriangle}>
                    <div className="mt-5 grid gap-3">
                        {lowStockProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={admin.products.edit.url(product.id)}
                                className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-3 transition hover:border-orange-200 hover:bg-orange-50/50 dark:border-white/5 dark:hover:border-orange-500/20 dark:hover:bg-orange-500/5"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold">
                                        {product.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {product.sku} ·{' '}
                                        {product.category ?? 'Uncategorised'}
                                    </p>
                                </div>
                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${product.stock === 0 ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'}`}
                                >
                                    {product.stock} left
                                </span>
                            </Link>
                        ))}
                        {lowStockProducts.length === 0 && (
                            <Empty label="All inventory is above its alert threshold." />
                        )}
                    </div>
                </Panel>
            </div>
        </AdminLayout>
    );
}

function Panel({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: typeof TrendingUp;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                    <Icon className="size-4" />
                </span>
                <h3 className="font-bold">{title}</h3>
            </div>
            {children}
        </section>
    );
}
function Empty({ label }: { label: string }) {
    return (
        <div className="grid min-h-28 w-full place-items-center text-center text-sm text-slate-500">
            {label}
        </div>
    );
}
