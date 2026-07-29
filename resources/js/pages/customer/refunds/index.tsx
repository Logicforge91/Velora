import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CircleAlert,
    RefreshCw,
    WalletCards,
} from 'lucide-react';
import { useState } from 'react';
import { money } from '@/components/storefront/catalog';
import StorefrontLayout from '@/layouts/storefront-layout';
import { index as ordersIndex } from '@/routes/customer/orders';
import { retry, store } from '@/routes/customer/refunds';

type Refund = {
    id: number;
    number: string;
    amount: string;
    status: string;
    provider_reference: string | null;
    failure_reason: string | null;
    requested_at: string;
    processed_at: string | null;
    metadata: {
        refund_method?: string;
        refund_type?: string;
        retry_of?: number;
    } | null;
    payment: { order: { number: string } };
};

type RefundableOrder = {
    id: number;
    number: string;
    total: string;
    payment: {
        amount: string;
        refunds: Refund[];
    };
};

export default function RefundCenter({
    orders,
    refunds,
}: {
    orders: RefundableOrder[];
    refunds: Refund[];
}) {
    const [refundType, setRefundType] = useState('full');

    return (
        <StorefrontLayout>
            <Head title="Refund center" />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <Link
                    href={ordersIndex()}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600"
                >
                    <ArrowLeft className="size-4" /> Order history
                </Link>
                <section className="mt-6 rounded-[2rem] bg-slate-950 p-7 text-white sm:p-9">
                    <p className="text-xs font-black tracking-wider text-emerald-300 uppercase">
                        Payments
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                        Refund center
                    </h1>
                    <p className="mt-3 text-sm text-slate-300">
                        Initiate eligible refunds and track every settlement
                        using its unique reference.
                    </p>
                </section>

                <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="grid content-start gap-4">
                        <h2 className="text-xl font-black">Refund timeline</h2>
                        {refunds.length ? (
                            refunds.map((refund) => (
                                <RefundCard key={refund.id} refund={refund} />
                            ))
                        ) : (
                            <div className="rounded-[1.75rem] border border-dashed border-slate-300 p-10 text-center dark:border-white/10">
                                <WalletCards className="mx-auto size-8 text-slate-300" />
                                <p className="mt-3 font-black">
                                    No refunds initiated
                                </p>
                            </div>
                        )}
                    </section>

                    <aside className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-5 lg:sticky lg:top-28 dark:border-white/10 dark:bg-white/5">
                        <h2 className="text-xl font-black">
                            Initiate a refund
                        </h2>
                        <Form
                            {...store.form()}
                            options={{ preserveScroll: true }}
                            resetOnSuccess
                            className="mt-5 grid gap-4"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <Field
                                        label="Paid order"
                                        error={errors.order_id}
                                    >
                                        <select name="order_id" required>
                                            <option value="">
                                                Select an order
                                            </option>
                                            {orders.map((order) => (
                                                <option
                                                    key={order.id}
                                                    value={order.id}
                                                >
                                                    {order.number} ·{' '}
                                                    {money.format(
                                                        Number(
                                                            order.payment
                                                                .amount,
                                                        ),
                                                    )}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field
                                        label="Refund type"
                                        error={errors.refund_type}
                                    >
                                        <select
                                            name="refund_type"
                                            value={refundType}
                                            onChange={(event) =>
                                                setRefundType(
                                                    event.target.value,
                                                )
                                            }
                                        >
                                            <option value="full">
                                                Full available balance
                                            </option>
                                            <option value="partial">
                                                Partial refund
                                            </option>
                                        </select>
                                    </Field>
                                    {refundType === 'partial' && (
                                        <Field
                                            label="Refund amount"
                                            error={errors.amount}
                                        >
                                            <input
                                                type="number"
                                                name="amount"
                                                min="1"
                                                step="0.01"
                                                required
                                                placeholder="₹0.00"
                                            />
                                        </Field>
                                    )}
                                    <Field
                                        label="Refund destination"
                                        error={errors.refund_method}
                                    >
                                        <select
                                            name="refund_method"
                                            defaultValue="original_payment"
                                        >
                                            <option value="original_payment">
                                                Original payment method
                                            </option>
                                            <option value="wallet">
                                                Velora wallet
                                            </option>
                                            <option value="bank_account">
                                                Verified bank account
                                            </option>
                                        </select>
                                    </Field>
                                    <Field label="Reason" error={errors.reason}>
                                        <textarea
                                            name="reason"
                                            rows={3}
                                            required
                                            placeholder="Why are you requesting this refund?"
                                        />
                                    </Field>
                                    <button
                                        type="submit"
                                        disabled={
                                            processing || orders.length === 0
                                        }
                                        className="rounded-full bg-orange-500 px-5 py-3.5 text-sm font-black text-white disabled:opacity-40"
                                    >
                                        {processing
                                            ? 'Validating balance…'
                                            : 'Initiate refund'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </aside>
                </div>
            </main>
        </StorefrontLayout>
    );
}

function RefundCard({ refund }: { refund: Refund }) {
    const stages = ['requested', 'approved', 'processing', 'completed'];
    const statusIndex = stages.indexOf(refund.status);
    const failed = refund.status === 'failed';

    return (
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase">
                        Refund reference
                    </p>
                    <h3 className="mt-1 font-black">{refund.number}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Order {refund.payment.order.number} ·{' '}
                        {refund.metadata?.refund_method?.replaceAll('_', ' ') ??
                            'Original payment'}
                    </p>
                    {refund.provider_reference && (
                        <p className="mt-1 text-[10px] text-slate-400">
                            Provider: {refund.provider_reference}
                        </p>
                    )}
                </div>
                <div className="text-right">
                    <p className="font-black">
                        {money.format(Number(refund.amount))}
                    </p>
                    <span
                        className={`text-[10px] font-black uppercase ${failed ? 'text-rose-500' : 'text-emerald-600'}`}
                    >
                        {refund.status}
                    </span>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2">
                {stages.map((stage, index) => (
                    <div key={stage}>
                        <div
                            className={`grid h-7 place-items-center rounded-full text-xs ${statusIndex >= index ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-white/5'}`}
                        >
                            {statusIndex >= index ? (
                                <Check className="size-3.5" />
                            ) : (
                                index + 1
                            )}
                        </div>
                        <p className="mt-1.5 text-center text-[8px] font-bold text-slate-500 capitalize">
                            {stage}
                        </p>
                    </div>
                ))}
            </div>
            {failed && (
                <div className="mt-5 rounded-xl bg-rose-50 p-4 dark:bg-rose-500/10">
                    <p className="flex gap-2 text-xs font-bold text-rose-600">
                        <CircleAlert className="size-4 shrink-0" />
                        {refund.failure_reason ??
                            'The payment provider could not complete this refund.'}
                    </p>
                    <Form
                        {...retry.form(refund.id)}
                        options={{ preserveScroll: true }}
                        className="mt-3 flex flex-col gap-2 sm:flex-row"
                    >
                        {({ processing }) => (
                            <>
                                <select
                                    name="refund_method"
                                    defaultValue={
                                        refund.metadata?.refund_method ??
                                        'original_payment'
                                    }
                                    className="h-10 min-w-0 flex-1 rounded-xl border border-rose-200 bg-white px-3 text-xs dark:border-rose-500/20 dark:bg-slate-950"
                                >
                                    <option value="original_payment">
                                        Original payment
                                    </option>
                                    <option value="wallet">Wallet</option>
                                    <option value="bank_account">
                                        Bank account
                                    </option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white"
                                >
                                    <RefreshCw className="size-3.5" /> Retry
                                </button>
                            </>
                        )}
                    </Form>
                </div>
            )}
        </article>
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
        <label className="grid gap-1.5 text-xs font-black [&_input]:h-11 [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-200 [&_input]:bg-transparent [&_input]:px-3 dark:[&_input]:border-white/10 [&_select]:h-11 [&_select]:rounded-xl [&_select]:border [&_select]:border-slate-200 [&_select]:bg-transparent [&_select]:px-3 dark:[&_select]:border-white/10 [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-slate-200 [&_textarea]:bg-transparent [&_textarea]:p-3 dark:[&_textarea]:border-white/10">
            {label}
            {children}
            {error && <span className="text-rose-500">{error}</span>}
        </label>
    );
}
