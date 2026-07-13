import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Banknote,
    Clock3,
    PackageOpen,
    Plus,
    Search,
    Truck,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import returnsRoutes from '@/routes/admin/returns';
import type { Counts, Paginated, ReturnCase } from '@/types/admin';

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});

const statusTone: Record<string, string> = {
    requested:
        'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    approved: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
    pickup_scheduled:
        'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
    in_transit: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    received:
        'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
    refunded:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
};

type Props = {
    returns: Paginated<ReturnCase>;
    counts: Counts;
    statuses: string[];
};

export default function ReturnsIndex({ returns, counts, statuses }: Props) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const [type, setType] = useState(params.get('type') ?? '');

    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            returnsRoutes.index.url(),
            { search, status, type },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Returns & RTO" breadcrumb="Operations / Returns">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <h2 className="text-xl font-black">Reverse logistics</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Control customer returns, failed deliveries, inventory
                        recovery and refunds.
                    </p>
                </div>
                <Link
                    href={returnsRoutes.create.url()}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
                >
                    <Plus className="size-4" />
                    Open return case
                </Link>
            </div>

            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'All cases',
                            value: counts.total,
                            icon: PackageOpen,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Awaiting action',
                            value: counts.awaiting_action,
                            icon: Clock3,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'Reverse transit',
                            value: counts.reverse_transit,
                            icon: Truck,
                            tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
                        },
                        {
                            label: 'Refund exposure',
                            value: money.format(counts.refund_value),
                            icon: Banknote,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                    ]}
                />
            </div>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[minmax(0,1fr)_11rem_11rem_auto] dark:border-white/10"
                >
                    <label className="relative">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Case, order, tracking or customer"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm outline-none focus:border-orange-300 dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <select
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All case types</option>
                        <option value="return">Customer return</option>
                        <option value="rto">Return to origin</option>
                    </select>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All statuses</option>
                        {statuses.map((value) => (
                            <option key={value} value={value}>
                                {label(value)}
                            </option>
                        ))}
                    </select>
                    <button className="h-10 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>

                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {returns.data.map((returnCase) => (
                        <Link
                            key={returnCase.id}
                            href={returnsRoutes.show.url(returnCase.id)}
                            prefetch
                            className="grid gap-4 p-5 transition hover:bg-slate-50 md:grid-cols-[1.1fr_1fr_1fr_auto] md:items-center dark:hover:bg-white/[0.03]"
                        >
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-black">
                                        {returnCase.number}
                                    </p>
                                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black tracking-wide text-slate-600 uppercase dark:bg-white/10 dark:text-slate-300">
                                        {returnCase.type === 'rto'
                                            ? 'RTO'
                                            : 'Return'}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    Order {returnCase.order.number} ·{' '}
                                    {new Date(
                                        returnCase.requested_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-bold">
                                    {returnCase.customer.name}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                    {returnCase.order_item?.product_name ??
                                        'Entire order'}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span
                                    className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide uppercase ${statusTone[returnCase.status]}`}
                                >
                                    {label(returnCase.status)}
                                </span>
                                <span className="text-sm font-black">
                                    {money.format(
                                        Number(returnCase.refund_amount),
                                    )}
                                </span>
                            </div>
                            <ArrowRight className="size-4 text-slate-400" />
                        </Link>
                    ))}
                    {returns.data.length === 0 && (
                        <div className="p-14 text-center text-sm text-slate-500">
                            No return cases match these filters.
                        </div>
                    )}
                </div>
                <Pagination links={returns.links} />
            </section>
        </AdminLayout>
    );
}

function label(value: string) {
    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}
