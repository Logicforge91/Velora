import { router, useForm } from '@inertiajs/react';
import {
    Banknote,
    CheckCircle2,
    RotateCcw,
    Search,
    WalletCards,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import paymentsRoutes from '@/routes/admin/payments';
import type { Counts, Paginated, Payment } from '@/types/admin';
const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});
const control =
    'mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]';
export default function PaymentsIndex({
    payments,
    counts,
}: {
    payments: Paginated<Payment>;
    counts: Counts;
}) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            paymentsRoutes.index.url(),
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Payment Operations" breadcrumb="Finance / Payments">
            <div>
                <h2 className="text-xl font-black">Payments and refunds</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Reconcile transactions and control refund exposure.
                </p>
            </div>
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Transactions',
                            value: counts.total,
                            icon: WalletCards,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Captured',
                            value: counts.paid,
                            icon: CheckCircle2,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                        {
                            label: 'Refunded',
                            value: counts.refunded,
                            icon: RotateCcw,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'Collected',
                            value: money.format(counts.collected),
                            icon: Banknote,
                            tone: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10',
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
                            placeholder="Order or transaction ID"
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
                            'paid',
                            'failed',
                            'partially_refunded',
                            'refunded',
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
                    {payments.data.map((payment) => (
                        <PaymentRow key={payment.id} payment={payment} />
                    ))}
                    {payments.data.length === 0 && (
                        <div className="p-14 text-center text-sm text-slate-500">
                            No payment records found.
                        </div>
                    )}
                </div>
                <Pagination links={payments.links} />
            </section>
        </AdminLayout>
    );
}
function PaymentRow({ payment }: { payment: Payment }) {
    const form = useForm({
        status: payment.status,
        refunded_amount: payment.refunded_amount,
        transaction_id: payment.transaction_id ?? '',
    });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.put(paymentsRoutes.update.url(payment.id), {
            preserveScroll: true,
        });
    };

    return (
        <form
            onSubmit={submit}
            className="grid gap-4 p-5 lg:grid-cols-[1fr_10rem_11rem_11rem_auto] lg:items-end"
        >
            <div>
                <p className="font-black">{payment.order.number}</p>
                <p className="text-xs text-slate-500">
                    {payment.order.user.name} · {payment.provider}
                </p>
                <p className="mt-2 text-sm font-bold">
                    {money.format(Number(payment.amount))}
                </p>
            </div>
            <Field label="Status">
                <select
                    value={form.data.status}
                    onChange={(e) =>
                        form.setData(
                            'status',
                            e.target.value as Payment['status'],
                        )
                    }
                    className={control}
                >
                    {[
                        'pending',
                        'paid',
                        'failed',
                        'partially_refunded',
                        'refunded',
                    ].map((v) => (
                        <option key={v} value={v}>
                            {v.replaceAll('_', ' ')}
                        </option>
                    ))}
                </select>
            </Field>
            <Field label="Refund amount" error={form.errors.refunded_amount}>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.data.refunded_amount}
                    onChange={(e) =>
                        form.setData('refunded_amount', e.target.value)
                    }
                    className={control}
                />
            </Field>
            <Field label="Transaction ID">
                <input
                    value={form.data.transaction_id}
                    onChange={(e) =>
                        form.setData('transaction_id', e.target.value)
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
