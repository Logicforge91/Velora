import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Warehouse as WarehouseIcon } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/warehouses';
import type { Warehouse } from '@/types/admin';

const control =
    'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/5';

export default function WarehouseForm({
    warehouse,
}: {
    warehouse: Partial<Warehouse>;
}) {
    const exists = Boolean(warehouse.id);
    const form = useForm({
        code: warehouse.code ?? '',
        name: warehouse.name ?? '',
        type: warehouse.type ?? 'warehouse',
        contact_name: warehouse.contact_name ?? '',
        contact_phone: warehouse.contact_phone ?? '',
        address: {
            line_1: warehouse.address?.line_1 ?? '',
            line_2: warehouse.address?.line_2 ?? '',
        },
        city: warehouse.city ?? '',
        state: warehouse.state ?? '',
        postal_code: warehouse.postal_code ?? '',
        capacity: warehouse.capacity ?? 0,
        priority: warehouse.priority ?? 100,
        status: warehouse.status ?? true,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (exists) {
form.put(routes.update.url(warehouse.id!));
} else {
form.post(routes.store.url());
}
    };
    const error = (key: string) => form.errors[key as keyof typeof form.errors];

    return (
        <AdminLayout
            title={exists ? 'Edit Warehouse' : 'Create Warehouse'}
            breadcrumb="Fulfilment / Warehouses / Configuration"
        >
            <Link
                href={
                    exists ? routes.show.url(warehouse.id!) : routes.index.url()
                }
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600"
            >
                <ArrowLeft className="size-4" /> Back
            </Link>
            <form
                onSubmit={submit}
                className="mt-5 grid gap-6 xl:grid-cols-[1fr_21rem]"
            >
                <div className="grid gap-6">
                    <Section title="Node identity">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label="Warehouse code"
                                error={form.errors.code}
                            >
                                <input
                                    value={form.data.code}
                                    onChange={(e) =>
                                        form.setData(
                                            'code',
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                    className={control}
                                    placeholder="BLR-FC-01"
                                />
                            </Field>
                            <Field
                                label="Display name"
                                error={form.errors.name}
                            >
                                <input
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field label="Node type" error={form.errors.type}>
                                <select
                                    value={form.data.type}
                                    onChange={(e) =>
                                        form.setData(
                                            'type',
                                            e.target.value as Warehouse['type'],
                                        )
                                    }
                                    className={control}
                                >
                                    <option value="warehouse">Warehouse</option>
                                    <option value="fulfilment_center">
                                        Fulfilment center
                                    </option>
                                    <option value="dark_store">
                                        Dark store
                                    </option>
                                </select>
                            </Field>
                            <Field
                                label="Routing priority"
                                error={form.errors.priority}
                            >
                                <input
                                    type="number"
                                    min="1"
                                    max="999"
                                    value={form.data.priority}
                                    onChange={(e) =>
                                        form.setData(
                                            'priority',
                                            Number(e.target.value),
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                        </div>
                    </Section>
                    <Section title="Location and contact">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label="Address line 1"
                                error={error('address.line_1')}
                            >
                                <input
                                    value={form.data.address.line_1}
                                    onChange={(e) =>
                                        form.setData('address', {
                                            ...form.data.address,
                                            line_1: e.target.value,
                                        })
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="Address line 2"
                                error={error('address.line_2')}
                            >
                                <input
                                    value={form.data.address.line_2}
                                    onChange={(e) =>
                                        form.setData('address', {
                                            ...form.data.address,
                                            line_2: e.target.value,
                                        })
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field label="City" error={form.errors.city}>
                                <input
                                    value={form.data.city}
                                    onChange={(e) =>
                                        form.setData('city', e.target.value)
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field label="State" error={form.errors.state}>
                                <input
                                    value={form.data.state}
                                    onChange={(e) =>
                                        form.setData('state', e.target.value)
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="Postal code"
                                error={form.errors.postal_code}
                            >
                                <input
                                    value={form.data.postal_code}
                                    onChange={(e) =>
                                        form.setData(
                                            'postal_code',
                                            e.target.value,
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="Storage capacity"
                                error={form.errors.capacity}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    value={form.data.capacity}
                                    onChange={(e) =>
                                        form.setData(
                                            'capacity',
                                            Number(e.target.value),
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="Contact name"
                                error={form.errors.contact_name}
                            >
                                <input
                                    value={form.data.contact_name}
                                    onChange={(e) =>
                                        form.setData(
                                            'contact_name',
                                            e.target.value,
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="Contact phone"
                                error={form.errors.contact_phone}
                            >
                                <input
                                    value={form.data.contact_phone}
                                    onChange={(e) =>
                                        form.setData(
                                            'contact_phone',
                                            e.target.value,
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                        </div>
                    </Section>
                </div>
                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 xl:sticky xl:top-24 dark:border-white/10 dark:bg-white/5">
                    <WarehouseIcon className="size-8 text-orange-500" />
                    <h2 className="mt-4 font-black">Node availability</h2>
                    <label className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4 text-sm font-bold dark:bg-white/5">
                        <span>Accept allocations</span>
                        <input
                            type="checkbox"
                            checked={form.data.status}
                            onChange={(e) =>
                                form.setData('status', e.target.checked)
                            }
                            className="size-5 accent-orange-500"
                        />
                    </label>
                    <button
                        disabled={form.processing}
                        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-bold text-white"
                    >
                        <Save className="size-4" />{' '}
                        {form.processing ? 'Saving...' : 'Save warehouse'}
                    </button>
                </aside>
            </form>
        </AdminLayout>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="mb-5 font-black">{title}</h2>
            {children}
        </section>
    );
}
function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {label}
            {children}
            {error && <span className="mt-1 block text-rose-600">{error}</span>}
        </label>
    );
}
