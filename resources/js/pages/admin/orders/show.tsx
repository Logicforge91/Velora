import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CreditCard,
    MapPin,
    PackageCheck,
    UserRound,
} from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import ordersRoutes from '@/routes/admin/orders';
import type { Order } from '@/types/admin';

type Props = { order: Order; statuses: string[] };
const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});

export default function OrderShow({ order, statuses }: Props) {
    const form = useForm({
        status: order.status,
        payment_status: order.payment_status,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(ordersRoutes.update.url(order.id), { preserveScroll: true });
    };
    const address = order.shipping_address ?? {};

    return (
        <AdminLayout
            title={`Order ${order.number}`}
            breadcrumb="Orders / Order detail"
        >
            <Link
                href={ordersRoutes.index.url()}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600"
            >
                <ArrowLeft className="size-4" />
                Back to orders
            </Link>
            <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl bg-slate-950 p-6 text-white sm:flex-row sm:items-center dark:bg-white/10">
                <div>
                    <p className="text-xs tracking-widest text-slate-400 uppercase">
                        Order reference
                    </p>
                    <h2 className="mt-2 text-2xl font-black">{order.number}</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        Placed {new Date(order.placed_at).toLocaleString()}
                    </p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-xs tracking-widest text-slate-400 uppercase">
                        Order total
                    </p>
                    <p className="mt-2 text-2xl font-black text-orange-400">
                        {money.format(Number(order.total))}
                    </p>
                </div>
            </div>
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="grid gap-6">
                    <Section title="Items in this order" icon={PackageCheck}>
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {order.items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                                >
                                    <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 dark:bg-white/10">
                                        {item.product?.primary_image ? (
                                            <img
                                                src={
                                                    item.product.primary_image
                                                        .url
                                                }
                                                alt={item.product_name}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <PackageCheck className="size-5 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-bold">
                                            {item.product_name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            SKU {item.sku} · Qty {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">
                                            {money.format(Number(item.total))}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {money.format(
                                                Number(item.unit_price),
                                            )}{' '}
                                            each
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Section title="Customer" icon={UserRound}>
                            <Info label="Name" value={order.user.name} />
                            <Info label="Email" value={order.user.email} />
                        </Section>
                        <Section title="Delivery address" icon={MapPin}>
                            <address className="grid gap-1 text-sm text-slate-600 not-italic dark:text-slate-300">
                                {Object.values(address)
                                    .filter(Boolean)
                                    .map((line, index) => (
                                        <span key={index}>{line}</span>
                                    ))}
                            </address>
                        </Section>
                    </div>
                    {order.customer_note && (
                        <Section title="Customer note" icon={UserRound}>
                            <p className="text-sm whitespace-pre-line text-slate-600 dark:text-slate-300">
                                {order.customer_note}
                            </p>
                        </Section>
                    )}
                </div>
                <aside className="grid content-start gap-6">
                    <Section title="Order workflow" icon={PackageCheck}>
                        <form onSubmit={submit} className="grid gap-4">
                            <Field
                                label="Fulfilment status"
                                error={form.errors.status}
                            >
                                <select
                                    value={form.data.status}
                                    onChange={(event) =>
                                        form.setData(
                                            'status',
                                            event.target
                                                .value as Order['status'],
                                        )
                                    }
                                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status[0].toUpperCase() +
                                                status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field
                                label="Payment status"
                                error={form.errors.payment_status}
                            >
                                <select
                                    value={form.data.payment_status}
                                    onChange={(event) =>
                                        form.setData(
                                            'payment_status',
                                            event.target
                                                .value as Order['payment_status'],
                                        )
                                    }
                                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                                >
                                    {[
                                        'pending',
                                        'paid',
                                        'failed',
                                        'refunded',
                                    ].map((status) => (
                                        <option key={status} value={status}>
                                            {status[0].toUpperCase() +
                                                status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <button
                                disabled={form.processing}
                                className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                            >
                                {form.processing
                                    ? 'Updating...'
                                    : 'Update order'}
                            </button>
                        </form>
                    </Section>
                    <Section title="Payment summary" icon={CreditCard}>
                        <Info
                            label="Subtotal"
                            value={money.format(Number(order.subtotal))}
                        />
                        <Info
                            label="Shipping"
                            value={money.format(Number(order.shipping_total))}
                        />
                        <Info
                            label="Discount"
                            value={`-${money.format(Number(order.discount_total))}`}
                        />
                        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-black dark:border-white/10">
                            <span>Total</span>
                            <span>{money.format(Number(order.total))}</span>
                        </div>
                        <p className="mt-3 text-xs text-slate-500 capitalize">
                            Method: {order.payment_method.replaceAll('_', ' ')}
                        </p>
                    </Section>
                </aside>
            </div>
        </AdminLayout>
    );
}

function Section({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: typeof PackageCheck;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="mb-5 flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                    <Icon className="size-4" />
                </span>
                <h3 className="font-bold">{title}</h3>
            </div>
            {children}
        </section>
    );
}
function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 py-1.5 text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="text-right font-semibold">{value}</span>
        </div>
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
        <label className="block text-sm font-semibold">
            {label}
            {children}
            {error && (
                <span className="mt-1 block font-normal text-rose-600">
                    {error}
                </span>
            )}
        </label>
    );
}
