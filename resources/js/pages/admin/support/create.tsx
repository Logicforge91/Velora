import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/support';
const c =
    'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-white/5';
export default function Create({
    customers,
    orders,
    agents,
}: {
    customers: { id: number; name: string; email: string }[];
    orders: { id: number; user_id: number; number: string }[];
    agents: { id: number; name: string }[];
}) {
    const f = useForm({
        customer_id: '',
        order_id: '',
        assigned_to: '',
        subject: '',
        category: 'order',
        channel: 'admin',
        priority: 'medium',
        description: '',
    });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        f.post(routes.store.url());
    };
    const visible = orders.filter(
        (o) => o.user_id === Number(f.data.customer_id),
    );

    return (
        <AdminLayout
            title="Open Support Ticket"
            breadcrumb="Support / New ticket"
        >
            <form
                onSubmit={submit}
                className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5"
            >
                <h2 className="text-xl font-black">Customer case intake</h2>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <Field label="Customer" error={f.errors.customer_id}>
                        <select
                            value={f.data.customer_id}
                            onChange={(e) => {
                                f.setData('customer_id', e.target.value);
                                f.setData('order_id', '');
                            }}
                            className={c}
                        >
                            <option value="">Select customer</option>
                            {customers.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.name} · {v.email}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Related order" error={f.errors.order_id}>
                        <select
                            value={f.data.order_id}
                            onChange={(e) =>
                                f.setData('order_id', e.target.value)
                            }
                            className={c}
                        >
                            <option value="">No order</option>
                            {visible.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.number}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Subject" error={f.errors.subject}>
                        <input
                            value={f.data.subject}
                            onChange={(e) =>
                                f.setData('subject', e.target.value)
                            }
                            className={c}
                        />
                    </Field>
                    <Field label="Assign agent" error={f.errors.assigned_to}>
                        <select
                            value={f.data.assigned_to}
                            onChange={(e) =>
                                f.setData('assigned_to', e.target.value)
                            }
                            className={c}
                        >
                            <option value="">Unassigned</option>
                            {agents.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    {(['category', 'channel', 'priority'] as const).map(
                        (key) => (
                            <Field key={key} label={key} error={f.errors[key]}>
                                <select
                                    value={f.data[key]}
                                    onChange={(e) =>
                                        f.setData(key, e.target.value)
                                    }
                                    className={c}
                                >
                                    {(key === 'category'
                                        ? [
                                              'order',
                                              'delivery',
                                              'payment',
                                              'return_refund',
                                              'account',
                                              'product',
                                              'seller',
                                              'other',
                                          ]
                                        : key === 'channel'
                                          ? [
                                                'admin',
                                                'email',
                                                'phone',
                                                'chat',
                                                'social',
                                            ]
                                          : ['low', 'medium', 'high', 'urgent']
                                    ).map((v) => (
                                        <option key={v}>
                                            {v.replaceAll('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        ),
                    )}
                    <Field
                        label="Issue description"
                        error={f.errors.description}
                    >
                        <textarea
                            rows={6}
                            value={f.data.description}
                            onChange={(e) =>
                                f.setData('description', e.target.value)
                            }
                            className={`${c} h-auto py-3`}
                        />
                    </Field>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Link
                        href={routes.index.url()}
                        className="rounded-xl border px-5 py-3 text-sm font-bold"
                    >
                        Cancel
                    </Link>
                    <button className="rounded-xl bg-orange-500 px-6 text-sm font-bold text-white">
                        Open ticket
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="text-xs font-bold capitalize">
            {label}
            {children}
            {error && <span className="block text-rose-600">{error}</span>}
        </label>
    );
}
