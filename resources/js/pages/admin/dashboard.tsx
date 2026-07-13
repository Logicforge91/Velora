import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    Boxes,
    Check,
    ChevronRight,
    CircleUserRound,
    Clock3,
    PackageCheck,
    Plus,
    ShieldCheck,
    Store,
    Tags,
    TrendingUp,
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import admin from '@/routes/admin';

type Statistics = {
    total_users: number;
    total_admins: number;
    total_vendors: number;
    total_customers: number;
    total_delivery_agents: number;
    total_support_agents: number;
    active_users: number;
    inactive_users: number;
    new_users_30_days: number;
    active_rate: number;
    total_products: number;
    low_stock_products: number;
    total_orders: number;
    pending_orders: number;
    gross_revenue: number;
};

type RecentUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: boolean;
    created_at: string;
};

type DashboardProps = {
    statistics: Statistics;
    recentUsers: RecentUser[];
};

const roleStyles = {
    Customers: 'bg-orange-500',
    Vendors: 'bg-violet-500',
    'Delivery agents': 'bg-sky-500',
    'Support agents': 'bg-emerald-500',
    Administrators: 'bg-slate-700 dark:bg-slate-300',
};

const roleBadgeStyles: Record<string, string> = {
    admin: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
    vendor: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
    customer: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    delivery_agent:
        'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    support_agent:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
};

