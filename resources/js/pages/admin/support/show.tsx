import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import orders from '@/routes/admin/orders';
import routes from '@/routes/admin/support';
import type { SupportTicket } from '@/types/admin';
export default function Show({
    ticket,
    agents,
    statuses,
    priorities,
}: {
    ticket: SupportTicket;
    agents: { id: number; name: string }[];
    statuses: string[];
    priorities: string[];
}) {
    const workflow = useForm({
        assigned_to: ticket.assignee?.id.toString() ?? '',
        status: ticket.status,
        priority: ticket.priority,
    });
    const message = useForm({ body: '', is_internal: false });
    const update = (e: FormEvent) => {
        e.preventDefault();
        workflow.put(routes.update.url(ticket.id), { preserveScroll: true });
    };
    const reply = (e: FormEvent) => {
        e.preventDefault();
        message.post(routes.messages.store.url(ticket.id), {
            preserveScroll: true,
            onSuccess: () => message.reset('body'),
        });
    };

    return (
        <AdminLayout title={ticket.number} breadcrumb="Support / Case console">
            <Link
                href={routes.index.url()}
                className="text-sm font-bold text-slate-500"
            >
                ← Back to queue
            </Link>
            <header className="mt-5 rounded-2xl bg-slate-950 p-6 text-white dark:bg-white/10">
                <div className="flex justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-orange-400 uppercase">
                            {ticket.priority} priority ·{' '}
                            {ticket.category.replaceAll('_', ' ')}
                        </p>
                        <h2 className="mt-2 text-2xl font-black">
                            {ticket.subject}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            {ticket.customer.name} · {ticket.customer.email}
                        </p>
                    </div>
                    {ticket.order && (
                        <Link
                            href={orders.show.url(ticket.order.id)}
                            className="h-fit rounded-xl bg-white/10 px-4 py-2 text-sm font-bold"
                        >
                            {ticket.order.number}
                        </Link>
                    )}
                </div>
            </header>
            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_22rem]">
                <div className="grid gap-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                        <h2 className="font-black">Conversation</h2>
                        <div className="mt-5 grid gap-4">
                            {ticket.messages?.map((m) => (
                                <div
                                    key={m.id}
                                    className={`rounded-2xl p-4 ${m.is_internal ? 'border border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10' : 'bg-slate-50 dark:bg-white/5'}`}
                                >
                                    <div className="flex justify-between text-xs">
                                        <span className="font-black">
                                            {m.user.name}
                                            {m.is_internal
                                                ? ' · Internal note'
                                                : ''}
                                        </span>
                                        <span className="text-slate-400">
                                            {new Date(
                                                m.created_at,
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm whitespace-pre-line text-slate-700 dark:text-slate-300">
                                        {m.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <form
                        onSubmit={reply}
                        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5"
                    >
                        <textarea
                            rows={5}
                            value={message.data.body}
                            onChange={(e) =>
                                message.setData('body', e.target.value)
                            }
                            placeholder={
                                message.data.is_internal
                                    ? 'Add an internal investigation note'
                                    : 'Reply to the customer'
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-white/10 dark:bg-white/5"
                        />
                        <div className="mt-3 flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm font-bold">
                                <input
                                    type="checkbox"
                                    checked={message.data.is_internal}
                                    onChange={(e) =>
                                        message.setData(
                                            'is_internal',
                                            e.target.checked,
                                        )
                                    }
                                    className="accent-orange-500"
                                />{' '}
                                Internal note
                            </label>
                            <button className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white">
                                Add message
                            </button>
                        </div>
                    </form>
                </div>
                <form
                    onSubmit={update}
                    className="h-fit rounded-2xl border border-slate-200 bg-white p-6 xl:sticky xl:top-24 dark:border-white/10 dark:bg-white/5"
                >
                    <h2 className="font-black">Case workflow</h2>
                    <Select
                        label="Assignee"
                        value={workflow.data.assigned_to}
                        set={(v) => workflow.setData('assigned_to', v)}
                        values={agents.map((a) => [String(a.id), a.name])}
                    />
                    <Select
                        label="Status"
                        value={workflow.data.status}
                        set={(v) => workflow.setData('status', v)}
                        values={statuses.map((v) => [
                            v,
                            v.replaceAll('_', ' '),
                        ])}
                    />
                    <Select
                        label="Priority"
                        value={workflow.data.priority}
                        set={(v) => workflow.setData('priority', v)}
                        values={priorities.map((v) => [v, v])}
                    />
                    <div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs dark:bg-white/5">
                        <p>
                            First response due:{' '}
                            {ticket.first_response_due_at
                                ? new Date(
                                      ticket.first_response_due_at,
                                  ).toLocaleString()
                                : '—'}
                        </p>
                        <p className="mt-2">
                            Resolution due:{' '}
                            {ticket.resolution_due_at
                                ? new Date(
                                      ticket.resolution_due_at,
                                  ).toLocaleString()
                                : '—'}
                        </p>
                    </div>
                    <button className="mt-5 h-11 w-full rounded-xl bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Update case
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
function Select({
    label,
    value,
    set,
    values,
}: {
    label: string;
    value: string;
    set: (v: string) => void;
    values: string[][];
}) {
    return (
        <label className="mt-4 block text-xs font-bold">
            {label}
            <select
                value={value}
                onChange={(e) => set(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 capitalize dark:border-white/10 dark:bg-[#101722]"
            >
                <option value="">Unassigned</option>
                {values.map(([v, l]) => (
                    <option key={v} value={v}>
                        {l}
                    </option>
                ))}
            </select>
        </label>
    );
}
