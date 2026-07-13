import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/settlements';
const control =
    'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-white/5';
export default function Create({
    vendors,
}: {
    vendors: {
        id: number;
        business_name: string;
        commission_rate: string;
        settlement_cycle: string;
    }[];
}) {
    const form = useForm({
        vendor_id: '',
        period_start: '',
        period_end: '',
        shipping_fee: '0',
        tax_withheld: '0',
        adjustments: '0',
        notes: '',
    });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(routes.store.url());
    };

    return (
        <AdminLayout
            title="Generate Settlement"
            breadcrumb="Finance / Settlements / Generate"
        >
            <form
                onSubmit={submit}
                className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5"
            >
                <h2 className="text-xl font-black">Settlement period</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Delivered sales and refunded returns are calculated
                    automatically.
                </p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <Field
                        label="Approved seller"
                        error={form.errors.vendor_id}
                    >
                        <select
                            value={form.data.vendor_id}
                            onChange={(e) =>
                                form.setData('vendor_id', e.target.value)
                            }
                            className={control}
                        >
                            <option value="">Select seller</option>
                            {vendors.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.business_name} · {v.commission_rate}% ·{' '}
                                    {v.settlement_cycle}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field
                        label="Period start"
                        error={form.errors.period_start}
                    >
                        <input
                            type="date"
                            value={form.data.period_start}
                            onChange={(e) =>
                                form.setData('period_start', e.target.value)
                            }
                            className={control}
                        />
                    </Field>
                    <Field label="Period end" error={form.errors.period_end}>
                        <input
                            type="date"
                            value={form.data.period_end}
                            onChange={(e) =>
                                form.setData('period_end', e.target.value)
                            }
                            className={control}
                        />
                    </Field>
                    {(
                        ['shipping_fee', 'tax_withheld', 'adjustments'] as const
                    ).map((key) => (
                        <Field
                            key={key}
                            label={key.replaceAll('_', ' ')}
                            error={form.errors[key]}
                        >
                            <input
                                type="number"
                                step="0.01"
                                value={form.data[key]}
                                onChange={(e) =>
                                    form.setData(key, e.target.value)
                                }
                                className={control}
                            />
                        </Field>
                    ))}
                    <Field label="Finance notes" error={form.errors.notes}>
                        <textarea
                            rows={4}
                            value={form.data.notes}
                            onChange={(e) =>
                                form.setData('notes', e.target.value)
                            }
                            className={`${control} h-auto py-3`}
                        />
                    </Field>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Link
                        href={routes.index.url()}
                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold dark:border-white/10"
                    >
                        Cancel
                    </Link>
                    <button
                        disabled={form.processing}
                        className="rounded-xl bg-orange-500 px-6 text-sm font-bold text-white"
                    >
                        Generate ledger
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
        <label className="text-xs font-bold text-slate-600 capitalize dark:text-slate-300">
            {label}
            {children}
            {error && <span className="block text-rose-600">{error}</span>}
        </label>
    );
}
