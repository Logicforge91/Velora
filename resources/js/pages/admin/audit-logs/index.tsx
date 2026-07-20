import { Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Search,
    ShieldCheck,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/audit-logs';
import type { AdminAuditLog, Counts, Paginated } from '@/types/admin';

type Actor = { id: number; name: string; email: string };

export default function AuditLogsIndex({
    logs,
    counts,
    categories,
    actors,
}: {
    logs: Paginated<AdminAuditLog>;
    counts: Counts;
    categories: string[];
    actors: Actor[];
}) {
    const query = new URLSearchParams(location.search);
    const [filters, setFilters] = useState({
        search: query.get('search') ?? '',
        category: query.get('category') ?? '',
        severity: query.get('severity') ?? '',
        actor_id: query.get('actor_id') ?? '',
        date_from: query.get('date_from') ?? '',
        date_to: query.get('date_to') ?? '',
    });
    const update = (key: keyof typeof filters, value: string) =>
        setFilters((current) => ({ ...current, [key]: value }));
    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(routes.index.url(), filters, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AdminLayout
            title="Audit Logs"
            breadcrumb="Security / Administrative activity"
        >
            <div>
                <h2 className="text-2xl font-black">Platform audit trail</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Tamper-evident history for sensitive administrative
                    operations.
                </p>
            </div>
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Recorded events',
                            value: counts.total,
                            icon: ShieldCheck,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Events today',
                            value: counts.today,
                            icon: CheckCircle2,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                        {
                            label: 'Warnings',
                            value: counts.warnings,
                            icon: AlertTriangle,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'Failed attempts',
                            value: counts.failed,
                            icon: XCircle,
                            tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
                        },
                    ]}
                />
            </div>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-slate-200 p-4 lg:grid-cols-4 dark:border-white/10"
                >
                    <label className="relative lg:col-span-2">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            type="search"
                            value={filters.search}
                            onChange={(event) =>
                                update('search', event.target.value)
                            }
                            placeholder="Event, actor, IP or UUID"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 text-sm dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <Select
                        value={filters.category}
                        onChange={(value) => update('category', value)}
                        label="All categories"
                        options={categories}
                    />
                    <Select
                        value={filters.severity}
                        onChange={(value) => update('severity', value)}
                        label="All severities"
                        options={['info', 'notice', 'warning', 'critical']}
                    />
                    <select
                        value={filters.actor_id}
                        onChange={(event) =>
                            update('actor_id', event.target.value)
                        }
                        className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All administrators</option>
                        {actors.map((actor) => (
                            <option key={actor.id} value={actor.id}>
                                {actor.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={filters.date_from}
                        onChange={(event) =>
                            update('date_from', event.target.value)
                        }
                        className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-white/5"
                    />
                    <input
                        type="date"
                        value={filters.date_to}
                        onChange={(event) =>
                            update('date_to', event.target.value)
                        }
                        className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-white/5"
                    />
                    <button className="rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply filters
                    </button>
                </form>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {logs.data.map((log) => (
                        <Link
                            key={log.id}
                            href={routes.show.url(log.id)}
                            className="grid gap-3 p-5 transition hover:bg-slate-50 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-center dark:hover:bg-white/5"
                        >
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-black">
                                        {log.description}
                                    </p>
                                    <Severity value={log.severity} />
                                </div>
                                <p className="mt-1 font-mono text-[10px] text-slate-400">
                                    {log.event_uuid}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-bold">
                                    {log.actor?.name ?? 'System'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {log.ip_address ?? 'Unknown IP'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-bold uppercase">
                                    {log.method} · {log.response_status}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {log.duration_ms} ms
                                </p>
                            </div>
                            <time className="text-xs text-slate-500">
                                {new Date(log.occurred_at).toLocaleString()}
                            </time>
                        </Link>
                    ))}
                    {logs.data.length === 0 && (
                        <p className="p-14 text-center text-sm text-slate-500">
                            No audit events match these filters.
                        </p>
                    )}
                </div>
                <Pagination links={logs.links} />
            </section>
        </AdminLayout>
    );
}

function Select({
    value,
    onChange,
    label,
    options,
}: {
    value: string;
    onChange: (value: string) => void;
    label: string;
    options: string[];
}) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm capitalize dark:border-white/10 dark:bg-[#101722]"
        >
            <option value="">{label}</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option.replaceAll('_', ' ')}
                </option>
            ))}
        </select>
    );
}
function Severity({ value }: { value: string }) {
    const tone =
        value === 'critical'
            ? 'bg-rose-100 text-rose-700'
            : value === 'warning'
              ? 'bg-amber-100 text-amber-700'
              : value === 'notice'
                ? 'bg-sky-100 text-sky-700'
                : 'bg-slate-100 text-slate-600';

    return (
        <span
            className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${tone}`}
        >
            {value}
        </span>
    );
}
