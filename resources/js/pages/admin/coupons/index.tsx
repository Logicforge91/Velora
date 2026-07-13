import { Link, router } from '@inertiajs/react';
import {
    BadgePercent,
    CalendarClock,
    CircleOff,
    Pencil,
    Plus,
    Search,
    TicketCheck,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import couponsRoutes from '@/routes/admin/coupons';
import type { Coupon, Counts, Paginated } from '@/types/admin';
type Props = { coupons: Paginated<Coupon>; counts: Counts };
const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});
export default function CouponsIndex({ coupons, counts }: Props) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [state, setState] = useState(params.get('state') ?? '');
    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            couponsRoutes.index.url(),
            { search, state },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Promotions" breadcrumb="Growth / Coupons">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-black">Promotion campaigns</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Launch bounded discounts with dates, budgets and
                        redemption caps.
                    </p>
                </div>
                <Link
                    href={couponsRoutes.create.url()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white"
                >
                    <Plus className="size-4" />
                    New campaign
                </Link>
            </div>
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Campaigns',
                            value: counts.total,
                            icon: BadgePercent,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Active now',
                            value: counts.active,
                            icon: TicketCheck,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                        {
                            label: 'Expired',
                            value: counts.expired,
                            icon: CalendarClock,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'Redemptions',
                            value: counts.redemptions,
                            icon: CircleOff,
                            tone: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10',
                        },
                    ]}
                />
            </div>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={submit}
                    className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row dark:border-white/10"
                >
                    <label className="relative flex-1">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search code or campaign"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All campaigns</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="disabled">Disabled</option>
                    </select>
                    <button className="rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase dark:bg-white/5">
                            <tr>
                                <th className="px-5 py-3">Campaign</th>
                                <th className="px-4 py-3">Benefit</th>
                                <th className="px-4 py-3">Usage</th>
                                <th className="px-4 py-3">Window</th>
                                <th className="px-5 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {coupons.data.map((coupon) => (
                                <tr key={coupon.id}>
                                    <td className="px-5 py-4">
                                        <code className="rounded-lg bg-orange-50 px-2 py-1 font-black text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                                            {coupon.code}
                                        </code>
                                        <p className="mt-2 font-bold">
                                            {coupon.name}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4 font-bold">
                                        {coupon.type === 'percentage'
                                            ? `${Number(coupon.value)}%`
                                            : money.format(
                                                  Number(coupon.value),
                                              )}
                                        <p className="text-xs font-normal text-slate-500">
                                            Min{' '}
                                            {money.format(
                                                Number(
                                                    coupon.minimum_order_amount,
                                                ),
                                            )}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        {coupon.used_count} /{' '}
                                        {coupon.usage_limit ?? '∞'}
                                    </td>
                                    <td className="px-4 py-4 text-xs text-slate-500">
                                        {coupon.starts_at
                                            ? new Date(
                                                  coupon.starts_at,
                                              ).toLocaleDateString()
                                            : 'Now'}{' '}
                                        –{' '}
                                        {coupon.expires_at
                                            ? new Date(
                                                  coupon.expires_at,
                                              ).toLocaleDateString()
                                            : 'No expiry'}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                href={couponsRoutes.edit.url(
                                                    coupon.id,
                                                )}
                                                className="p-2 text-indigo-600"
                                            >
                                                <Pencil className="size-4" />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    confirm(
                                                        `Delete ${coupon.code}?`,
                                                    ) &&
                                                    router.delete(
                                                        couponsRoutes.destroy.url(
                                                            coupon.id,
                                                        ),
                                                    )
                                                }
                                                className="p-2 text-rose-600"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {coupons.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-12 text-center text-slate-500"
                                    >
                                        No promotion campaigns found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={coupons.links} />
            </section>
        </AdminLayout>
    );
}
