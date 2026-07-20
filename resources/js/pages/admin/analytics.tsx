import { Form, Link } from '@inertiajs/react';
import {
    Banknote,
    BarChart3,
    Boxes,
    CalendarDays,
    Download,
    FileBarChart,
    PackageCheck,
    ReceiptIndianRupee,
    SearchX,
    SlidersHorizontal,
    WalletCards,
} from 'lucide-react';
import {
    AdminEmptyState,
    AdminPageHeader,
    AdminPanel,
    AdminStatusBadge,
} from '@/components/admin/primitives';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import admin from '@/routes/admin';

type ReportColumn = {
    key: string;
    label: string;
    format: 'text' | 'status' | 'number' | 'money' | 'date';
};

type Props = {
    catalog: { key: string; label: string; group: string }[];
    filters: {
        report: string;
        from: string;
        to: string;
        dimension: string;
    };
    report: {
        key: string;
        label: string;
        description: string;
        columns: ReportColumn[];
        rows: Record<string, string | number | null>[];
    };
    summary: {
        orders: number;
        revenue: number;
        average_order_value: number;
        units_in_stock: number;
        stock_alerts: number;
        refunds: number;
        commission: number;
    };
    dailyRevenue: { date: string; orders: number; revenue: number }[];
};

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat('en-IN');

