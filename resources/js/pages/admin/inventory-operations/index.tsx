import { router, useForm } from '@inertiajs/react';
import { ArrowDownUp, Boxes, Clock3, Search } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import AdminLayout from '@/layouts/admin-layout';
import operationRoutes from '@/routes/admin/inventory-operations';
import reservationRoutes from '@/routes/admin/inventory-reservations';
import type {
    InventoryMovement,
    InventoryReservation,
    Paginated,
} from '@/types/admin';

const control =
    'h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]';

export default function InventoryOperationsIndex({
    movements,
    reservations,
}: {
    movements: Paginated<InventoryMovement>;
    reservations: Paginated<InventoryReservation>;
}) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [type, setType] = useState(params.get('type') ?? '');
    const [reservationStatus, setReservationStatus] = useState(
        params.get('reservation_status') ?? '',
    );
    const filter = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            operationRoutes.index.url(),
            { search, type, reservation_status: reservationStatus },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout
            title="Inventory Control"
            breadcrumb="Operations / Inventory Control"
        >
            <div>
                <h2 className="text-xl font-black">
                    Stock ledger and reservations
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Trace every stock movement and safely release stale
                    allocations.
                </p>
            </div>
            <form
                onSubmit={filter}
                className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_13rem_13rem_auto] dark:border-white/10 dark:bg-white/5"
            >
                <label className="relative">
                    <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Product, SKU or movement ID"
                        className={`${control} w-full pl-9`}
                    />
                </label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={control}
                >
                    <option value="">All movement types</option>
                    {[
                        'purchase_receipt',
                        'sale',
                        'return',
                        'adjustment',
                        'transfer',
                        'damage',
                    ].map((value) => (
                        <option key={value}>
                            {value.replaceAll('_', ' ')}
                        </option>
                    ))}
                </select>
                <select
                    value={reservationStatus}
                    onChange={(e) => setReservationStatus(e.target.value)}
                    className={control}
                >
                    <option value="">All reservations</option>
                    {['active', 'released', 'expired', 'converted'].map(
                        (value) => (
                            <option key={value}>{value}</option>
                        ),
                    )}
                </select>
                <button className="rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                    Apply
                </button>
            </form>
            <div className="mt-6 grid gap-6 2xl:grid-cols-2">
                <Panel
                    title="Inventory movements"
                    description={`${movements.total} ledger entries`}
                    icon={ArrowDownUp}
                >
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {movements.data.map((movement) => (
                            <article
                                key={movement.id}
                                className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                            >
                                <div>
                                    <p className="font-bold">
                                        {movement.inventory.product.name}
                                        {movement.inventory.variant
                                            ? ` · ${movement.inventory.variant.name}`
                                            : ''}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {movement.inventory.store.code} ·{' '}
                                        {movement.type.replaceAll('_', ' ')} ·{' '}
                                        {movement.reason ??
                                            'No reason supplied'}
                                    </p>
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        {new Date(
                                            movement.occurred_at,
                                        ).toLocaleString()}{' '}
                                        · {movement.creator?.name ?? 'System'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`text-lg font-black ${movement.quantity >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                                    >
                                        {movement.quantity > 0 ? '+' : ''}
                                        {movement.quantity}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        {movement.before_quantity} →{' '}
                                        {movement.after_quantity}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                    {movements.data.length === 0 && (
                        <Empty icon={Boxes} text="No movement records found." />
                    )}
                    <Pagination links={movements.links} />
                </Panel>
                <Panel
                    title="Inventory reservations"
                    description={`${reservations.total} allocations`}
                    icon={Clock3}
                >
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {reservations.data.map((reservation) => (
                            <ReservationRow
                                key={reservation.id}
                                reservation={reservation}
                            />
                        ))}
                    </div>
                    {reservations.data.length === 0 && (
                        <Empty icon={Clock3} text="No reservations found." />
                    )}
                    <Pagination links={reservations.links} />
                </Panel>
            </div>
        </AdminLayout>
    );
}

function ReservationRow({
    reservation,
}: {
    reservation: InventoryReservation;
}) {
    const form = useForm({ release_reason: 'admin_release' });

    return (
        <article className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">
                        {reservation.inventory.product.name}
                    </p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold capitalize dark:bg-white/10">
                        {reservation.status}
                    </span>
                </div>
                <p className="text-xs text-slate-500">
                    {reservation.inventory.store.code} · Qty{' '}
                    {reservation.quantity}
                    {reservation.order
                        ? ` · Order ${reservation.order.number}`
                        : ''}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                    Expires{' '}
                    {reservation.expires_at
                        ? new Date(reservation.expires_at).toLocaleString()
                        : 'manually'}
                </p>
            </div>
            {reservation.status === 'active' && (
                <button
                    onClick={() =>
                        form.patch(
                            reservationRoutes.release.url(reservation.id),
                            { preserveScroll: true },
                        )
                    }
                    disabled={form.processing}
                    className="h-9 rounded-xl bg-rose-50 px-3 text-xs font-bold text-rose-700 disabled:opacity-50 dark:bg-rose-500/10 dark:text-rose-300"
                >
                    Release
                </button>
            )}
        </article>
    );
}

function Panel({
    title,
    description,
    icon: Icon,
    children,
}: {
    title: string;
    description: string;
    icon: typeof Boxes;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
            <header className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-white/10">
                <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                    <Icon className="size-5" />
                </span>
                <div>
                    <h3 className="font-black">{title}</h3>
                    <p className="text-xs text-slate-500">{description}</p>
                </div>
            </header>
            {children}
        </section>
    );
}
function Empty({ icon: Icon, text }: { icon: typeof Boxes; text: string }) {
    return (
        <div className="p-12 text-center">
            <Icon className="mx-auto size-8 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">{text}</p>
        </div>
    );
}
