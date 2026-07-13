import { router, useForm } from '@inertiajs/react';
import { Box, CheckCircle2, Clock3, Search, Truck } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import shipmentsRoutes from '@/routes/admin/shipments';
import type { Counts, Paginated, Shipment } from '@/types/admin';
const control =
    'mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]';
export default function ShipmentsIndex({
    shipments,
    counts,
}: {
    shipments: Paginated<Shipment>;
    counts: Counts;
}) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            shipmentsRoutes.index.url(),
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Fulfilment" breadcrumb="Operations / Shipments">
            <div>
                <h2 className="text-xl font-black">Shipment control tower</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Manage dispatch, carriers, tracking and delivery
                    commitments.
                </p>
            </div>
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Shipments',
                            value: counts.total,
                            icon: Box,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Awaiting dispatch',
                            value: counts.pending,
                            icon: Clock3,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'In transit',
                            value: counts.in_transit,
                            icon: Truck,
                            tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
                        },
                        {
                            label: 'Delivered',
                            value: counts.delivered,
                            icon: CheckCircle2,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                    ]}
                />
            </div>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={submit}
                    className="flex gap-3 border-b border-slate-200 p-4 dark:border-white/10"
                >
                    <label className="relative flex-1">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Order, carrier or tracking"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All states</option>
                        {[
                            'pending',
                            'packed',
                            'shipped',
                            'in_transit',
                            'delivered',
                            'returned',
                        ].map((v) => (
                            <option key={v} value={v}>
                                {v.replaceAll('_', ' ')}
                            </option>
                        ))}
                    </select>
                    <button className="rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>
                <div className="grid divide-y divide-slate-100 dark:divide-white/5">
                    {shipments.data.map((shipment) => (
                        <ShipmentRow key={shipment.id} shipment={shipment} />
                    ))}
                    {shipments.data.length === 0 && (
                        <div className="p-14 text-center text-sm text-slate-500">
                            No shipment records found.
                        </div>
                    )}
                </div>
                <Pagination links={shipments.links} />
            </section>
        </AdminLayout>
    );
}
function ShipmentRow({ shipment }: { shipment: Shipment }) {
    const form = useForm({
        carrier: shipment.carrier ?? '',
        tracking_number: shipment.tracking_number ?? '',
        status: shipment.status,
        estimated_delivery_at:
            shipment.estimated_delivery_at?.slice(0, 16) ?? '',
        notes: shipment.notes ?? '',
    });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.put(shipmentsRoutes.update.url(shipment.id), {
            preserveScroll: true,
        });
    };

    return (
        <form
            onSubmit={submit}
            className="grid gap-4 p-5 xl:grid-cols-[1fr_10rem_12rem_11rem_13rem_auto] xl:items-end"
        >
            <div>
                <p className="font-black">{shipment.order.number}</p>
                <p className="text-xs text-slate-500">
                    {shipment.order.user.name} · {shipment.order.user.email}
                </p>
            </div>
            <Field label="Carrier">
                <input
                    value={form.data.carrier}
                    onChange={(e) => form.setData('carrier', e.target.value)}
                    className={control}
                />
            </Field>
            <Field label="Tracking number" error={form.errors.tracking_number}>
                <input
                    value={form.data.tracking_number}
                    onChange={(e) =>
                        form.setData('tracking_number', e.target.value)
                    }
                    className={control}
                />
            </Field>
            <Field label="Status">
                <select
                    value={form.data.status}
                    onChange={(e) =>
                        form.setData(
                            'status',
                            e.target.value as Shipment['status'],
                        )
                    }
                    className={control}
                >
                    {[
                        'pending',
                        'packed',
                        'shipped',
                        'in_transit',
                        'delivered',
                        'returned',
                    ].map((v) => (
                        <option key={v} value={v}>
                            {v.replaceAll('_', ' ')}
                        </option>
                    ))}
                </select>
            </Field>
            <Field label="Estimated delivery">
                <input
                    type="datetime-local"
                    value={form.data.estimated_delivery_at}
                    onChange={(e) =>
                        form.setData('estimated_delivery_at', e.target.value)
                    }
                    className={control}
                />
            </Field>
            <button
                disabled={form.processing}
                className="h-10 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white"
            >
                Save
            </button>
        </form>
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
        <label className="text-xs font-bold text-slate-500">
            {label}
            {children}
            {error && <span className="block text-rose-600">{error}</span>}
        </label>
    );
}
