import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    BadgeIndianRupee,
    CircleGauge,
    PackageCheck,
    Sparkles,
    Store,
    TrendingDown,
} from 'lucide-react';
import {
    AdminEmptyState,
    AdminPageHeader,
    AdminPanel,
} from '@/components/admin/primitives';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import admin from '@/routes/admin';
import type { AccountPermission } from '@/types/auth';

type Overview = {
    approved_sellers: number;
    active_listings: number;
    catalogue_health: number;
    return_rate: number;
};
type SellerPerformance = {
    id: number;
    business_name: string;
    products: number;
    active_products: number;
    orders: number;
    units: number;
    revenue: number;
    returns: number;
    score: number;
};
type PriceRecommendation = {
    id: number;
    name: string;
    sku: string;
    price: string;
    recommended_price: number;
    stock: number;
    order_items_count: number;
    vendor?: { id: number; business_name: string } | null;
};
type AlertProduct = {
    id: number;
    name: string;
    sku: string;
    stock: number;
    low_stock_threshold?: number;
};
type Props = {
    overview: Overview;
    sellerPerformance: SellerPerformance[];
    priceRecommendations: PriceRecommendation[];
    catalogueAlerts: {
        low_stock: AlertProduct[];
        draft_listings: AlertProduct[];
    };
};

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

