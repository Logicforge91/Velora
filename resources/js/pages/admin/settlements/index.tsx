import { Link, router } from '@inertiajs/react';
import { Banknote, Clock3, Plus, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/settlements';
import type { Counts, Paginated, Settlement } from '@/types/admin';
const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});
export default function SettlementsIndex({
    settlements,
    counts,
    statuses,
}: {
    settlements: Paginated<Settlement>;
    counts: Counts;
    statuses: string[];
}) {
    const query = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(query.get('search') ?? '');
    const [status, setStatus] = useState(query.get('status') ?? '');
    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            routes.index.url(),
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Settlements" breadcrumb="Finance / Seller payouts">
            <div className="flex justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black">
                        Seller payout control
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Reconcile commissions, deductions and bank payouts.
                    </p>
                </div>
                <Link
                    href={routes.create.url()}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white"
                >
                    <Plus className="size-4" /> Generate settlement
                </Link>
            </div>
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Settlements',
                            value: counts.total,
                            icon: Banknote,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Pending approval',
                            value: counts.pending,
                            icon: Clock3,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'In payout queue',
                            value: counts.payable,
                            icon: ShieldCheck,
                            tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
                        },
                        {
                            label: 'Paid value',
                            value: money.format(counts.paid_value),
                            icon: Banknote,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                    ]}
                />
            </div>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[1fr_12rem_auto] dark:border-white/10"
                >
                    <label className="relative">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Seller, settlement or UTR"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 text-sm dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All statuses</option>
                        {statuses.map((v) => (
                            <option key={v} value={v}>
                                {v.replaceAll('_', ' ')}
                            </option>
                        ))}
                    </select>
                    <button className="rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {settlements.data.map((item) => (
                        <Link
                            key={item.id}
                            href={routes.show.url(item.id)}
                            className="grid gap-3 p-5 transition hover:bg-slate-50 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center dark:hover:bg-white/5"
                        >
                            <div>
                                <p className="font-black">{item.number}</p>
                                <p className="text-xs text-slate-500">
                                    {item.period_start.slice(0, 10)} —{' '}
                                    {item.period_end.slice(0, 10)}
                                </p>
                            </div>
                            <div>
                                <p className="font-bold">
                                    {item.vendor.business_name}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Gross{' '}
                                    {money.format(Number(item.gross_sales))}
                                </p>
                            </div>
                            <span className="text-sm font-black text-emerald-600">
                                {money.format(Number(item.net_amount))}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase dark:bg-white/10">
                                {item.status}
                            </span>
                        </Link>
                    ))}
                    {settlements.data.length === 0 && (
                        <p className="p-14 text-center text-sm text-slate-500">
                            No seller settlements found.
                        </p>
                    )}
                </div>
                <Pagination links={settlements.links} />
            </section>
        </AdminLayout>
    );
}
