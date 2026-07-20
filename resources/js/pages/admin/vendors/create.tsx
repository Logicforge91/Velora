import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Landmark, UserRound } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import vendorsRoutes from '@/routes/admin/vendors';

type SellerFormData = {
    owner_name: string;
    owner_email: string;
    password: string;
    password_confirmation: string;
    business_name: string;
    business_email: string;
    business_phone: string;
    tax_number: string;
    address: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_ifsc: string;
    commission_rate: string;
    settlement_cycle: string;
};

const inputClass =
    'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:focus:border-orange-500/40';

export default function CreateSeller() {
    const form = useForm<SellerFormData>({
        owner_name: '',
        owner_email: '',
        password: '',
        password_confirmation: '',
        business_name: '',
        business_email: '',
        business_phone: '',
        tax_number: '',
        address: '',
        bank_account_name: '',
        bank_account_number: '',
        bank_ifsc: '',
        commission_rate: '10',
        settlement_cycle: 'weekly',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(vendorsRoutes.store.url());
    };

    return (
        <AdminLayout
            title="Add Seller"
            breadcrumb="Marketplace / Sellers / Add"
        >
            <div className="mx-auto max-w-5xl">
                <Link
                    href={vendorsRoutes.index.url()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-orange-600"
                >
                    <ArrowLeft className="size-4" />
                    Back to sellers
                </Link>

                <div className="mt-5">
                    <h1 className="text-2xl font-black tracking-tight">
                        Create seller application
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-500">
                        Create the owner account and business profile. The
                        seller remains pending until KYC and risk review are
                        complete.
                    </p>
                </div>

                <form onSubmit={submit} className="mt-6 grid gap-6">
                    <FormSection
                        icon={<UserRound className="size-5" />}
                        title="Account owner"
                        description="Credentials for the person responsible for this seller account."
                    >
                        <Field
                            label="Owner name"
                            error={form.errors.owner_name}
                        >
                            <input
                                value={form.data.owner_name}
                                onChange={(event) =>
                                    form.setData(
                                        'owner_name',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                                autoComplete="name"
                                required
                            />
                        </Field>
                        <Field
                            label="Owner email"
                            error={form.errors.owner_email}
                        >
                            <input
                                type="email"
                                value={form.data.owner_email}
                                onChange={(event) =>
                                    form.setData(
                                        'owner_email',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                                autoComplete="email"
                                required
                            />
                        </Field>
                        <Field
                            label="Temporary password"
                            error={form.errors.password}
                        >
                            <input
                                type="password"
                                value={form.data.password}
                                onChange={(event) =>
                                    form.setData('password', event.target.value)
                                }
                                className={inputClass}
                                autoComplete="new-password"
                                required
                            />
                        </Field>
                        <Field label="Confirm password">
                            <input
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(event) =>
                                    form.setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                                autoComplete="new-password"
                                required
                            />
                        </Field>
                    </FormSection>

                    <FormSection
                        icon={<Building2 className="size-5" />}
                        title="Business details"
                        description="Marketplace identity and primary contact information."
                    >
                        <Field
                            label="Business name"
                            error={form.errors.business_name}
                        >
                            <input
                                value={form.data.business_name}
                                onChange={(event) =>
                                    form.setData(
                                        'business_name',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                                required
                            />
                        </Field>
                        <Field
                            label="Business email"
                            error={form.errors.business_email}
                        >
                            <input
                                type="email"
                                value={form.data.business_email}
                                onChange={(event) =>
                                    form.setData(
                                        'business_email',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                                required
                            />
                        </Field>
                        <Field
                            label="Business phone"
                            error={form.errors.business_phone}
                        >
                            <input
                                value={form.data.business_phone}
                                onChange={(event) =>
                                    form.setData(
                                        'business_phone',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </Field>
                        <Field
                            label="GST / tax number"
                            error={form.errors.tax_number}
                        >
                            <input
                                value={form.data.tax_number}
                                onChange={(event) =>
                                    form.setData(
                                        'tax_number',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </Field>
                        <Field
                            label="Business address"
                            error={form.errors.address}
                            className="md:col-span-2"
                        >
                            <textarea
                                value={form.data.address}
                                onChange={(event) =>
                                    form.setData('address', event.target.value)
                                }
                                className={`${inputClass} h-24 py-3`}
                            />
                        </Field>
                    </FormSection>

                    <FormSection
                        icon={<Landmark className="size-5" />}
                        title="Commercial setup"
                        description="Optional payout details and marketplace settlement terms."
                    >
                        <Field
                            label="Account holder"
                            error={form.errors.bank_account_name}
                        >
                            <input
                                value={form.data.bank_account_name}
                                onChange={(event) =>
                                    form.setData(
                                        'bank_account_name',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </Field>
                        <Field
                            label="Account number"
                            error={form.errors.bank_account_number}
                        >
                            <input
                                value={form.data.bank_account_number}
                                onChange={(event) =>
                                    form.setData(
                                        'bank_account_number',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </Field>
                        <Field label="IFSC code" error={form.errors.bank_ifsc}>
                            <input
                                value={form.data.bank_ifsc}
                                onChange={(event) =>
                                    form.setData(
                                        'bank_ifsc',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </Field>
                        <Field
                            label="Commission rate (%)"
                            error={form.errors.commission_rate}
                        >
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={form.data.commission_rate}
                                onChange={(event) =>
                                    form.setData(
                                        'commission_rate',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                                required
                            />
                        </Field>
                        <Field
                            label="Settlement cycle"
                            error={form.errors.settlement_cycle}
                        >
                            <select
                                value={form.data.settlement_cycle}
                                onChange={(event) =>
                                    form.setData(
                                        'settlement_cycle',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="fortnightly">Fortnightly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </Field>
                    </FormSection>

                    <div className="flex justify-end gap-3">
                        <Link
                            href={vendorsRoutes.index.url()}
                            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-50"
                        >
                            {form.processing
                                ? 'Creating seller…'
                                : 'Create seller application'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

function FormSection({
    icon,
    title,
    description,
    children,
}: {
    icon: ReactNode;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <header className="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-7 dark:border-white/10">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                    {icon}
                </span>
                <div>
                    <h2 className="font-bold">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                </div>
            </header>
            <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-2">
                {children}
            </div>
        </section>
    );
}

function Field({
    label,
    error,
    className = '',
    children,
}: {
    label: string;
    error?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <label
            className={`text-sm font-semibold text-slate-700 dark:text-slate-200 ${className}`}
        >
            {label}
            {children}
            {error && (
                <span className="mt-1.5 block text-xs text-rose-600">
                    {error}
                </span>
            )}
        </label>
    );
}
