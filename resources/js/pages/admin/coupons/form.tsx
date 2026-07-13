import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import couponsRoutes from '@/routes/admin/coupons';
import type { Coupon } from '@/types/admin';
const input =
    'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/5';
export default function CouponForm({ coupon }: { coupon: Partial<Coupon> }) {
    const exists = Boolean(coupon.id);
    const form = useForm({
        code: coupon.code ?? '',
        name: coupon.name ?? '',
        description: coupon.description ?? '',
        type: coupon.type ?? 'percentage',
        value: coupon.value ?? '',
        minimum_order_amount: coupon.minimum_order_amount ?? '0',
        maximum_discount_amount: coupon.maximum_discount_amount ?? '',
        usage_limit: coupon.usage_limit?.toString() ?? '',
        starts_at: coupon.starts_at?.slice(0, 16) ?? '',
        expires_at: coupon.expires_at?.slice(0, 16) ?? '',
        status: coupon.status ?? true,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            status: data.status ? 1 : 0,
            _method: exists ? 'PUT' : undefined,
        }));
        form.post(
            exists
                ? couponsRoutes.update.url(coupon.id!)
                : couponsRoutes.store.url(),
        );
    };

    return (
        <AdminLayout
            title={exists ? 'Edit Promotion' : 'Create Promotion'}
            breadcrumb="Growth / Coupons / Campaign"
        >
            <form
                onSubmit={submit}
                className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
            >
                <div className="grid gap-5 p-6 md:grid-cols-2">
                    <Field label="Coupon code" error={form.errors.code}>
                        <input
                            value={form.data.code}
                            onChange={(e) =>
                                form.setData(
                                    'code',
                                    e.target.value.toUpperCase(),
                                )
                            }
                            className={input}
                            required
                        />
                    </Field>
                    <Field label="Campaign name" error={form.errors.name}>
                        <input
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            className={input}
                            required
                        />
                    </Field>
                    <Field label="Discount type">
                        <select
                            value={form.data.type}
                            onChange={(e) =>
                                form.setData(
                                    'type',
                                    e.target.value as Coupon['type'],
                                )
                            }
                            className={input}
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed amount</option>
                        </select>
                    </Field>
                    <Field label="Discount value" error={form.errors.value}>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={form.data.value}
                            onChange={(e) =>
                                form.setData('value', e.target.value)
                            }
                            className={input}
                            required
                        />
                    </Field>
                    <Field label="Minimum order">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.data.minimum_order_amount}
                            onChange={(e) =>
                                form.setData(
                                    'minimum_order_amount',
                                    e.target.value,
                                )
                            }
                            className={input}
                        />
                    </Field>
                    <Field label="Maximum discount">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.data.maximum_discount_amount}
                            onChange={(e) =>
                                form.setData(
                                    'maximum_discount_amount',
                                    e.target.value,
                                )
                            }
                            className={input}
                        />
                    </Field>
                    <Field label="Usage limit">
                        <input
                            type="number"
                            min="1"
                            value={form.data.usage_limit}
                            onChange={(e) =>
                                form.setData('usage_limit', e.target.value)
                            }
                            className={input}
                        />
                    </Field>
                    <div />
                    <Field label="Starts at">
                        <input
                            type="datetime-local"
                            value={form.data.starts_at}
                            onChange={(e) =>
                                form.setData('starts_at', e.target.value)
                            }
                            className={input}
                        />
                    </Field>
                    <Field label="Expires at" error={form.errors.expires_at}>
                        <input
                            type="datetime-local"
                            value={form.data.expires_at}
                            onChange={(e) =>
                                form.setData('expires_at', e.target.value)
                            }
                            className={input}
                        />
                    </Field>
                    <div className="md:col-span-2">
                        <Field label="Description">
                            <textarea
                                rows={5}
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData('description', e.target.value)
                                }
                                className={`${input} h-auto py-3`}
                            />
                        </Field>
                    </div>
                    <label className="flex items-center gap-3 text-sm font-semibold">
                        <input
                            type="checkbox"
                            checked={form.data.status}
                            onChange={(e) =>
                                form.setData('status', e.target.checked)
                            }
                        />
                        Campaign enabled
                    </label>
                </div>
                <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-white/10">
                    <Link
                        href={couponsRoutes.index.url()}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold dark:border-white/10"
                    >
                        Cancel
                    </Link>
                    <button
                        disabled={form.processing}
                        className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white"
                    >
                        {form.processing ? 'Saving...' : 'Save campaign'}
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
