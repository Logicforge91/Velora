import { Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Boxes,
    MapPin,
    Plus,
    Search,
    Warehouse as WarehouseIcon,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/warehouses';
import type { Counts, Paginated, Warehouse } from '@/types/admin';

export default function WarehousesIndex({
    warehouses,
    counts,
}: {
    warehouses: Paginated<Warehouse>;
    counts: Counts;
}) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            routes.index.url(),
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout
            title="Warehouse Network"
            breadcrumb="Fulfilment / Warehouses"
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">
                        Fulfilment network
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                        Inventory control tower
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage nodes, capacity, reservations and replenishment
                        risk.
                    </p>
                </div>
                <Link
                    href={routes.create.url()}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white"
                >
                    <Plus className="size-4" /> Add warehouse
                </Link>
            </div>
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Network nodes',
                            value: counts.total,
                            icon: WarehouseIcon,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Active nodes',
                            value: counts.active,
                            icon: MapPin,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                        {
                            label: 'Units on hand',
                            value: counts.units,
                            icon: Boxes,
                            tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
                        },
                        {
                            label: 'Reorder alerts',
                            value: counts.low_stock,
                            icon: AlertTriangle,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                    ]}
                />
            </div>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[1fr_12rem_auto] dark:border-white/10"
                >
                    <label className="relative">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Name, code or city"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All nodes</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button className="rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>
                <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                    {warehouses.data.map((warehouse) => {
                        const units = Number(warehouse.units_on_hand ?? 0);
                        const usage =
                            warehouse.capacity > 0
                                ? Math.min(
                                      100,
                                      (units / warehouse.capacity) * 100,
                                  )
                                : 0;

                        return (
                            <Link
                                key={warehouse.id}
                                href={routes.show.url(warehouse.id)}
                                prefetch
                                className="rounded-2xl border border-slate-200 p-5 transition hover:border-orange-300 hover:shadow-lg dark:border-white/10"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-black text-orange-600">
                                            {warehouse.code}
                                        </p>
                                        <h3 className="mt-1 font-black">
                                            {warehouse.name}
                                        </h3>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {warehouse.city}, {warehouse.state}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${warehouse.status ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10' : 'bg-slate-100 text-slate-500 dark:bg-white/10'}`}
                                    >
                                        {warehouse.status
                                            ? 'Active'
                                            : 'Inactive'}
                                    </span>
                                </div>
                                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                                    <Metric
                                        label="SKUs"
                                        value={warehouse.inventories_count ?? 0}
                                    />
                                    <Metric label="On hand" value={units} />
                                    <Metric
                                        label="Reserved"
                                        value={Number(
                                            warehouse.units_reserved ?? 0,
                                        )}
                                    />
                                </div>
                                <div className="mt-5">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                        <span>Capacity usage</span>
                                        <span>{usage.toFixed(0)}%</span>
                                    </div>
                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-orange-500"
                                            style={{ width: `${usage}%` }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                    {warehouses.data.length === 0 && (
                        <div className="p-12 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">
                            No warehouse nodes found.
                        </div>
                    )}
                </div>
                <Pagination links={warehouses.links} />
            </section>
        </AdminLayout>
    );
}

function Metric({ label, value }: { label: string; value: number }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
                {label}
            </p>
            <p className="mt-1 font-black">{value.toLocaleString()}</p>
        </div>
    );
}
