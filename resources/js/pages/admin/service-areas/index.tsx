import { router, useForm } from '@inertiajs/react';
import { MapPinned, Plus, Search, Trash2, Truck } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/service-areas';
import type { Paginated, ServiceArea } from '@/types/admin';

type StoreOption = { id: number; name: string; code: string };
const control =
    'h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]';
const defaults = {
    store_id: '',
    postal_code: '',
    city: '',
    district: '',
    state: '',
    country_code: 'IN',
    prepaid_available: true,
    cod_available: true,
    express_available: false,
    minimum_delivery_days: 2,
    maximum_delivery_days: 7,
    shipping_charge: '0',
    free_shipping_threshold: '',
    cod_charge: '0',
    daily_capacity: '',
    status: 'active' as const,
    cutoff_time: '',
};

export default function ServiceAreasIndex({
    serviceAreas,
    stores,
}: {
    serviceAreas: Paginated<ServiceArea>;
    stores: StoreOption[];
}) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const filter = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            routes.index.url(),
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout
            title="Delivery Coverage"
            breadcrumb="Operations / Delivery Coverage"
        >
            <div>
                <h2 className="text-xl font-black">
                    Postal-code serviceability
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Control delivery promises, COD eligibility, charges and
                    fulfilment capacity.
                </p>
            </div>
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                        <Plus className="size-5" />
                    </span>
                    <div>
                        <h3 className="font-black">Add delivery area</h3>
                        <p className="text-xs text-slate-500">
                            Create coverage for a warehouse and postal code.
                        </p>
                    </div>
                </div>
                <div className="mt-5">
                    <AreaForm stores={stores} />
                </div>
            </section>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={filter}
                    className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row dark:border-white/10"
                >
                    <label className="relative flex-1">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Postal code, city or state"
                            className={`${control} pl-9`}
                        />
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={control + ' sm:w-44'}
                    >
                        <option value="">All statuses</option>
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                    </select>
                    <button className="h-10 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {serviceAreas.data.map((area) => (
                        <AreaRow key={area.id} area={area} stores={stores} />
                    ))}
                    {serviceAreas.data.length === 0 && (
                        <div className="p-14 text-center">
                            <MapPinned className="mx-auto size-8 text-slate-300" />
                            <p className="mt-3 text-sm text-slate-500">
                                No delivery areas found.
                            </p>
                        </div>
                    )}
                </div>
                <Pagination links={serviceAreas.links} />
            </section>
        </AdminLayout>
    );
}

function AreaForm({ stores }: { stores: StoreOption[] }) {
    const form = useForm(defaults);
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform(booleanPayload);
        form.post(routes.store.url(), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <form
            onSubmit={submit}
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-[12rem_9rem_1fr_1fr_7rem_7rem_8rem_auto]"
        >
            <select
                value={form.data.store_id}
                onChange={(e) => form.setData('store_id', e.target.value)}
                className={control}
            >
                <option value="">All warehouses</option>
                {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                        {store.code}
                    </option>
                ))}
            </select>
            <input
                required
                value={form.data.postal_code}
                onChange={(e) => form.setData('postal_code', e.target.value)}
                placeholder="Postal code"
                className={control}
            />
            <input
                value={form.data.city}
                onChange={(e) => form.setData('city', e.target.value)}
                placeholder="City"
                className={control}
            />
            <input
                required
                value={form.data.state}
                onChange={(e) => form.setData('state', e.target.value)}
                placeholder="State"
                className={control}
            />
            <input
                type="number"
                min="0"
                value={form.data.minimum_delivery_days}
                onChange={(e) =>
                    form.setData(
                        'minimum_delivery_days',
                        Number(e.target.value),
                    )
                }
                title="Minimum delivery days"
                className={control}
            />
            <input
                type="number"
                min="0"
                value={form.data.maximum_delivery_days}
                onChange={(e) =>
                    form.setData(
                        'maximum_delivery_days',
                        Number(e.target.value),
                    )
                }
                title="Maximum delivery days"
                className={control}
            />
            <input
                type="number"
                min="0"
                step="0.01"
                value={form.data.shipping_charge}
                onChange={(e) =>
                    form.setData('shipping_charge', e.target.value)
                }
                placeholder="Shipping fee"
                className={control}
            />
            <button
                disabled={form.processing}
                className="rounded-xl bg-orange-500 px-4 text-sm font-bold text-white disabled:opacity-50"
            >
                Add area
            </button>
            <div className="flex flex-wrap gap-4 md:col-span-2 xl:col-span-full">
                <Check
                    label="Prepaid"
                    checked={form.data.prepaid_available}
                    onChange={(value) =>
                        form.setData('prepaid_available', value)
                    }
                />
                <Check
                    label="Cash on delivery"
                    checked={form.data.cod_available}
                    onChange={(value) => form.setData('cod_available', value)}
                />
                <Check
                    label="Express"
                    checked={form.data.express_available}
                    onChange={(value) =>
                        form.setData('express_available', value)
                    }
                />
            </div>
            {Object.values(form.errors)[0] && (
                <p className="text-xs text-rose-600 md:col-span-2 xl:col-span-full">
                    {Object.values(form.errors)[0]}
                </p>
            )}
        </form>
    );
}

