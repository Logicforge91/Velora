import { Form, Head, Link, router } from '@inertiajs/react';
import { useConnectionStatus, useEcho } from '@laravel/echo-react';
import {
    ArrowLeft,
    Building2,
    Check,
    CircleAlert,
    Download,
    Headphones,
    Mail,
    MapPin,
    MessageCircle,
    PackageCheck,
    RefreshCw,
    Save,
    ShoppingBag,
    Truck,
    WalletCards,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { money } from '@/components/storefront/catalog';
import StorefrontLayout from '@/layouts/storefront-layout';
import {
    cancel,
    invoice,
    receipt,
    reorder,
    show,
} from '@/routes/customer/orders';
import { update as updateInstructions } from '@/routes/customer/orders/instructions';
import { store as reportIssue } from '@/routes/customer/orders/issues';
import { cancel as cancelItem } from '@/routes/customer/orders/items';
import { index as refundsIndex } from '@/routes/customer/refunds';
import { index as returnsIndex } from '@/routes/customer/returns';
import type { CustomerOrder, OrderItem } from './types';

export default function OrderDetails({ order }: { order: CustomerOrder }) {
    const [issueOpen, setIssueOpen] = useState(false);
    const [cancellationTarget, setCancellationTarget] = useState<
        number | 'order' | null
    >(null);
    const sellerGroups = useMemo(() => {
        const groups = new Map<string, OrderItem[]>();

        order.items.forEach((item) => {
            const seller = item.vendor?.business_name ?? 'Velora marketplace';
            groups.set(seller, [...(groups.get(seller) ?? []), item]);
        });

        return [...groups.entries()];
    }, [order.items]);
    const canCancel = ['pending', 'processing'].includes(order.status);

    return (
        <StorefrontLayout>
            <Head title={`Order ${order.number}`} />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <Link
                    href={show.url(order.id).replace(`/${order.id}`, '')}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600"
                >
                    <ArrowLeft className="size-4" /> Order history
                </Link>
                <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-black tracking-wider text-orange-600 uppercase">
                            {order.number}
                        </p>
                        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                            Order details
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Placed{' '}
                            {new Date(order.placed_at).toLocaleString('en-IN')}
                        </p>
                    </div>
                    <span className="w-fit rounded-full bg-orange-50 px-4 py-2 text-xs font-black text-orange-600 uppercase dark:bg-orange-500/10">
                        {order.status}
                    </span>
                </div>

                <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_330px]">
                    <div className="grid content-start gap-5">
                        {sellerGroups.map(([seller, items]) => (
                            <section
                                key={seller}
                                className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
                            >
                                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/10">
                                    <h2 className="inline-flex items-center gap-2 font-black">
                                        <Building2 className="size-4 text-orange-500" />
                                        {seller}
                                    </h2>
                                    {items[0].vendor?.business_email && (
                                        <a
                                            href={`mailto:${items[0].vendor.business_email}?subject=Order ${order.number}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-black text-orange-600"
                                        >
                                            <Mail className="size-3.5" />
                                            Contact seller
                                        </a>
                                    )}
                                </header>
                                <div className="divide-y divide-slate-100 dark:divide-white/10">
                                    {items.map((item) => (
                                        <article
                                            key={item.id}
                                            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                                        >
                                            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5">
                                                <ShoppingBag className="size-6" />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-black">
                                                    {item.product_name}
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {item.variant_name ||
                                                        item.sku}{' '}
                                                    · Qty {item.quantity}
                                                </p>
                                                <p className="mt-2 text-[10px] font-black text-emerald-600 uppercase">
                                                    {item.fulfilment_status}
                                                </p>
                                            </div>
                                            <div className="sm:text-right">
                                                <p className="font-black">
                                                    {money.format(
                                                        Number(item.total),
                                                    )}
                                                </p>
                                                {canCancel &&
                                                    item.fulfilment_status !==
                                                        'cancelled' && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setCancellationTarget(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-rose-500"
                                                        >
                                                            <X className="size-3" />
                                                            Cancel item
                                                        </button>
                                                    )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}

                        <ShipmentSection order={order} />
                        <DeliveryInstructions order={order} />
                        <RefundTracking order={order} />
                        {issueOpen && (
                            <IssueForm
                                order={order}
                                onClose={() => setIssueOpen(false)}
                            />
                        )}
                    </div>

                    <aside className="grid h-fit gap-4 lg:sticky lg:top-32">
                        <section className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
                            <h2 className="text-lg font-black">
                                Order summary
                            </h2>
                            <div className="mt-5 grid gap-3 text-sm">
                                <Summary
                                    label="Subtotal"
                                    value={money.format(Number(order.subtotal))}
                                />
                                <Summary
                                    label="Shipping"
                                    value={
                                        Number(order.shipping_total) === 0
                                            ? 'Free'
                                            : money.format(
                                                  Number(order.shipping_total),
                                              )
                                    }
                                />
                                <Summary
                                    label="Tax"
                                    value={money.format(
                                        Number(order.tax_total),
                                    )}
                                />
                                <Summary
                                    label="Discount"
                                    value={`−${money.format(Number(order.discount_total))}`}
                                />
                                <div className="mt-2 flex justify-between border-t border-white/10 pt-4 font-black">
                                    <span>Total</span>
                                    <span className="text-xl">
                                        {money.format(Number(order.total))}
                                    </span>
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-slate-400">
                                Payment:{' '}
                                {order.payment_status.replace('_', ' ')}
                            </p>
                        </section>

                        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                            <div className="grid gap-2">
                                <a
                                    href={invoice.url(order.id)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-black dark:border-white/10"
                                >
                                    <Download className="size-4" /> Download
                                    invoice
                                </a>
                                <a
                                    href={receipt.url(order.id)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-black dark:border-white/10"
                                >
                                    <Download className="size-4" /> Download
                                    receipt
                                </a>
                                <Link
                                    href={reorder(order.id)}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-left text-xs font-black dark:border-white/10"
                                >
                                    <RefreshCw className="size-4" /> Reorder
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setIssueOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-left text-xs font-black dark:border-white/10"
                                >
                                    <CircleAlert className="size-4" /> Report
                                    order issue
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIssueOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-left text-xs font-black dark:border-white/10"
                                >
                                    <Headphones className="size-4" /> Contact
                                    support
                                </button>
                                {order.status === 'delivered' && (
                                    <Link
                                        href={returnsIndex()}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-left text-xs font-black dark:border-white/10"
                                    >
                                        <RefreshCw className="size-4" /> Return,
                                        replace or exchange
                                    </Link>
                                )}
                                <Link
                                    href={refundsIndex()}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-left text-xs font-black dark:border-white/10"
                                >
                                    <WalletCards className="size-4" /> Refund
                                    center
                                </Link>
                                {canCancel && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCancellationTarget('order')
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-left text-xs font-black text-rose-600 dark:bg-rose-500/10"
                                    >
                                        <X className="size-4" /> Cancel order
                                    </button>
                                )}
                            </div>
                        </section>
                    </aside>
                </div>
                {cancellationTarget !== null && (
                    <CancellationForm
                        order={order}
                        target={cancellationTarget}
                        onClose={() => setCancellationTarget(null)}
                    />
                )}
            </main>
        </StorefrontLayout>
    );
}

function ShipmentSection({ order }: { order: CustomerOrder }) {
    const connectionStatus = useConnectionStatus();
    const stages = [
        'confirmed',
        'processed',
        'packed',
        'shipped',
        'out_for_delivery',
        'delivered',
    ];
    const shipmentStatus =
        order.shipment?.status === 'in_transit'
            ? 'shipped'
            : order.shipment?.status;
    const currentStageIndex = shipmentStatus
        ? stages.indexOf(shipmentStatus)
        : -1;

    useEcho(
        `orders.${order.id}`,
        'ShipmentTrackingUpdated',
        () => router.reload({ only: ['order'] }),
        [order.id],
    );

    return (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                    <Truck className="size-5" />
                </span>
                <div>
                    <h2 className="font-black">Live shipment tracking</h2>
                    <p className="text-xs text-slate-500">
                        {order.shipment?.carrier ?? 'Carrier pending'} ·{' '}
                        {order.shipment?.tracking_number ??
                            'Tracking will appear here'}
                    </p>
                </div>
                <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-600 uppercase dark:bg-emerald-500/10">
                    {connectionStatus === 'connected'
                        ? 'Live updates on'
                        : 'Reconnecting'}
                </span>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                <p className="inline-flex items-center gap-2 text-sm font-black capitalize">
                    <PackageCheck className="size-4 text-orange-500" />
                    {order.shipment?.status ?? 'Preparing shipment'}
                </p>
                {order.shipment?.estimated_delivery_at && (
                    <p className="mt-2 text-xs text-slate-500">
                        Estimated delivery{' '}
                        {new Date(
                            order.shipment.estimated_delivery_at,
                        ).toLocaleString('en-IN')}
                    </p>
                )}
            </div>
            {order.shipment && (
                <>
                    <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
                        {stages.map((stage, index) => {
                            const complete =
                                currentStageIndex >= index ||
                                order.shipment?.status === 'delivered';

                            return (
                                <div key={stage}>
                                    <span
                                        className={`mx-auto grid size-7 place-items-center rounded-full text-xs font-black ${complete ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-white/5'}`}
                                    >
                                        {complete ? (
                                            <Check className="size-3.5" />
                                        ) : (
                                            index + 1
                                        )}
                                    </span>
                                    <p className="mt-2 text-center text-[9px] font-black text-slate-500 capitalize">
                                        {stage.replaceAll('_', ' ')}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {['failed_delivery', 'rescheduled', 'cancelled'].includes(
                        order.shipment.status,
                    ) && (
                        <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-700 capitalize dark:bg-amber-500/10 dark:text-amber-300">
                            {order.shipment.status.replaceAll('_', ' ')}. Review
                            the latest courier update below.
                        </p>
                    )}

                    {order.shipment.status === 'out_for_delivery' &&
                        order.shipment.delivery_otp && (
                            <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
                                <p className="text-[10px] font-black tracking-wider text-orange-600 uppercase">
                                    Delivery OTP
                                </p>
                                <p className="mt-1 text-2xl font-black tracking-[0.2em]">
                                    {order.shipment.delivery_otp}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Share this only after receiving your parcel.
                                </p>
                            </div>
                        )}

                    <div className="mt-6 border-t border-slate-100 pt-5 dark:border-white/10">
                        <h3 className="text-sm font-black">
                            Tracking timeline
                        </h3>
                        <div className="mt-4 grid gap-4">
                            {order.shipment.events?.length ? (
                                order.shipment.events.map((event) => (
                                    <div key={event.id} className="flex gap-3">
                                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-orange-500" />
                                        <div>
                                            <p className="text-xs font-black capitalize">
                                                {event.status.replaceAll(
                                                    '_',
                                                    ' ',
                                                )}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {event.message ??
                                                    'Shipment status updated.'}
                                                {event.location
                                                    ? ` · ${event.location}`
                                                    : ''}
                                            </p>
                                            <p className="mt-1 text-[10px] text-slate-400">
                                                {new Date(
                                                    event.occurred_at,
                                                ).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500">
                                    Courier updates will appear here.
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}

function DeliveryInstructions({ order }: { order: CustomerOrder }) {
    return (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <h2 className="inline-flex items-center gap-2 font-black">
                <MapPin className="size-4 text-orange-500" /> Delivery details
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
                {order.shipping_address.line_1}, {order.shipping_address.city},{' '}
                {order.shipping_address.state}{' '}
                {order.shipping_address.postal_code}
            </p>
            <Form
                {...updateInstructions.form(order.id)}
                options={{ preserveScroll: true }}
                className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
                {({ processing, errors, recentlySuccessful }) => (
                    <>
                        <div className="min-w-0 flex-1">
                            <input
                                name="delivery_instructions"
                                defaultValue={order.shipment?.notes ?? ''}
                                placeholder="Gate code or drop-off preference"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
                            />
                            {errors.delivery_instructions && (
                                <p className="mt-1 text-xs text-rose-500">
                                    {errors.delivery_instructions}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white dark:bg-orange-500"
                        >
                            {recentlySuccessful ? (
                                <Check className="size-4" />
                            ) : (
                                <Save className="size-4" />
                            )}
                            Save instructions
                        </button>
                    </>
                )}
            </Form>
        </section>
    );
}

function RefundTracking({ order }: { order: CustomerOrder }) {
    const refunds = order.payment?.refunds ?? [];

    if (refunds.length === 0 && order.status !== 'cancelled') {
        return null;
    }

    return (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-black">Refund status</h2>
            {refunds.length ? (
                <div className="mt-4 grid gap-3">
                    {refunds.map((refund) => (
                        <div
                            key={refund.id}
                            className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-black">
                                        {refund.number}
                                    </p>
                                    <p className="mt-1 text-[10px] text-slate-500 capitalize">
                                        {refund.reason_code.replaceAll(
                                            '_',
                                            ' ',
                                        )}
                                        {' · '}
                                        {refund.metadata?.refund_method?.replaceAll(
                                            '_',
                                            ' ',
                                        ) ?? 'Original payment'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black">
                                        {money.format(Number(refund.amount))}
                                    </p>
                                    <span className="text-[10px] font-black text-orange-600 uppercase">
                                        {refund.status.replaceAll('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {['requested', 'processing', 'completed'].map(
                                    (stage, index) => {
                                        const statusIndex = [
                                            'requested',
                                            'approved',
                                            'processing',
                                            'completed',
                                        ].indexOf(refund.status);
                                        const complete =
                                            statusIndex >=
                                            (index === 0
                                                ? 0
                                                : index === 1
                                                  ? 2
                                                  : 3);

                                        return (
                                            <div key={stage}>
                                                <div
                                                    className={`h-1.5 rounded-full ${complete ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`}
                                                />
                                                <p className="mt-1.5 text-[9px] font-bold text-slate-500 capitalize">
                                                    {stage}
                                                </p>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                            {refund.failure_reason && (
                                <p className="mt-3 text-xs text-rose-500">
                                    {refund.failure_reason}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-3 text-xs text-slate-500">
                    No payment refund is required for this cancellation.
                </p>
            )}
        </section>
    );
}

function CancellationForm({
    order,
    target,
    onClose,
}: {
    order: CustomerOrder;
    target: number | 'order';
    onClose: () => void;
}) {
    const route =
        target === 'order'
            ? cancel.form(order.id)
            : cancelItem.form({
                  order: order.id,
                  orderItem: target,
              });

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl dark:bg-slate-950">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-black tracking-wider text-rose-500 uppercase">
                            Cancellation confirmation
                        </p>
                        <h2 className="mt-1 text-2xl font-black">
                            Cancel {target === 'order' ? 'this order' : 'item'}?
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid size-9 place-items-center rounded-full bg-slate-100 dark:bg-white/5"
                    >
                        <X className="size-4" />
                    </button>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Eligibility is checked again before cancellation. Fulfilled
                    or shipped items cannot be cancelled.
                </p>
                <Form
                    {...route}
                    options={{ preserveScroll: true }}
                    className="mt-5 grid gap-4"
                >
                    {({ errors, processing }) => (
                        <>
                            <label className="grid gap-1.5 text-xs font-black">
                                Cancellation reason
                                <select
                                    name="reason"
                                    required
                                    defaultValue=""
                                    className="h-11 rounded-xl border border-slate-200 bg-transparent px-3 text-sm dark:border-white/10"
                                >
                                    <option value="" disabled>
                                        Select a reason
                                    </option>
                                    <option value="changed_mind">
                                        Changed my mind
                                    </option>
                                    <option value="ordered_by_mistake">
                                        Ordered by mistake
                                    </option>
                                    <option value="found_better_price">
                                        Found a better price
                                    </option>
                                    <option value="delivery_too_late">
                                        Delivery is too late
                                    </option>
                                    <option value="incorrect_address">
                                        Incorrect address
                                    </option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.reason && (
                                    <span className="text-rose-500">
                                        {errors.reason}
                                    </span>
                                )}
                            </label>
                            <label className="grid gap-1.5 text-xs font-black">
                                Additional details
                                <textarea
                                    name="reason_details"
                                    rows={3}
                                    placeholder="Required when selecting Other"
                                    className="rounded-xl border border-slate-200 bg-transparent p-3 text-sm font-normal dark:border-white/10"
                                />
                                {errors.reason_details && (
                                    <span className="text-rose-500">
                                        {errors.reason_details}
                                    </span>
                                )}
                            </label>
                            <label className="grid gap-1.5 text-xs font-black">
                                Refund method
                                <select
                                    name="refund_method"
                                    defaultValue="original_payment"
                                    className="h-11 rounded-xl border border-slate-200 bg-transparent px-3 text-sm dark:border-white/10"
                                >
                                    <option value="original_payment">
                                        Original payment method
                                    </option>
                                    <option value="store_credit">
                                        Velora store credit
                                    </option>
                                    <option value="bank_transfer">
                                        Bank transfer
                                    </option>
                                </select>
                            </label>
                            <label className="flex items-start gap-3 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                                <input
                                    type="checkbox"
                                    name="confirmed"
                                    value="1"
                                    required
                                    className="mt-0.5"
                                />
                                I understand this cancellation cannot be
                                reversed.
                            </label>
                            {(errors.confirmed ||
                                errors.order ||
                                errors.item) && (
                                <p className="text-xs text-rose-500">
                                    {errors.confirmed ??
                                        errors.order ??
                                        errors.item}
                                </p>
                            )}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-full border border-slate-200 px-5 py-3 text-xs font-black dark:border-white/10"
                                >
                                    Keep order
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-full bg-rose-600 px-5 py-3 text-xs font-black text-white disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Checking eligibility...'
                                        : 'Confirm cancellation'}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}

function IssueForm({
    order,
    onClose,
}: {
    order: CustomerOrder;
    onClose: () => void;
}) {
    return (
        <section className="rounded-[1.75rem] border border-orange-200 bg-orange-50 p-5 dark:border-orange-500/20 dark:bg-orange-500/10">
            <div className="flex justify-between gap-3">
                <div>
                    <h2 className="font-black">How can we help?</h2>
                    <p className="mt-1 text-xs text-slate-500">
                        A support ticket will be linked to this order.
                    </p>
                </div>
                <button type="button" onClick={onClose}>
                    <X className="size-4" />
                </button>
            </div>
            <Form
                {...reportIssue.form(order.id)}
                options={{ preserveScroll: true }}
                onSuccess={onClose}
                className="mt-4 grid gap-3"
            >
                {({ processing, errors }) => (
                    <>
                        <select
                            name="category"
                            className="h-11 rounded-xl border border-orange-200 bg-white px-4 text-sm dark:bg-slate-900"
                        >
                            <option value="delivery">Delivery problem</option>
                            <option value="item">Item problem</option>
                            <option value="payment">Payment problem</option>
                            <option value="seller">Seller concern</option>
                            <option value="other">Other</option>
                        </select>
                        <textarea
                            name="description"
                            rows={4}
                            placeholder="Describe the issue…"
                            className="rounded-xl border border-orange-200 bg-white p-4 text-sm dark:bg-slate-900"
                        />
                        {errors.description && (
                            <p className="text-xs text-rose-500">
                                {errors.description}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-xs font-black text-white"
                        >
                            <MessageCircle className="size-4" /> Create support
                            ticket
                        </button>
                    </>
                )}
            </Form>
        </section>
    );
}

function Summary({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 text-slate-400">
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}