export default function AdminDashboard({
    statistics,
    recentUsers,
}: DashboardProps) {
    const money = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    });
    const cards = [
        {
            label: 'Gross order value',
            value: money.format(statistics.gross_revenue),
            note: `${statistics.total_orders} marketplace orders`,
            icon: TrendingUp,
            iconStyle:
                'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300',
            trendStyle: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Product catalogue',
            value: statistics.total_products,
            note: `${statistics.low_stock_products} stock alerts`,
            icon: Boxes,
            iconStyle:
                'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
            trendStyle: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Orders requiring action',
            value: statistics.pending_orders,
            note: 'Awaiting fulfilment review',
            icon: PackageCheck,
            iconStyle:
                'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300',
            trendStyle: 'text-violet-600 dark:text-violet-400',
        },
        {
            label: 'Marketplace network',
            value: statistics.total_vendors,
            note: `${statistics.total_customers} registered customers`,
            icon: Clock3,
            iconStyle:
                'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300',
            trendStyle: 'text-rose-600 dark:text-rose-400',
        },
    ];
    const roleMix = [
        ['Customers', statistics.total_customers],
        ['Vendors', statistics.total_vendors],
        ['Delivery agents', statistics.total_delivery_agents],
        ['Support agents', statistics.total_support_agents],
        ['Administrators', statistics.total_admins],
    ] as const;
    const largestRole = Math.max(...roleMix.map(([, value]) => value), 1);
    const newUserRate = Math.round(
        (statistics.new_users_30_days /
            Math.max(
                statistics.total_users - statistics.new_users_30_days,
                1,
            )) *
            100,
    );

    return (
        <AdminLayout title="Commerce Overview" breadcrumb="Dashboard">
            <section className="relative overflow-hidden rounded-[1.75rem] bg-[#111827] text-white shadow-xl shadow-slate-900/10 dark:border dark:border-white/8 dark:bg-[#111722]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.24),transparent_28%),radial-gradient(circle_at_68%_110%,rgba(139,92,246,0.2),transparent_32%)]" />
                <div className="pointer-events-none absolute -top-20 right-[14%] size-56 rounded-full border border-white/5" />
                <div className="pointer-events-none absolute -top-9 right-[9%] size-56 rounded-full border border-white/5" />
                <div className="relative grid lg:grid-cols-[minmax(0,1fr)_22rem]">
                    <div className="px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-orange-200 uppercase backdrop-blur-sm">
                            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.1)]" />
                            Live commerce intelligence
                        </div>
                        <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.1]">
                            Your marketplace,
                            <span className="text-orange-400">
                                {' '}
                                under control.
                            </span>
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-[15px]">
                            Monitor account health, onboard trusted sellers, and
                            keep your catalogue moving from one focused
                            workspace.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                href={admin.vendors.index.url()}
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-400"
                            >
                                Review vendors
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                href={admin.products.index.url()}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                            >
                                Manage products
                            </Link>
                        </div>
                    </div>

                    <div className="border-t border-white/8 bg-white/[0.035] p-6 backdrop-blur-sm lg:border-t-0 lg:border-l lg:p-7">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                    Account health
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-300">
                                    Overall activation rate
                                </p>
                            </div>
                            <ShieldCheck className="size-5 text-emerald-400" />
                        </div>
                        <div className="mt-7 flex items-center gap-6">
                            <div
                                className="relative grid size-28 shrink-0 place-items-center rounded-full"
                                style={{
                                    background: `conic-gradient(#34d399 ${statistics.active_rate}%, rgba(255,255,255,.08) 0)`,
                                }}
                            >
                                <div className="grid size-[5.75rem] place-items-center rounded-full bg-[#171e2a]">
                                    <div className="text-center">
                                        <p className="text-2xl font-semibold tracking-tight">
                                            {statistics.active_rate}%
                                        </p>
                                        <p className="text-[9px] font-semibold tracking-wider text-slate-500 uppercase">
                                            Active
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid flex-1 gap-3">
                                <div>
                                    <p className="text-2xl font-semibold">
                                        {statistics.total_users.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Managed accounts
                                    </p>
                                </div>
                                <div className="h-px bg-white/8" />
                                <div>
                                    <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                                        <TrendingUp className="size-3.5" />
                                        {newUserRate}% growth
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Last 30 days
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map(
                    ({
                        label,
                        value,
                        note,
                        icon: Icon,
                        iconStyle,
                        trendStyle,
                    }) => (
                        <article
                            key={label}
                            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/40 dark:border-white/8 dark:bg-white/[0.035] dark:hover:border-white/15 dark:hover:shadow-none"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                                        {label}
                                    </p>
                                    <p className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                                        {value.toLocaleString()}
                                    </p>
                                </div>
                                <span
                                    className={`grid size-11 place-items-center rounded-xl transition group-hover:scale-105 ${iconStyle}`}
                                >
                                    <Icon className="size-5" />
                                </span>
                            </div>
                            <div
                                className={`mt-5 flex items-center gap-1.5 text-[11px] font-semibold ${trendStyle}`}
                            >
                                <ArrowUpRight className="size-3.5" />
                                {note}
                            </div>
                        </article>
                    ),
                )}
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(20rem,0.75fr)]">
                <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-white/8 dark:bg-white/[0.035]">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 dark:border-white/8">
                        <div>
                            <h3 className="font-semibold tracking-tight text-slate-950 dark:text-white">
                                Recent registrations
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                New accounts joining your marketplace
                            </p>
                        </div>
                        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700 sm:inline-flex dark:bg-emerald-500/10 dark:text-emerald-300">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Live updates
                        </span>
                    </div>
                    {recentUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[650px] text-left">
                                <thead className="bg-slate-50/70 text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase dark:bg-white/[0.025]">
                                    <tr>
                                        <th className="px-6 py-3.5 font-semibold">
                                            Customer
                                        </th>
                                        <th className="px-5 py-3.5 font-semibold">
                                            Role
                                        </th>
                                        <th className="px-5 py-3.5 font-semibold">
                                            Status
                                        </th>
                                        <th className="px-6 py-3.5 text-right font-semibold">
                                            Joined
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/6">
                                    {recentUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="group transition hover:bg-slate-50/80 dark:hover:bg-white/[0.025]"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 text-xs font-bold text-white shadow-sm dark:from-slate-700 dark:to-slate-800">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                            {user.name}
                                                        </p>
                                                        <p className="truncate text-[11px] text-slate-400">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-md px-2 py-1 text-[10px] font-semibold capitalize ${roleBadgeStyles[user.role] ?? 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'}`}
                                                >
                                                    {user.role.replaceAll(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.status ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${user.status ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                    />
                                                    {user.status
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-[11px] font-medium text-slate-400">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    },
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid min-h-64 place-items-center px-6 text-center">
                            <div>
                                <CircleUserRound className="mx-auto size-9 text-slate-300" />
                                <p className="mt-3 text-sm font-semibold">
                                    No registrations yet
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    New accounts will appear here.
                                </p>
                            </div>
                        </div>
                    )}
                </article>

                <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/8 dark:bg-white/[0.035]">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="font-semibold tracking-tight text-slate-950 dark:text-white">
                                Audience mix
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Accounts by platform role
                            </p>
                        </div>
                        <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                            {statistics.total_users.toLocaleString()} total
                        </span>
                    </div>
                    <div className="mt-7 grid gap-5">
                        {roleMix.map(([label, value]) => {
                            const percentage = Math.round(
                                (value / Math.max(statistics.total_users, 1)) *
                                    100,
                            );
                            const relativeWidth = Math.max(
                                Math.round((value / largestRole) * 100),
                                value > 0 ? 4 : 0,
                            );

                            return (
                                <div key={label}>
                                    <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                                        <span className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                                            <span
                                                className={`size-2 rounded-full ${roleStyles[label]}`}
                                            />
                                            {label}
                                        </span>
                                        <strong className="font-semibold text-slate-800 dark:text-slate-100">
                                            {value.toLocaleString()}
                                            <span className="ml-1.5 text-[10px] font-medium text-slate-400">
                                                {percentage}%
                                            </span>
                                        </strong>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/8">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${roleStyles[label]}`}
                                            style={{
                                                width: `${relativeWidth}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </article>
            </section>

            <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
                <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/8 dark:bg-white/[0.035]">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold tracking-tight">
                                Quick actions
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Common commerce tasks
                            </p>
                        </div>
                        <PackageCheck className="size-5 text-orange-500" />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <Link
                            href={admin.vendors.index.url()}
                            className="group rounded-xl border border-slate-200 p-4 transition hover:border-orange-200 hover:bg-orange-50/60 dark:border-white/8 dark:hover:border-orange-500/20 dark:hover:bg-orange-500/5"
                        >
                            <Store className="size-5 text-orange-500" />
                            <p className="mt-3 text-sm font-semibold">
                                Review vendors
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                                Applications
                                <ChevronRight className="size-3 transition group-hover:translate-x-0.5" />
                            </p>
                        </Link>
                        <Link
                            href={admin.categories.create.url()}
                            className="group rounded-xl border border-slate-200 p-4 transition hover:border-violet-200 hover:bg-violet-50/60 dark:border-white/8 dark:hover:border-violet-500/20 dark:hover:bg-violet-500/5"
                        >
                            <Boxes className="size-5 text-violet-500" />
                            <p className="mt-3 text-sm font-semibold">
                                Add category
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                                Organize catalog
                                <Plus className="size-3" />
                            </p>
                        </Link>
                        <Link
                            href={admin.brands.create.url()}
                            className="group rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50/60 dark:border-white/8 dark:hover:border-sky-500/20 dark:hover:bg-sky-500/5"
                        >
                            <Tags className="size-5 text-sky-500" />
                            <p className="mt-3 text-sm font-semibold">
                                Add brand
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                                Grow assortment
                                <Plus className="size-3" />
                            </p>
                        </Link>
                    </div>
                </article>

                <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/8 dark:bg-white/[0.035]">
                    <h3 className="font-semibold tracking-tight">
                        Operational pulse
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Current marketplace readiness
                    </p>
                    <div className="mt-5 grid gap-3">
                        {[
                            ['Account services', 'Operational'],
                            ['Vendor onboarding', 'Ready'],
                            ['Catalogue services', 'Operational'],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-white/[0.035]"
                            >
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                    {label}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <span className="grid size-4 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
                                        <Check className="size-2.5" />
                                    </span>
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </article>
            </section>
        </AdminLayout>
    );
}
