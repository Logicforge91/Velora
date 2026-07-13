import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/settlements';
import type { Settlement } from '@/types/admin';
const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});
export default function Show({
    settlement,
    statuses,
}: {
    settlement: Settlement;
    statuses: string[];
}) {
    const form = useForm({
        status: settlement.status,
        transaction_reference: settlement.transaction_reference ?? '',
        notes: settlement.notes ?? '',
    });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.put(routes.update.url(settlement.id), { preserveScroll: true });
    };
    const lines = [
        ['Gross seller sales', settlement.gross_sales],
        ['Marketplace commission', `-${settlement.commission_amount}`],
        ['Shipping fee', `-${settlement.shipping_fee}`],
        ['Tax withheld', `-${settlement.tax_withheld}`],
        ['Refund deductions', `-${settlement.refund_deductions}`],
        ['Adjustments', settlement.adjustments],
    ];

    return (
        <AdminLayout
            title={settlement.number}
            breadcrumb="Finance / Seller settlement"
        >
            <Link
                href={routes.index.url()}
                className="text-sm font-bold text-slate-500"
            >
                ← Back to settlements
            </Link>
            <div className="mt-5 grid gap-6 xl:grid-cols-[1fr_22rem]">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs font-bold text-orange-600 uppercase">
                        {settlement.vendor.business_name}
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                        {money.format(Number(settlement.net_amount))}
                    </h2>
                    <p className="text-sm text-slate-500">
                        Payable for {settlement.period_start.slice(0, 10)} —{' '}
                        {settlement.period_end.slice(0, 10)}
                    </p>
                    <div className="mt-6 divide-y divide-slate-100 dark:divide-white/5">
                        {lines.map(([label, value]) => (
                            <div
                                key={label}
                                className="flex justify-between py-4 text-sm"
                            >
                                <span className="text-slate-500">{label}</span>
                                <span className="font-black">
                                    {money.format(Number(value))}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
                <form
                    onSubmit={submit}
                    className="h-fit rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5"
                >
                    <h2 className="font-black">Payout workflow</h2>
                    <select
                        value={form.data.status}
                        onChange={(e) => form.setData('status', e.target.value)}
                        className="mt-5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-white/10 dark:bg-[#101722]"
                    >
                        {statuses.map((v) => (
                            <option key={v} value={v}>
                                {v}
                            </option>
                        ))}
                    </select>
                    <input
                        value={form.data.transaction_reference}
                        onChange={(e) =>
                            form.setData(
                                'transaction_reference',
                                e.target.value,
                            )
                        }
                        placeholder="Bank UTR / transaction reference"
                        className="mt-4 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-white/5"
                    />
                    <textarea
                        rows={4}
                        value={form.data.notes}
                        onChange={(e) => form.setData('notes', e.target.value)}
                        placeholder="Finance notes"
                        className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-white/10 dark:bg-white/5"
                    />
                    <button
                        disabled={form.processing}
                        className="mt-4 h-11 w-full rounded-xl bg-orange-500 text-sm font-bold text-white"
                    >
                        Update payout
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
