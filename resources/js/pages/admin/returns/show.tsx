import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Banknote,
    Box,
    Check,
    CircleDot,
    PackageCheck,
    Truck,
    UserRound,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import ordersRoutes from '@/routes/admin/orders';
import returnsRoutes from '@/routes/admin/returns';
import type { ReturnCase, ReturnStatus } from '@/types/admin';

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});

const control =
    'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#101722]';

const transitions: Record<ReturnStatus, ReturnStatus[]> = {
    requested: ['requested', 'approved', 'rejected'],
    approved: ['approved', 'pickup_scheduled', 'rejected'],
    pickup_scheduled: ['pickup_scheduled', 'in_transit'],
    in_transit: ['in_transit', 'received'],
    received: ['received', 'refunded'],
    refunded: ['refunded'],
    rejected: ['rejected'],
};

type Props = { returnCase: ReturnCase; statuses: ReturnStatus[] };

export default function ReturnShow({ returnCase, statuses }: Props) {
    const form = useForm({
        status: returnCase.status,
        refund_amount: returnCase.refund_amount,
        resolution: returnCase.resolution ?? '',
        reverse_carrier: returnCase.reverse_carrier ?? '',
        tracking_number: returnCase.tracking_number ?? '',
    });
    const availableStatuses = statuses.filter((status) =>
        transitions[returnCase.status].includes(status),
    );
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(returnsRoutes.update.url(returnCase.id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout
            title={`Return ${returnCase.number}`}
            breadcrumb="Returns / Case workspace"
        >
            <Link
                href={returnsRoutes.index.url()}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-600"
            >
                <ArrowLeft className="size-4" />
                Back to returns
            </Link>

            <header className="mt-5 overflow-hidden rounded-2xl bg-slate-950 p-6 text-white dark:bg-white/10">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-orange-500 px-2 py-1 text-[10px] font-black tracking-wide uppercase">
                                {returnCase.type === 'rto'
                                    ? 'Return to origin'
                                    : 'Customer return'}
                            </span>
                            <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                                {label(returnCase.status)}
                            </span>
                        </div>
                        <h2 className="mt-3 text-2xl font-black">
                            {returnCase.number}
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Opened{' '}
                            {new Date(returnCase.requested_at).toLocaleString()}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 md:text-right">
                        <div>
                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                Order
                            </p>
                            <Link
                                href={ordersRoutes.show.url(
                                    returnCase.order.id,
                                )}
                                className="mt-1 block font-black text-orange-400"
                            >
                                {returnCase.order.number}
                            </Link>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                Refund
                            </p>
                            <p className="mt-1 font-black">
                                {money.format(Number(returnCase.refund_amount))}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
                <div className="grid content-start gap-6">
                    <Section title="Case assessment" icon={<PackageCheck />}>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Info
                                label="Reason"
                                value={label(returnCase.reason_code)}
                            />
                            <Info
                                label="Resolution"
                                value={returnCase.resolution || 'Not assigned'}
                            />
                            <Info
                                label="Requested quantity"
                                value={String(returnCase.requested_quantity)}
                            />
                            <Info
                                label="Processed by"
                                value={
                                    returnCase.processor?.name ?? 'Unassigned'
                                }
                            />
                        </div>
                        {returnCase.reason_details && (
                            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm whitespace-pre-line text-slate-600 dark:bg-white/5 dark:text-slate-300">
                                {returnCase.reason_details}
                            </div>
                        )}
                    </Section>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Section title="Customer" icon={<UserRound />}>
                            <Info
                                label="Name"
                                value={returnCase.customer.name}
                            />
                            <Info
                                label="Email"
                                value={returnCase.customer.email}
                            />
                        </Section>
                        <Section title="Affected inventory" icon={<Box />}>
                            <Info
                                label="Item"
                                value={
                                    returnCase.order_item?.product_name ??
                                    'Entire order'
                                }
                            />
                            <Info
                                label="SKU"
                                value={returnCase.order_item?.sku ?? 'Multiple'}
                            />
                        </Section>
                    </div>

                    <Section title="Reverse journey" icon={<Truck />}>
                        <Timeline returnCase={returnCase} />
                    </Section>

                    <Section title="Payment exposure" icon={<Banknote />}>
                        <div className="grid gap-5 sm:grid-cols-3">
                            <Info
                                label="Captured"
                                value={money.format(
                                    Number(
                                        returnCase.order.payment?.amount ??
                                            returnCase.order.total,
                                    ),
                                )}
                            />
                            <Info
                                label="Previously refunded"
                                value={money.format(
                                    Number(
                                        returnCase.order.payment
                                            ?.refunded_amount ?? 0,
                                    ),
                                )}
                            />
                            <Info
                                label="Payment status"
                                value={label(
                                    returnCase.order.payment?.status ??
                                        returnCase.order.payment_status,
                                )}
                            />
                        </div>
                    </Section>
                </div>

                <aside className="h-fit xl:sticky xl:top-24">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                                <CircleDot className="size-5" />
                            </span>
                            <div>
                                <h2 className="font-black">Case control</h2>
                                <p className="text-xs text-slate-500">
                                    Advance the verified workflow.
                                </p>
                            </div>
                        </div>
                        <form onSubmit={submit} className="mt-5 grid gap-4">
                            <Field
                                label="Next status"
                                error={form.errors.status}
                            >
                                <select
                                    value={form.data.status}
                                    onChange={(event) =>
                                        form.setData(
                                            'status',
                                            event.target.value as ReturnStatus,
                                        )
                                    }
                                    className={control}
                                >
                                    {availableStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {label(status)}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field
                                label="Approved refund"
                                error={form.errors.refund_amount}
                            >
                                <input
                                    type="number"
                                    min="0"
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
                                label="Resolution"
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
                                    placeholder="Refund, replacement..."
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="Reverse carrier"
                                error={form.errors.reverse_carrier}
                            >
                                <input
                                    value={form.data.reverse_carrier}
                                    onChange={(event) =>
                                        form.setData(
                                            'reverse_carrier',
                                            event.target.value,
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="Tracking number"
                                error={form.errors.tracking_number}
                            >
                                <input
                                    value={form.data.tracking_number}
                                    onChange={(event) =>
                                        form.setData(
                                            'tracking_number',
                                            event.target.value,
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                            <button
                                disabled={form.processing}
                                className="mt-1 h-11 rounded-xl bg-orange-500 px-5 text-sm font-bold text-white disabled:opacity-60"
                            >
                                {form.processing
                                    ? 'Updating case...'
                                    : 'Update workflow'}
                            </button>
                        </form>
                    </section>
                </aside>
            </div>
        </AdminLayout>
    );
}

function Timeline({ returnCase }: { returnCase: ReturnCase }) {
    const events = [
        { label: 'Requested', date: returnCase.requested_at },
        { label: 'Approved', date: returnCase.approved_at },
        { label: 'Warehouse received', date: returnCase.received_at },
        {
            label: returnCase.status === 'rejected' ? 'Rejected' : 'Completed',
            date: returnCase.completed_at,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-4">
            {events.map((event) => (
                <div key={event.label} className="flex gap-3 sm:block">
                    <span
                        className={`grid size-8 shrink-0 place-items-center rounded-full ${event.date ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-white/10'}`}
                    >
                        {event.date ? (
                            <Check className="size-4" />
                        ) : (
                            <CircleDot className="size-4" />
                        )}
                    </span>
                    <div className="sm:mt-3">
                        <p className="text-sm font-bold">{event.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                            {event.date
                                ? new Date(event.date).toLocaleString()
                                : 'Pending'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Section({
    title,
    icon,
    children,
}: {
    title: string;
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300 [&>svg]:size-4">
                    {icon}
                </span>
                <h2 className="font-black">{title}</h2>
            </div>
            {children}
        </section>
    );
}

function Info({ label: title, value }: { label: string; value: string }) {
    return (
        <div className="mb-4 last:mb-0">
            <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                {title}
            </p>
            <p className="mt-1 text-sm font-bold">{value}</p>
        </div>
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

function label(value: string) {
    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}
