import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Box, PackageOpen, ShieldCheck } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import returnsRoutes from '@/routes/admin/returns';

type ReturnOrder = {
    id: number;
    number: string;
    total: string;
    placed_at: string;
    user: { id: number; name: string; email: string };
    items: Array<{
        id: number;
        product_name: string;
        sku: string;
        quantity: number;
        total: string;
    }>;
};

type Props = { orders: ReturnOrder[] };

const control =
    'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#101722]';

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});

export default function ReturnCreate({ orders }: Props) {
    const form = useForm({
        order_id: '',
        order_item_id: '',
        type: 'return',
        reason_code: 'damaged',
        reason_details: '',
        requested_quantity: '1',
        refund_amount: '0',
        resolution: '',
    });
    const order = orders.find(
        (candidate) => candidate.id === Number(form.data.order_id),
    );
    const item = order?.items.find(
        (candidate) => candidate.id === Number(form.data.order_item_id),
    );
    const maximumRefund = item
        ? (Number(item.total) / item.quantity) *
          Number(form.data.requested_quantity || 0)
        : Number(order?.total ?? 0);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(returnsRoutes.store.url());
    };

    return (
        <AdminLayout title="Open Return Case" breadcrumb="Returns / New case">
            <Link
                href={returnsRoutes.index.url()}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-600"
            >
                <ArrowLeft className="size-4" />
                Back to returns
            </Link>

            <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
                <form onSubmit={submit} className="grid gap-6">
                    <Section
                        title="Order and item"
                        description="Choose the original transaction and affected inventory."
                        icon={<Box className="size-5" />}
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Order" error={form.errors.order_id}>
                                <select
                                    value={form.data.order_id}
                                    onChange={(event) => {
                                        form.setData(
                                            'order_id',
                                            event.target.value,
                                        );
                                        form.setData('order_item_id', '');
                                    }}
                                    className={control}
                                >
                                    <option value="">Select an order</option>
                                    {orders.map((candidate) => (
                                        <option
                                            key={candidate.id}
                                            value={candidate.id}
                                        >
                                            {candidate.number} —{' '}
                                            {candidate.user.name} —{' '}
                                            {money.format(
                                                Number(candidate.total),
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field
                                label="Affected item"
                                error={form.errors.order_item_id}
                            >
                                <select
                                    value={form.data.order_item_id}
                                    onChange={(event) =>
                                        form.setData(
                                            'order_item_id',
                                            event.target.value,
                                        )
                                    }
                                    disabled={!order}
                                    className={control}
                                >
                                    <option value="">Entire order</option>
                                    {order?.items.map((candidate) => (
                                        <option
                                            key={candidate.id}
                                            value={candidate.id}
                                        >
                                            {candidate.product_name} ·{' '}
                                            {candidate.sku} · Qty{' '}
                                            {candidate.quantity}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        {order && (
                            <div className="mt-5 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-3 dark:border-white/10 dark:bg-white/5">
                                <Summary
                                    label="Customer"
                                    value={order.user.name}
                                />
                                <Summary
                                    label="Placed"
                                    value={new Date(
                                        order.placed_at,
                                    ).toLocaleDateString()}
                                />
                                <Summary
                                    label="Eligible value"
                                    value={money.format(maximumRefund)}
                                />
                            </div>
                        )}
                    </Section>

                    <Section
                        title="Return assessment"
                        description="Classify the case and record the requested resolution."
                        icon={<PackageOpen className="size-5" />}
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Case type" error={form.errors.type}>
                                <select
                                    value={form.data.type}
                                    onChange={(event) =>
                                        form.setData('type', event.target.value)
                                    }
                                    className={control}
                                >
                                    <option value="return">
                                        Customer return
                                    </option>
                                    <option value="rto">
                                        Return to origin (RTO)
                                    </option>
                                </select>
                            </Field>
                            <Field
                                label="Reason"
                                error={form.errors.reason_code}
                            >
                                <select
                                    value={form.data.reason_code}
                                    onChange={(event) =>
                                        form.setData(
                                            'reason_code',
                                            event.target.value,
                                        )
                                    }
                                    className={control}
                                >
                                    {[
                                        'damaged',
                                        'defective',
                                        'wrong_item',
                                        'not_as_described',
                                        'customer_refused',
                                        'undeliverable',
                                        'other',
                                    ].map((reason) => (
                                        <option key={reason} value={reason}>
                                            {label(reason)}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field
                                label="Quantity"
                                error={form.errors.requested_quantity}
                            >
                                <input
                                    type="number"
                                    min="1"
                                    max={item?.quantity}
                                    value={form.data.requested_quantity}
                                    onChange={(event) =>
                                        form.setData(
                                            'requested_quantity',
                                            event.target.value,
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="Proposed refund"
                                error={form.errors.refund_amount}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    max={maximumRefund || undefined}
                                    step="0.01"
                                    value={form.data.refund_amount}
                                    onChange={(event) =>
                                        form.setData(
                                            'refund_amount',
                                            event.target.value,
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="Proposed resolution"
                                error={form.errors.resolution}
                            >
                                <input
                                    value={form.data.resolution}
                                    onChange={(event) =>
                                        form.setData(
                                            'resolution',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Refund, replacement, store credit..."
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="Assessment notes"
                                error={form.errors.reason_details}
                            >
                                <textarea
                                    value={form.data.reason_details}
                                    onChange={(event) =>
                                        form.setData(
                                            'reason_details',
                                            event.target.value,
                                        )
                                    }
                                    rows={4}
                                    placeholder="Record condition, evidence and customer context."
                                    className={`${control} h-auto py-3`}
                                />
                            </Field>
                        </div>
                    </Section>

                    <div className="flex justify-end gap-3">
                        <Link
                            href={returnsRoutes.index.url()}
                            className="inline-flex h-11 items-center rounded-xl border border-slate-200 px-5 text-sm font-bold dark:border-white/10"
                        >
                            Cancel
                        </Link>
                        <button
                            disabled={form.processing}
                            className="h-11 rounded-xl bg-orange-500 px-6 text-sm font-bold text-white disabled:opacity-60"
                        >
                            {form.processing ? 'Opening case...' : 'Open case'}
                        </button>
                    </div>
                </form>

                <aside className="h-fit rounded-2xl bg-slate-950 p-6 text-white xl:sticky xl:top-24 dark:bg-white/10">
                    <ShieldCheck className="size-8 text-orange-400" />
                    <h3 className="mt-5 text-lg font-black">
                        Control checklist
                    </h3>
                    <ul className="mt-4 grid gap-3 text-sm text-slate-300">
                        <li>Confirm the item belongs to the original order.</li>
                        <li>
                            Keep the refund within the captured order value.
                        </li>
                        <li>Use RTO for refused or undeliverable shipments.</li>
                        <li>
                            Inventory is restored only after warehouse receipt.
                        </li>
                    </ul>
                </aside>
            </div>
        </AdminLayout>
    );
}

function Section({
    title,
    description,
    icon,
    children,
}: {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <div className="mb-5 flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                    {icon}
                </span>
                <div>
                    <h2 className="font-black">{title}</h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        {description}
                    </p>
                </div>
            </div>
            {children}
        </section>
    );
}

function Field({
    label: fieldLabel,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {fieldLabel}
            {children}
            {error && <span className="mt-1 block text-rose-600">{error}</span>}
        </label>
    );
}

function Summary({ label: title, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                {title}
            </p>
            <p className="mt-1 truncate font-bold">{value}</p>
        </div>
    );
}

function label(value: string) {
    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}
