import { Link, router } from '@inertiajs/react';
import {
    Banknote,
    Clock3,
    PackageCheck,
    Search,
    ShoppingBag,
    Truck,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import {
    AdminEmptyState,
    AdminFilterBar,
    AdminPageHeader,
    AdminPanel,
    AdminStatusBadge,
} from '@/components/admin/primitives';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import ordersRoutes from '@/routes/admin/orders';
import type { Counts, Order, Paginated } from '@/types/admin';

type Props = { orders: Paginated<Order>; counts: Counts; statuses: string[] };
const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});

export default function OrdersIndex({ orders, counts, statuses }: Props) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const [paymentStatus, setPaymentStatus] = useState(
        params.get('payment_status') ?? '',
    );
    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            ordersRoutes.index.url(),
            { search, status, payment_status: paymentStatus },
            { preserveState: true, replace: true },
        );
    };
    const cards = [
        {
            label: 'Gross order value',
            value: money.format(counts.revenue),
            icon: Banknote,
            tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
        },
        {
            label: 'Awaiting action',
            value: counts.pending,
            icon: Clock3,
            tone: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
        },
        {
            label: 'Being processed',
            value: counts.processing,
            icon: PackageCheck,
            tone: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10',
        },
        {
            label: 'In transit',
            value: counts.shipped,
            icon: Truck,
            tone: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10',
        },
    ];

    return (
        <AdminLayout title="Orders" breadcrumb="Orders / All orders">
            <AdminPageHeader
                title="Order control centre"
                description="Track fulfilment, payments and customer commitments."
            />
            <div className="mt-6">
                <StatCards cards={cards} />
            </div>
            <AdminPanel className="mt-6">
                <AdminFilterBar
                    onSubmit={submit}
                    className="md:grid-cols-[minmax(15rem,1fr)_13rem_13rem_auto]"
                >
                    <label className="relative">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            type="search"
                            placeholder="Order number, customer or email"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All order states</option>
                        {statuses.map((value) => (
                            <option key={value} value={value}>
                                {value[0].toUpperCase() + value.slice(1)}
                            </option>
                        ))}
                    </select>
                    <select
                        value={paymentStatus}
                        onChange={(event) =>
                            setPaymentStatus(event.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All payments</option>
                        {['pending', 'paid', 'failed', 'refunded'].map(
                            (value) => (
                                <option key={value} value={value}>
                                    {value[0].toUpperCase() + value.slice(1)}
                                </option>
                            ),
                        )}
                    </select>
                    <button className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </AdminFilterBar>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-slate-50 text-[11px] tracking-wider text-slate-500 uppercase dark:bg-white/5">
                            <tr>
                                <th className="px-5 py-3">Order</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Placed</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-5 py-3">Fulfilment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {orders.data.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-slate-50/70 dark:hover:bg-white/[0.03]"
                                >
                                    <td className="px-5 py-4">
                                        <Link
                                            href={ordersRoutes.show.url(
                                                order.id,
                                            )}
                                            className="font-bold text-indigo-600 hover:underline"
                                        >
                                            {order.number}
                                        </Link>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {order.items_count} items
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-sm font-semibold">
                                            {order.user.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {order.user.email}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-500">
                                        {new Date(
                                            order.placed_at,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-bold">
                                        {money.format(Number(order.total))}
                                    </td>
                                    <td className="px-4 py-4">
                                        <AdminStatusBadge
                                            value={order.payment_status}
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <AdminStatusBadge
                                            value={order.status}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <AdminEmptyState
                                            icon={ShoppingBag}
                                            title="No matching orders"
                                            description="Try changing the order, payment, or search filters."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={orders.links} />
            </AdminPanel>
        </AdminLayout>
    );
}
