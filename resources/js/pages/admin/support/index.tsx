import { Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Plus,
    Search,
    UserX,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/support';
import type { Counts, Paginated, SupportTicket } from '@/types/admin';
export default function Index({
    tickets,
    counts,
    statuses,
    priorities,
}: {
    tickets: Paginated<SupportTicket>;
    counts: Counts;
    statuses: string[];
    priorities: string[];
}) {
    const q = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(q.get('search') ?? '');
    const [status, setStatus] = useState(q.get('status') ?? '');
    const [priority, setPriority] = useState(q.get('priority') ?? '');
    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            routes.index.url(),
            { search, status, priority },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Support" breadcrumb="Operations / Support">
            <div className="flex justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black">
                        Support command center
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        SLA queues, customer conversations and case resolution.
                    </p>
                </div>
                <Link
                    href={routes.create.url()}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white"
                >
                    <Plus className="size-4" /> Open ticket
                </Link>
            </div>
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Active tickets',
                            value: counts.open,
                            icon: Clock3,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Unassigned',
                            value: counts.unassigned,
                            icon: UserX,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'SLA overdue',
                            value: counts.overdue,
                            icon: AlertTriangle,
                            tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
                        },
                        {
                            label: 'Resolved today',
                            value: counts.resolved_today,
                            icon: CheckCircle2,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                    ]}
                />
            </div>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[1fr_11rem_11rem_auto] dark:border-white/10"
                >
                    <label className="relative">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Ticket, subject or customer"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 text-sm dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <Select
                        value={status}
                        set={setStatus}
                        values={statuses}
                        empty="All statuses"
                    />
                    <Select
                        value={priority}
                        set={setPriority}
                        values={priorities}
                        empty="All priorities"
                    />
                    <button className="rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {tickets.data.map((ticket) => (
                        <Link
                            key={ticket.id}
                            href={routes.show.url(ticket.id)}
                            className="grid gap-3 p-5 hover:bg-slate-50 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center dark:hover:bg-white/5"
                        >
                            <div>
                                <p className="font-black">{ticket.number}</p>
                                <p className="truncate text-xs text-slate-500">
                                    {ticket.subject}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-bold">
                                    {ticket.customer.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {ticket.order?.number ??
                                        ticket.category.replaceAll('_', ' ')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-bold">
                                    {ticket.assignee?.name ?? 'Unassigned'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {ticket.messages_count ?? 0} messages
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Badge value={ticket.priority} />
                                <Badge value={ticket.status} />
                            </div>
                        </Link>
                    ))}
                    {tickets.data.length === 0 && (
                        <p className="p-14 text-center text-sm text-slate-500">
                            No support tickets found.
                        </p>
                    )}
                </div>
                <Pagination links={tickets.links} />
            </section>
        </AdminLayout>
    );
}
function Select({
    value,
    set,
    values,
    empty,
}: {
    value: string;
    set: (v: string) => void;
    values: string[];
    empty: string;
}) {
    return (
        <select
            value={value}
            onChange={(e) => set(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
        >
            <option value="">{empty}</option>
            {values.map((v) => (
                <option key={v}>{v}</option>
            ))}
        </select>
    );
}
function Badge({ value }: { value: string }) {
    return (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase dark:bg-white/10">
            {value.replaceAll('_', ' ')}
        </span>
    );
}