function AreaRow({
    area,
    stores,
}: {
    area: ServiceArea;
    stores: StoreOption[];
}) {
    const form = useForm({
        ...defaults,
        ...area,
        store_id: area.store_id?.toString() ?? '',
        city: area.city ?? '',
        district: area.district ?? '',
        free_shipping_threshold: area.free_shipping_threshold ?? '',
        daily_capacity: area.daily_capacity?.toString() ?? '',
        cutoff_time: area.cutoff_time?.slice(0, 5) ?? '',
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform(booleanPayload);
        form.patch(routes.update.url(area.id), { preserveScroll: true });
    };

    return (
        <form
            onSubmit={submit}
            className="grid gap-3 p-5 xl:grid-cols-[minmax(14rem,1fr)_10rem_7rem_7rem_8rem_10rem_auto_auto] xl:items-end"
        >
            <div>
                <div className="flex items-center gap-2">
                    <Truck className="size-4 text-orange-500" />
                    <p className="font-black">
                        {area.postal_code} · {area.city ?? area.state}
                    </p>
                </div>
                <p className="text-xs text-slate-500">
                    {area.store
                        ? `${area.store.code} · ${area.store.name}`
                        : 'All fulfilment nodes'}{' '}
                    · {area.state}
                </p>
                <div className="mt-2 flex gap-2 text-[10px] font-bold">
                    <span
                        className={
                            area.prepaid_available
                                ? 'text-emerald-600'
                                : 'text-slate-400'
                        }
                    >
                        PREPAID
                    </span>
                    <span
                        className={
                            area.cod_available
                                ? 'text-emerald-600'
                                : 'text-slate-400'
                        }
                    >
                        COD
                    </span>
                    <span
                        className={
                            area.express_available
                                ? 'text-orange-600'
                                : 'text-slate-400'
                        }
                    >
                        EXPRESS
                    </span>
                </div>
            </div>
            <Field label="Warehouse">
                <select
                    value={form.data.store_id}
                    onChange={(e) => form.setData('store_id', e.target.value)}
                    className={control}
                >
                    <option value="">All</option>
                    {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                            {store.code}
                        </option>
                    ))}
                </select>
            </Field>
            <Field label="Min days">
                <input
                    type="number"
                    min="0"
                    value={form.data.minimum_delivery_days}
                    onChange={(e) =>
                        form.setData(
                            'minimum_delivery_days',
                            Number(e.target.value),
                        )
                    }
                    className={control}
                />
            </Field>
            <Field label="Max days">
                <input
                    type="number"
                    min="0"
                    value={form.data.maximum_delivery_days}
                    onChange={(e) =>
                        form.setData(
                            'maximum_delivery_days',
                            Number(e.target.value),
                        )
                    }
                    className={control}
                />
            </Field>
            <Field label="Shipping">
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.data.shipping_charge}
                    onChange={(e) =>
                        form.setData('shipping_charge', e.target.value)
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
                            e.target.value as 'active' | 'inactive',
                        )
                    }
                    className={control}
                >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                </select>
            </Field>
            <button
                disabled={form.processing}
                className="h-10 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white"
            >
                Save
            </button>
            <button
                type="button"
                onClick={() =>
                    window.confirm('Remove this delivery area?') &&
                    router.delete(routes.destroy.url(area.id), {
                        preserveScroll: true,
                    })
                }
                className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10"
            >
                <Trash2 className="size-4" />
            </button>
            <div className="flex flex-wrap gap-4 xl:col-span-full">
                <Check
                    label="Prepaid"
                    checked={form.data.prepaid_available}
                    onChange={(value) =>
                        form.setData('prepaid_available', value)
                    }
                />
                <Check
                    label="Cash on delivery"
                    checked={form.data.cod_available}
                    onChange={(value) => form.setData('cod_available', value)}
                />
                <Check
                    label="Express"
                    checked={form.data.express_available}
                    onChange={(value) =>
                        form.setData('express_available', value)
                    }
                />
            </div>
            {Object.values(form.errors)[0] && (
                <p className="text-xs text-rose-600 xl:col-span-full">
                    {Object.values(form.errors)[0]}
                </p>
            )}
        </form>
    );
}

function booleanPayload<
    T extends {
        prepaid_available: boolean;
        cod_available: boolean;
        express_available: boolean;
    },
>(data: T) {
    return {
        ...data,
        prepaid_available: data.prepaid_available ? 1 : 0,
        cod_available: data.cod_available ? 1 : 0,
        express_available: data.express_available ? 1 : 0,
    };
}
function Check({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            {label}
        </label>
    );
}
function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="text-[10px] font-bold text-slate-500 uppercase">
            {label}
            <span className="mt-1 block">{children}</span>
        </label>
    );
}
