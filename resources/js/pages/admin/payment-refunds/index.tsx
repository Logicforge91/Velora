import { router, useForm } from '@inertiajs/react';
import { Banknote, CheckCircle2, RotateCcw, Search, Timer } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/payment-refunds';
import type { Counts, Paginated, PaymentRefund } from '@/types/admin';

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});
const control =
    'h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]';

export default function PaymentRefundsIndex({
    refunds,
    counts,
}: {
    refunds: Paginated<PaymentRefund>;
    counts: Counts;
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
        <AdminLayout title="Refunds" breadcrumb="Finance / Refunds">
            <div>
                <h2 className="text-xl font-black">
                    Refund approval and reconciliation
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Process refund requests through an auditable state workflow.
                </p>
            </div>
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'All refunds',
                            value: counts.total,
                            icon: RotateCcw,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Requested',
                            value: counts.requested,
                            icon: Timer,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'In progress',
                            value: counts.processing,
                            icon: Banknote,
                            tone: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10',
                        },
                        {
                            label: 'Completed value',
                            value: money.format(counts.completed_amount),
                            icon: CheckCircle2,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                    ]}
                />
            </div>
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
                            placeholder="Refund, provider or order reference"
                            className={`${control} pl-9`}
                        />
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={control + ' sm:w-48'}
                    >
                        <option value="">All statuses</option>
                        {[
                            'requested',
                            'approved',
                            'processing',
                            'completed',
                            'failed',
                            'rejected',
                        ].map((value) => (
                            <option key={value}>{value}</option>
                        ))}
                    </select>
                    <button className="h-10 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {refunds.data.map((refund) => (
                        <RefundRow key={refund.id} refund={refund} />
                    ))}
                    {refunds.data.length === 0 && (
                        <p className="p-14 text-center text-sm text-slate-500">
                            No refund records found.
                        </p>
                    )}
                </div>
                <Pagination links={refunds.links} />
            </section>
        </AdminLayout>
    );
}

function RefundRow({ refund }: { refund: PaymentRefund }) {
    const form = useForm({
        status: refund.status,
        provider_reference: refund.provider_reference ?? '',
        failure_reason: refund.failure_reason ?? '',
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.patch(routes.update.url(refund.id), { preserveScroll: true });
    };

    return (
        <form
            onSubmit={submit}
            className="grid gap-4 p-5 lg:grid-cols-[minmax(16rem,1fr)_11rem_14rem_auto] lg:items-end"
        >
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black">{refund.number}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold capitalize dark:bg-white/10">
                        {refund.status}
                    </span>
                </div>
                <p className="text-xs text-slate-500">
                    Order {refund.payment.order.number} ·{' '}
                    {refund.payment.order.user.name} ·{' '}
                    {refund.reason_code.replaceAll('_', ' ')}
                </p>
                <p className="mt-2 text-base font-black text-orange-600">
                    {money.format(Number(refund.amount))}
                </p>
            </div>
            <Field label="Workflow status">
                <select
                    value={form.data.status}
                    onChange={(e) =>
                        form.setData(
                            'status',
                            e.target.value as PaymentRefund['status'],
                        )
                    }
                    className={control}
                >
                    {[
                        'requested',
                        'approved',
                        'processing',
                        'completed',
                        'failed',
                        'rejected',
                    ].map((value) => (
                        <option key={value}>{value}</option>
                    ))}
                </select>
            </Field>
            <Field label="Provider reference">
                <input
                    value={form.data.provider_reference}
                    onChange={(e) =>
                        form.setData('provider_reference', e.target.value)
                    }
                    className={control}
                />
            </Field>
            <button
                disabled={form.processing}
                className="h-10 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white disabled:opacity-50"
            >
                Update
            </button>
            {form.data.status === 'failed' && (
                <div className="lg:col-span-full">
                    <Field label="Failure reason">
                        <textarea
                            value={form.data.failure_reason}
                            onChange={(e) =>
                                form.setData('failure_reason', e.target.value)
                            }
                            className="mt-1 min-h-20 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                        />
                    </Field>
                </div>
            )}
            {Object.values(form.errors)[0] && (
                <p className="text-xs text-rose-600 lg:col-span-full">
                    {Object.values(form.errors)[0]}
                </p>
            )}
        </form>
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
