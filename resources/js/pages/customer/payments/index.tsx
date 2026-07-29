import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeIndianRupee,
    Banknote,
    Building2,
    Check,
    ChevronRight,
    CircleAlert,
    CreditCard,
    Download,
    Gift,
    KeyRound,
    LockKeyhole,
    RefreshCw,
    ShieldCheck,
    Smartphone,
    WalletCards,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { money } from '@/components/storefront/catalog';
import StorefrontLayout from '@/layouts/storefront-layout';
import { dashboard } from '@/routes';
import { store } from '@/routes/customer/payments';
import { checkout } from '@/routes/storefront';

type PaymentMethod =
    | 'credit_card'
    | 'debit_card'
    | 'upi'
    | 'net_banking'
    | 'wallet'
    | 'cash_on_delivery'
    | 'emi'
    | 'buy_now_pay_later'
    | 'gift_card'
    | 'reward_points'
    | 'saved_card';

type PaymentOption = {
    id: PaymentMethod;
    label: string;
    description: string;
    icon: LucideIcon;
};

type Transaction = {
    uuid: string;
    provider_reference: string;
    amount: string;
    status: 'succeeded' | 'authorized' | 'failed';
    gateway: string;
    failure_message: string | null;
    processed_at: string;
    metadata: {
        method: PaymentMethod;
        verified: boolean;
    };
    payment: {
        order: {
            number: string;
        };
    };
};

const paymentOptions: PaymentOption[] = [
    {
        id: 'credit_card',
        label: 'Credit card',
        description: 'Visa, Mastercard, RuPay',
        icon: CreditCard,
    },
    {
        id: 'debit_card',
        label: 'Debit card',
        description: 'All major Indian banks',
        icon: CreditCard,
    },
    {
        id: 'upi',
        label: 'UPI',
        description: 'UPI ID or secure QR',
        icon: Smartphone,
    },
    {
        id: 'net_banking',
        label: 'Net banking',
        description: '50+ supported banks',
        icon: Building2,
    },
    {
        id: 'wallet',
        label: 'Wallet',
        description: 'Paytm, PhonePe and more',
        icon: WalletCards,
    },
    {
        id: 'cash_on_delivery',
        label: 'Cash on delivery',
        description: 'Pay when your order arrives',
        icon: Banknote,
    },
    {
        id: 'emi',
        label: 'EMI',
        description: 'From ₹2,833 per month',
        icon: BadgeIndianRupee,
    },
    {
        id: 'buy_now_pay_later',
        label: 'Buy now, pay later',
        description: 'Pay in 30 days',
        icon: RefreshCw,
    },
    {
        id: 'gift_card',
        label: 'Gift card',
        description: 'Use Velora gift balance',
        icon: Gift,
    },
    {
        id: 'reward_points',
        label: 'Reward points',
        description: 'Redeem your 1,250 points',
        icon: ShieldCheck,
    },
];