export default function Analytics({
    catalog,
    filters,
    report,
    summary,
    dailyRevenue,
}: Props) {
    const maxRevenue = Math.max(...dailyRevenue.map((day) => day.revenue), 1);
    const groups = Object.entries(
        catalog.reduce<Record<string, Props['catalog']>>((result, item) => {
            (result[item.group] ??= []).push(item);

            return result;
        }, {}),
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
            value: number.format(summary.orders),
            note: `${money.format(summary.average_order_value)} average value`,
            icon: PackageCheck,
            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
        },
        {
            label: 'Refund exposure',
            value: money.format(summary.refunds),
            note: 'Requested in this period',
            icon: WalletCards,
            tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
        },
        {
            label: 'Commission',
            value: money.format(summary.commission),
            note: 'Marketplace commission booked',
            icon: ReceiptIndianRupee,
            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
        },
    ];

    return (
        <AdminLayout
            title="Analytics"
            breadcrumb={`Analytics / ${report.label}`}
        >
            <AdminPageHeader
                title="Reports and analytics"
                description="Explore commercial, operational, seller, finance, and growth performance from one reporting workspace."
                action={
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-orange-500 dark:hover:bg-orange-400"
                    >
                        <Download className="size-4" />
                        Export view
                    </button>
                }
            />

            <div className="mt-6 grid items-start gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
                <AdminPanel className="xl:sticky xl:top-6">
                    <div className="border-b border-slate-200/75 p-4 dark:border-white/10">
                        <div className="flex items-center gap-2 text-sm font-black">
                            <FileBarChart className="size-4 text-orange-500" />
                            Report library
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            {catalog.length} ready-to-use reports
                        </p>
                    </div>
                    <nav className="max-h-[calc(100vh-13rem)] overflow-y-auto p-2">
                        {groups.map(([group, reports]) => (
                            <div key={group} className="py-2">
                                <p className="px-2 pb-1 text-[10px] font-black tracking-[0.16em] text-slate-400 uppercase">
                                    {group}
                                </p>
                                <div className="grid gap-0.5">
                                    {reports.map((item) => (
                                        <Link
                                            key={item.key}
                                            href={admin.analytics.url({
                                                query: {
                                                    report: item.key,
                                                    from: filters.from,
                                                    to: filters.to,
                                                    dimension:
                                                        filters.dimension,
                                                },
                                            })}
                                            preserveScroll
                                            className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition ${item.key === report.key ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'}`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </AdminPanel>

                <div className="min-w-0">
                    <AdminPanel>
                        <Form
                            {...admin.analytics.form()}
                            options={{ preserveScroll: true }}
                            className="grid gap-3 p-4 lg:grid-cols-[minmax(12rem,1fr)_minmax(10rem,0.65fr)_minmax(10rem,0.65fr)_auto] lg:items-end"
                        >
                            <label className="grid gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                                <span className="flex items-center gap-1.5">
                                    <BarChart3 className="size-3.5" /> Report
                                </span>
                                <select
                                    name="report"
                                    defaultValue={report.key}
                                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
                                >
                                    {catalog.map((item) => (
                                        <option key={item.key} value={item.key}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <DateField
                                label="From"
                                name="from"
                                value={filters.from}
                            />
                            <DateField
                                label="To"
                                name="to"
                                value={filters.to}
                            />
                            <button
                                type="submit"
                                className="h-10 rounded-xl bg-orange-500 px-5 text-sm font-black text-white transition hover:bg-orange-600"
                            >
                                Apply filters
                            </button>
                            {report.key === 'custom' && (
                                <label className="grid gap-1.5 text-xs font-bold text-slate-600 lg:col-span-2 dark:text-slate-300">
                                    <span className="flex items-center gap-1.5">
                                        <SlidersHorizontal className="size-3.5" />
                                        Group orders by
                                    </span>
                                    <select
                                        name="dimension"
                                        defaultValue={filters.dimension}
                                        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
                                    >
                                        <option value="status">
                                            Order status
                                        </option>
                                        <option value="channel">
                                            Sales channel
                                        </option>
                                        <option value="payment_method">
                                            Payment method
                                        </option>
                                    </select>
                                </label>
                            )}
                        </Form>
                    </AdminPanel>

                    <div className="mt-6">
                        <StatCards cards={cards} />
                    </div>

                    <AdminPanel className="mt-6 p-5 sm:p-6">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div>
                                <h3 className="text-lg font-black">
                                    {report.label}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {report.description}
                                </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                                {formatDate(filters.from)} –{' '}
                                {formatDate(filters.to)}
                            </span>
                        </div>

                        <div className="mt-7 flex h-44 items-end gap-1.5 overflow-x-auto border-b border-slate-200 px-1 dark:border-white/10">
                            {dailyRevenue.length > 0 ? (
                                dailyRevenue.map((day) => (
                                    <div
                                        key={day.date}
                                        className="group flex h-full min-w-3 flex-1 flex-col justify-end"
                                        title={`${formatDate(day.date)}: ${money.format(day.revenue)}`}
                                    >
                                        <div
                                            className="min-h-1 rounded-t bg-gradient-to-t from-orange-500 to-amber-300 transition group-hover:from-orange-600"
                                            style={{
                                                height: `${Math.max((day.revenue / maxRevenue) * 100, 3)}%`,
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="grid h-full w-full place-items-center text-sm text-slate-500">
                                    Revenue trend will appear after order
                                    activity.
                                </div>
                            )}
                        </div>
                    </AdminPanel>

                    <AdminPanel className="mt-6">
                        {report.rows.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-black tracking-wide text-slate-500 uppercase dark:border-white/10 dark:bg-white/[0.025]">
                                        <tr>
                                            {report.columns.map((column) => (
                                                <th
                                                    key={column.key}
                                                    className="px-5 py-3.5 first:pl-6 last:pr-6"
                                                >
                                                    {column.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {report.rows.map((row, index) => (
                                            <tr
                                                key={`${String(row.label ?? 'row')}-${index}`}
                                                className="transition hover:bg-orange-50/35 dark:hover:bg-orange-500/[0.035]"
                                            >
                                                {report.columns.map(
                                                    (column) => (
                                                        <td
                                                            key={column.key}
                                                            className="px-5 py-3.5 first:pl-6 first:font-bold last:pr-6"
                                                        >
                                                            <Value
                                                                value={
                                                                    row[
                                                                        column
                                                                            .key
                                                                    ]
                                                                }
                                                                format={
                                                                    column.format
                                                                }
                                                            />
                                                        </td>
                                                    ),
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <AdminEmptyState
                                icon={SearchX}
                                title="No report data in this period"
                                description="Try a wider date range or choose another report."
                            />
                        )}
                    </AdminPanel>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <MiniSignal
                            icon={Boxes}
                            label="Units in stock"
                            value={number.format(summary.units_in_stock)}
                            note={`${number.format(summary.stock_alerts)} products at or below their reorder level`}
                        />
                        <MiniSignal
                            icon={CalendarDays}
                            label="Reporting window"
                            value={`${dailyRevenue.length} active days`}
                            note="Only recorded transactions are included"
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function DateField({
    label,
    name,
    value,
}: {
    label: string;
    name: string;
    value: string;
}) {
    return (
        <label className="grid gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>{label}</span>
            <input
                type="date"
                name={name}
                defaultValue={value}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
            />
        </label>
    );
}

function Value({
    value,
    format,
}: {
    value: string | number | null;
    format: ReportColumn['format'];
}) {
    if (value === null || value === '') {
        return <span className="text-slate-400">—</span>;
    }

    if (format === 'status') {
        return <AdminStatusBadge value={String(value)} />;
    }

    if (format === 'money') {
        return <>{money.format(Number(value))}</>;
    }

    if (format === 'number') {
        return <>{number.format(Number(value))}</>;
    }

    if (format === 'date') {
        return <>{formatDate(String(value))}</>;
    }

    return <>{String(value)}</>;
}

function MiniSignal({
    icon: Icon,
    label,
    value,
    note,
}: {
    icon: typeof Boxes;
    label: string;
    value: string;
    note: string;
}) {
    return (
        <AdminPanel className="flex items-start gap-3 p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                <Icon className="size-4" />
            </span>
            <div>
                <p className="text-xs font-semibold text-slate-500">{label}</p>
                <p className="mt-0.5 font-black">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{note}</p>
            </div>
        </AdminPanel>
    );
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${value}T00:00:00Z`));
}