export default function GrowthCentre({
    overview,
    sellerPerformance,
    priceRecommendations,
    catalogueAlerts,
}: Props) {
    const { auth } = usePage().props;
    const canManageCatalogue = auth.permissions.includes(
        'catalogue.manage' as AccountPermission,
    );

    return (
        <AdminLayout
            title="Growth Centre"
            breadcrumb="Overview / Growth Centre"
        >
            <AdminPageHeader
                title="Marketplace growth centre"
                description="Flipkart-style seller quality, catalogue health, pricing opportunities, and operational interventions in one workspace."
            />

            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Approved sellers',
                            value: overview.approved_sellers,
                            icon: Store,
                            tone: 'bg-indigo-50 text-indigo-600',
                        },
                        {
                            label: 'Active listings',
                            value: overview.active_listings,
                            icon: PackageCheck,
                            tone: 'bg-emerald-50 text-emerald-600',
                        },
                        {
                            label: 'Catalogue health',
                            value: `${overview.catalogue_health}%`,
                            icon: CircleGauge,
                            tone: 'bg-sky-50 text-sky-600',
                        },
                        {
                            label: 'Return rate',
                            value: `${overview.return_rate}%`,
                            icon: TrendingDown,
                            tone: 'bg-amber-50 text-amber-600',
                        },
                    ]}
                />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.75fr)]">
                <AdminPanel>
                    <PanelHeading
                        icon={CircleGauge}
                        title="Seller performance scorecards"
                        subtitle="Score combines catalogue activation, order activity, and return quality."
                    />
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3">Seller</th>
                                    <th className="px-4 py-3">Catalogue</th>
                                    <th className="px-4 py-3">Orders</th>
                                    <th className="px-4 py-3">Revenue</th>
                                    <th className="px-5 py-3 text-right">
                                        Score
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sellerPerformance.map((seller) => (
                                    <tr key={seller.id}>
                                        <td className="px-5 py-4">
                                            <Link
                                                href={admin.vendors.show.url(
                                                    seller.id,
                                                )}
                                                className="font-bold hover:text-orange-600"
                                            >
                                                {seller.business_name}
                                            </Link>
                                            <p className="text-xs text-slate-500">
                                                {seller.returns} returns
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="font-bold">
                                                {seller.active_products}
                                            </span>{' '}
                                            / {seller.products}
                                            <p className="text-xs text-slate-500">
                                                active
                                            </p>
                                        </td>
                                        <td className="px-4 py-4 font-semibold">
                                            {seller.orders}
                                            <p className="text-xs font-normal text-slate-500">
                                                {seller.units} units
                                            </p>
                                        </td>
                                        <td className="px-4 py-4 font-bold">
                                            {money.format(seller.revenue)}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Score value={seller.score} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {sellerPerformance.length === 0 && (
                            <AdminEmptyState
                                icon={Store}
                                title="No approved sellers yet"
                                description="Seller scorecards appear after vendor approval."
                            />
                        )}
                    </div>
                </AdminPanel>

                <div className="grid content-start gap-6">
                    <AlertList
                        title="Low-stock intervention"
                        items={catalogueAlerts.low_stock}
                        tone="text-rose-600 bg-rose-50"
                    />
                    <AlertList
                        title="Draft listing queue"
                        items={catalogueAlerts.draft_listings}
                        tone="text-amber-600 bg-amber-50"
                    />
                </div>
            </div>

            <AdminPanel className="mt-6">
                <PanelHeading
                    icon={BadgeIndianRupee}
                    title="Price recommendations"
                    subtitle="A conservative 5% conversion offer for active listings with healthy stock and low sales activity."
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                            <tr>
                                <th className="px-5 py-3">Listing</th>
                                <th className="px-4 py-3">Seller</th>
                                <th className="px-4 py-3">Demand</th>
                                <th className="px-4 py-3">Current</th>
                                <th className="px-4 py-3">Recommended</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {priceRecommendations.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-5 py-4">
                                        <p className="font-bold">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {product.sku} · {product.stock} in
                                            stock
                                        </p>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600">
                                        {product.vendor?.business_name ??
                                            'Platform'}
                                    </td>
                                    <td className="px-4 py-4 font-semibold">
                                        {product.order_items_count} sales
                                    </td>
                                    <td className="px-4 py-4 font-semibold">
                                        {money.format(Number(product.price))}
                                    </td>
                                    <td className="px-4 py-4 font-black text-emerald-600">
                                        {money.format(
                                            product.recommended_price,
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        {canManageCatalogue ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.patch(
                                                        admin.growthCentre.recommendedPrice.url(
                                                            product.id,
                                                        ),
                                                        {},
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                                className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600"
                                            >
                                                Apply price
                                            </button>
                                        ) : (
                                            <span className="text-xs text-slate-400">
                                                View only
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {priceRecommendations.length === 0 && (
                        <AdminEmptyState
                            icon={Sparkles}
                            title="No pricing opportunities"
                            description="Eligible recommendations appear when active products have healthy stock."
                        />
                    )}
                </div>
            </AdminPanel>
        </AdminLayout>
    );
}

function PanelHeading({
    icon: Icon,
    title,
    subtitle,
}: {
    icon: typeof Sparkles;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="flex items-start gap-3 border-b border-slate-100 p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
                <Icon className="size-5" />
            </span>
            <div>
                <h3 className="font-black">{title}</h3>
                <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
            </div>
        </div>
    );
}

function Score({ value }: { value: number }) {
    const tone =
        value >= 75
            ? 'bg-emerald-50 text-emerald-700'
            : value >= 50
              ? 'bg-amber-50 text-amber-700'
              : 'bg-rose-50 text-rose-700';

    return (
        <span
            className={`inline-flex min-w-12 justify-center rounded-full px-2.5 py-1 text-xs font-black ${tone}`}
        >
            {value}
        </span>
    );
}

function AlertList({
    title,
    items,
    tone,
}: {
    title: string;
    items: AlertProduct[];
    tone: string;
}) {
    return (
        <AdminPanel>
            <div className="flex items-center gap-2 border-b border-slate-100 p-4">
                <AlertTriangle className="size-4 text-orange-500" />
                <h3 className="text-sm font-black">{title}</h3>
            </div>
            <div className="grid gap-2 p-3">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={admin.products.edit.url(item.id)}
                        className="flex items-center justify-between gap-3 rounded-xl p-3 hover:bg-slate-50"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                                {item.name}
                            </p>
                            <p className="text-xs text-slate-500">{item.sku}</p>
                        </div>
                        <span
                            className={`shrink-0 rounded-lg px-2 py-1 text-xs font-black ${tone}`}
                        >
                            {item.stock} units
                        </span>
                    </Link>
                ))}
                {items.length === 0 && (
                    <p className="p-5 text-center text-xs text-slate-500">
                        Nothing needs attention.
                    </p>
                )}
            </div>
        </AdminPanel>
    );
}