export default function CustomerPayments({
    amount,
    paymentSessionId,
    recentTransactions,
    receipt,
}: {
    amount: number;
    paymentSessionId: string;
    recentTransactions: Transaction[];
    receipt: Transaction | null;
}) {
    const [method, setMethod] = useState<PaymentMethod>('upi');
    const [showAuthentication, setShowAuthentication] = useState(false);
    const [authenticationCode, setAuthenticationCode] = useState('');
    const requiresAuthentication = ![
        'cash_on_delivery',
        'gift_card',
        'reward_points',
    ].includes(method);
    const successfulReceipt =
        receipt?.status === 'succeeded' || receipt?.status === 'authorized';

    return (
        <StorefrontLayout>
            <Head title="Secure payment" />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <Link
                    href={checkout.url()}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600"
                >
                    <ArrowLeft className="size-4" /> Back to checkout
                </Link>

                <section className="relative mt-6 overflow-hidden rounded-[2.25rem] bg-slate-950 px-6 py-8 text-white sm:px-9">
                    <div className="absolute -top-28 right-0 size-80 rounded-full bg-emerald-500/20 blur-3xl" />
                    <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.16em] text-emerald-300 uppercase">
                                <LockKeyhole className="size-4" /> Secure
                                payment
                            </span>
                            <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                                Pay safely with Velora.
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                                Gateway-verified payments with duplicate-charge
                                protection and secure authentication.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
                            <p className="text-xs text-slate-300">Amount due</p>
                            <p className="mt-1 text-2xl font-black">
                                {money.format(amount)}
                            </p>
                        </div>
                    </div>
                </section>

                {receipt && (
                    <PaymentResult
                        transaction={receipt}
                        success={successfulReceipt}
                    />
                )}

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <section
                        id="payment-methods"
                        className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-white/5"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-black tracking-wider text-orange-600 uppercase">
                                    Payment method
                                </p>
                                <h2 className="mt-1 text-2xl font-black">
                                    Choose how to pay
                                </h2>
                            </div>
                            <ShieldCheck className="size-6 text-emerald-500" />
                        </div>

                        <Form
                            {...store.form()}
                            options={{ preserveScroll: true }}
                            className="mt-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <input
                                        type="hidden"
                                        name="payment_method"
                                        value={method}
                                    />
                                    <input
                                        type="hidden"
                                        name="idempotency_key"
                                        value={paymentSessionId}
                                    />
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <SavedPaymentCard
                                            selected={method === 'saved_card'}
                                            onSelect={() =>
                                                setMethod('saved_card')
                                            }
                                        />
                                        {paymentOptions.map((option) => (
                                            <PaymentMethodCard
                                                key={option.id}
                                                option={option}
                                                selected={method === option.id}
                                                onSelect={() => {
                                                    setMethod(option.id);
                                                    setShowAuthentication(
                                                        false,
                                                    );
                                                    setAuthenticationCode('');
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <InputError
                                        message={errors.payment_method}
                                    />

                                    <MethodDetails method={method} />

                                    {requiresAuthentication && (
                                        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                                            <div className="flex items-start gap-3">
                                                <KeyRound className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-black">
                                                        Secure authentication
                                                    </p>
                                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                                        A six-digit bank or
                                                        gateway challenge is
                                                        required. Sensitive
                                                        authentication data is
                                                        never stored.
                                                    </p>
                                                    {!showAuthentication ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowAuthentication(
                                                                    true,
                                                                )
                                                            }
                                                            className="mt-3 rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white"
                                                        >
                                                            Authenticate
                                                            securely
                                                        </button>
                                                    ) : (
                                                        <div className="mt-3">
                                                            <input
                                                                name="authentication_code"
                                                                value={
                                                                    authenticationCode
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    setAuthenticationCode(
                                                                        event.target.value
                                                                            .replace(
                                                                                /\D/g,
                                                                                '',
                                                                            )
                                                                            .slice(
                                                                                0,
                                                                                6,
                                                                            ),
                                                                    )
                                                                }
                                                                inputMode="numeric"
                                                                autoComplete="one-time-code"
                                                                placeholder="Enter 6-digit code"
                                                                className="h-11 w-full max-w-xs rounded-xl border border-emerald-200 bg-white px-4 text-sm font-black tracking-[0.3em] outline-none dark:bg-slate-900"
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors.authentication_code
                                                                }
                                                            />
                                                            <p className="mt-2 text-[10px] text-slate-400">
                                                                Demo: use 000000
                                                                to exercise
                                                                payment failure
                                                                and retry.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {[
                                        'credit_card',
                                        'debit_card',
                                        'saved_card',
                                    ].includes(method) && (
                                        <label className="mt-4 flex items-center gap-3 text-sm font-bold">
                                            <input
                                                type="checkbox"
                                                name="save_payment_method"
                                                value="1"
                                                className="size-4 accent-orange-500"
                                            />
                                            Save this payment method securely
                                            for future orders
                                        </label>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            (requiresAuthentication &&
                                                authenticationCode.length !== 6)
                                        }
                                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-orange-500"
                                    >
                                        {processing ? (
                                            <RefreshCw className="size-4 animate-spin" />
                                        ) : (
                                            <LockKeyhole className="size-4" />
                                        )}
                                        {receipt?.status === 'failed'
                                            ? 'Retry payment securely'
                                            : `Pay ${money.format(amount)}`}
                                    </button>
                                    <p className="mt-3 text-center text-[10px] leading-5 text-slate-400">
                                        One idempotency key is used per attempt,
                                        preventing duplicate payments if the
                                        button is pressed twice.
                                    </p>
                                </>
                            )}
                        </Form>
                    </section>

                    <aside className="grid h-fit gap-5">
                        <SecurityCard />
                        <RecentPayments transactions={recentTransactions} />
                    </aside>
                </div>
            </main>
        </StorefrontLayout>
    );
}

function PaymentMethodCard({
    option,
    selected,
    onSelect,
}: {
    option: PaymentOption;
    selected: boolean;
    onSelect: () => void;
}) {
    const Icon = option.icon;

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 hover:border-orange-300 dark:border-white/10'}`}
        >
            <div className="flex items-start justify-between gap-3">
                <Icon className="size-5 text-orange-500" />
                {selected && <Check className="size-4 text-emerald-600" />}
            </div>
            <p className="mt-3 text-sm font-black">{option.label}</p>
            <p className="mt-1 text-xs text-slate-500">{option.description}</p>
        </button>
    );
}

function SavedPaymentCard({
    selected,
    onSelect,
}: {
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 hover:border-orange-300 dark:border-white/10'}`}
        >
            <div className="flex items-start justify-between gap-3">
                <CreditCard className="size-5 text-violet-500" />
                <span className="rounded-full bg-violet-50 px-2 py-1 text-[9px] font-black text-violet-700 uppercase">
                    Saved
                </span>
            </div>
            <p className="mt-3 text-sm font-black">Visa ending 4242</p>
            <p className="mt-1 text-xs text-slate-500">Expires 08/29</p>
        </button>
    );
}

function MethodDetails({ method }: { method: PaymentMethod }) {
    if (['credit_card', 'debit_card'].includes(method)) {
        return (
            <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2 dark:bg-white/5">
                <PaymentInput
                    label="Card number"
                    placeholder="•••• •••• •••• ••••"
                />
                <PaymentInput label="Name on card" placeholder="Cardholder" />
                <PaymentInput label="Expiry" placeholder="MM / YY" />
                <PaymentInput label="CVV" placeholder="•••" />
            </div>
        );
    }

    if (method === 'upi') {
        return (
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                <PaymentInput label="UPI ID" placeholder="name@bank" />
            </div>
        );
    }

    if (method === 'net_banking') {
        return (
            <label className="mt-5 grid gap-2 text-xs font-black">
                Select your bank
                <select className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm dark:border-white/10 dark:bg-white/5">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                </select>
            </label>
        );
    }

    if (method === 'emi') {
        return (
            <label className="mt-5 grid gap-2 text-xs font-black">
                EMI plan
                <select className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm dark:border-white/10 dark:bg-white/5">
                    <option>3 months · ₹11,620/month</option>
                    <option>6 months · ₹5,944/month</option>
                    <option>12 months · ₹3,079/month</option>
                </select>
            </label>
        );
    }

    return null;
}

function PaymentInput({
    label,
    placeholder,
}: {
    label: string;
    placeholder: string;
}) {
    return (
        <label className="grid gap-2 text-xs font-black">
            {label}
            <input
                placeholder={placeholder}
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-slate-900"
            />
        </label>
    );
}

function PaymentResult({
    transaction,
    success,
}: {
    transaction: Transaction;
    success: boolean;
}) {
    return (
        <section
            className={`mt-6 rounded-[1.75rem] border p-5 sm:p-6 ${success ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10' : 'border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10'}`}
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                    <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full ${success ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
                    >
                        {success ? (
                            <Check className="size-5" />
                        ) : (
                            <CircleAlert className="size-5" />
                        )}
                    </span>
                    <div>
                        <h2 className="font-black">
                            {success
                                ? 'Payment verified'
                                : 'Payment could not be completed'}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {success
                                ? `Receipt for ${transaction.payment.order.number}`
                                : transaction.failure_message}
                        </p>
                        <p className="mt-2 text-xs font-bold text-slate-500">
                            Transaction {transaction.uuid} ·{' '}
                            {money.format(Number(transaction.amount))}
                        </p>
                    </div>
                </div>
                {success ? (
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-black text-white"
                    >
                        <Download className="size-4" /> Payment receipt
                    </button>
                ) : (
                    <a
                        href="#payment-methods"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-black text-white"
                    >
                        <RefreshCw className="size-4" /> Retry payment
                    </a>
                )}
            </div>
        </section>
    );
}

function SecurityCard() {
    return (
        <section className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
            <LockKeyhole className="size-6 text-emerald-400" />
            <h2 className="mt-4 text-lg font-black">
                Protected by secure authentication
            </h2>
            <div className="mt-4 grid gap-3 text-xs text-slate-300">
                {[
                    'Gateway response verification',
                    'Duplicate-payment prevention',
                    'Authentication details are never stored',
                    'Retry-safe payment sessions',
                ].map((item) => (
                    <p key={item} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                        {item}
                    </p>
                ))}
            </div>
        </section>
    );
}

function RecentPayments({ transactions }: { transactions: Transaction[] }) {
    return (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-black">Recent payment attempts</h2>
            {transactions.length > 0 ? (
                <div className="mt-4 grid gap-3">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.uuid}
                            className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-white/10"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-xs font-black">
                                    {transaction.payment.order.number}
                                </p>
                                <p className="mt-1 text-[10px] text-slate-400 capitalize">
                                    {transaction.metadata.method.replaceAll(
                                        '_',
                                        ' ',
                                    )}
                                </p>
                            </div>
                            <span
                                className={`text-[10px] font-black uppercase ${transaction.status === 'failed' ? 'text-rose-500' : 'text-emerald-600'}`}
                            >
                                {transaction.status}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-3 text-xs text-slate-500">
                    No payment attempts yet.
                </p>
            )}
            <Link
                href={dashboard()}
                className="mt-4 inline-flex items-center gap-1 text-xs font-black text-orange-600"
            >
                View account <ChevronRight className="size-3.5" />
            </Link>
        </section>
    );
}
