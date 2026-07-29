import { Head, Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Check,
    ChevronRight,
    CircleAlert,
    Clock3,
    CreditCard,
    Gift,
    LockKeyhole,
    MapPin,
    PackageCheck,
    Plus,
    ShieldCheck,
    Sparkles,
    Tag,
    Truck,
    WalletCards,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { money, products } from '@/components/storefront/catalog';
import ProductImage from '@/components/storefront/product-image';
import StorefrontLayout from '@/layouts/storefront-layout';
import { login } from '@/routes';
import { index as addressesIndex } from '@/routes/customer/addresses';
import { index as securePayment } from '@/routes/customer/payments';
import { cart, shippingDelivery } from '@/routes/storefront';

type CheckoutAddress = {
    id: number;
    type: string;
    label: string | null;
    recipient_name: string;
    phone: string;
    line_1: string;
    line_2: string | null;
    landmark: string | null;
    city: string;
    state: string;
    postal_code: string;
    is_default_shipping: boolean;
    is_serviceable: boolean;
};

const checkoutItems = [
    { product: products[0], quantity: 1 },
    { product: products[1], quantity: 2 },
];

export default function Checkout({
    addresses,
}: {
    addresses: CheckoutAddress[];
}) {
    const { auth } = usePage().props;
    const { url } = usePage();
    const requestedCoupon =
        new URLSearchParams(url.split('?')[1] ?? '').get('coupon') ?? '';
    const isAuthenticated = Boolean(auth.user);
    const [deliveryAddressId, setDeliveryAddressId] = useState(
        addresses.find((address) => address.is_default_shipping)?.id ??
            addresses[0]?.id ??
            0,
    );
    const [billingAddressId, setBillingAddressId] = useState(deliveryAddressId);
    const [billingSame, setBillingSame] = useState(true);
    const [deliveryMethod, setDeliveryMethod] = useState('standard');
    const [deliverySlot, setDeliverySlot] = useState('Tomorrow · 9 AM–1 PM');
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [couponCode, setCouponCode] = useState(requestedCoupon);
    const [giftCardCode, setGiftCardCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(
        requestedCoupon === 'VELORA10',
    );
    const [giftCardApplied, setGiftCardApplied] = useState(false);
    const [rewardsApplied, setRewardsApplied] = useState(false);
    const [giftWrapping, setGiftWrapping] = useState(false);
    const [orderNotes, setOrderNotes] = useState('');
    const [guestAddressComplete, setGuestAddressComplete] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const selectedDeliveryAddress = addresses.find(
        (address) => address.id === deliveryAddressId,
    );

    const totals = useMemo(() => {
        const subtotal = checkoutItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0,
        );
        const itemTax = subtotal * 0.18;
        const coupon = couponApplied ? Math.min(subtotal * 0.1, 1000) : 0;
        const giftCard = giftCardApplied ? 500 : 0;
        const rewards = rewardsApplied ? 250 : 0;
        const shipping =
            deliveryMethod === 'express'
                ? 149
                : deliveryMethod === 'same-day'
                  ? 249
                  : deliveryMethod === 'scheduled'
                    ? 79
                    : 0;
        const wrapping = giftWrapping ? 99 : 0;
        const total = Math.max(
            0,
            subtotal - coupon - giftCard - rewards + shipping + wrapping,
        );

        return {
            subtotal,
            itemTax,
            coupon,
            giftCard,
            rewards,
            shipping,
            wrapping,
            total,
        };
    }, [
        couponApplied,
        deliveryMethod,
        giftCardApplied,
        giftWrapping,
        rewardsApplied,
    ]);

    const placeOrder = () => {
        if (
            isAuthenticated &&
            (!selectedDeliveryAddress ||
                !selectedDeliveryAddress.is_serviceable)
        ) {
            setValidationMessage(
                'Select a serviceable delivery address before continuing.',
            );

            return;
        }

        if (!isAuthenticated && !guestAddressComplete) {
            setValidationMessage(
                'Complete the guest delivery address before continuing.',
            );

            return;
        }

        if (!paymentMethod || !deliverySlot) {
            setValidationMessage('Choose a delivery slot and payment method.');

            return;
        }

        setValidationMessage('');
        setConfirmed(true);
    };

    if (confirmed) {
        return <OrderConfirmation total={totals.total} />;
    }

    return (
        <StorefrontLayout>
            <Head title="Secure checkout" />
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                    <Link href={cart.url()} className="hover:text-orange-500">
                        Cart
                    </Link>
                    <ChevronRight className="size-3" />
                    <span>Secure checkout</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <LockKeyhole className="size-5" />
                    </span>
                    <div>
                        <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                            Checkout
                        </h1>
                        <p className="text-sm text-slate-500">
                            Guest-friendly, protected, and easy to review.
                        </p>
                    </div>
                </div>

                {!isAuthenticated && (
                    <div className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-4 sm:flex-row sm:items-center dark:border-violet-500/20 dark:bg-violet-500/10">
                        <p className="text-sm font-bold">
                            Checking out as a guest? You can continue below or
                            sign in for saved addresses and rewards.
                        </p>
                        <Link
                            href={login.url({
                                query: { redirect: '/checkout' },
                            })}
                            className="rounded-full bg-violet-600 px-5 py-2.5 text-center text-xs font-black text-white"
                        >
                            Login during checkout
                        </Link>
                    </div>
                )}

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_390px]">
                    <div className="grid content-start gap-6">
                        <CheckoutCard
                            icon={MapPin}
                            number="01"
                            title="Delivery address"
                        >
                            {isAuthenticated ? (
                                <>
                                    <AddressSelector
                                        addresses={addresses}
                                        selectedId={deliveryAddressId}
                                        onSelect={setDeliveryAddressId}
                                    />
                                    <Link
                                        href={addressesIndex()}
                                        className="mt-4 inline-flex items-center gap-2 text-xs font-black text-orange-600"
                                    >
                                        <Plus className="size-4" /> Add new
                                        delivery address
                                    </Link>
                                </>
                            ) : (
                                <GuestAddressForm
                                    onCompleteChange={setGuestAddressComplete}
                                />
                            )}
                        </CheckoutCard>

                        <CheckoutCard
                            icon={MapPin}
                            number="02"
                            title="Billing address"
                        >
                            <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm font-black dark:bg-white/5">
                                <input
                                    type="checkbox"
                                    checked={billingSame}
                                    onChange={(event) =>
                                        setBillingSame(event.target.checked)
                                    }
                                    className="size-4 accent-orange-500"
                                />
                                Same as delivery address
                            </label>
                            {!billingSame &&
                                (isAuthenticated ? (
                                    <div className="mt-4">
                                        <AddressSelector
                                            addresses={addresses}
                                            selectedId={billingAddressId}
                                            onSelect={setBillingAddressId}
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <GuestAddressForm
                                            compact
                                            onCompleteChange={() => undefined}
                                        />
                                    </div>
                                ))}
                        </CheckoutCard>

                        <CheckoutCard
                            icon={Truck}
                            number="03"
                            title="Delivery method & slot"
                        >
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {[
                                    ['standard', 'Standard', 'Free · 3–5 days'],
                                    ['express', 'Express', '₹149 · 1–2 days'],
                                    [
                                        'same-day',
                                        'Same day',
                                        '₹249 · order before noon',
                                    ],
                                    [
                                        'scheduled',
                                        'Scheduled',
                                        '₹79 · choose time',
                                    ],
                                    [
                                        'pickup',
                                        'Store pickup',
                                        'Free · ready in 2 hours',
                                    ],
                                ].map(([value, label, detail]) => (
                                    <ChoiceCard
                                        key={value}
                                        name="delivery"
                                        value={value}
                                        checked={deliveryMethod === value}
                                        onChange={setDeliveryMethod}
                                        label={label}
                                        detail={detail}
                                    />
                                ))}
                            </div>
                            <Link
                                href={shippingDelivery.url()}
                                className="mt-4 inline-flex items-center gap-2 text-xs font-black text-orange-600"
                            >
                                Delivery details and shipment tracking
                                <ChevronRight className="size-3.5" />
                            </Link>
                            <label className="mt-4 grid gap-2 text-xs font-black">
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays className="size-4 text-orange-500" />
                                    Delivery slot
                                </span>
                                <select
                                    value={deliverySlot}
                                    onChange={(event) =>
                                        setDeliverySlot(event.target.value)
                                    }
                                    className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                                >
                                    <option>Tomorrow · 9 AM–1 PM</option>
                                    <option>Tomorrow · 2 PM–6 PM</option>
                                    <option>Saturday · 9 AM–1 PM</option>
                                </select>
                            </label>
                        </CheckoutCard>

                        <CheckoutCard
                            icon={Gift}
                            number="04"
                            title="Extras & notes"
                        >
                            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
                                <input
                                    type="checkbox"
                                    checked={giftWrapping}
                                    onChange={(event) =>
                                        setGiftWrapping(event.target.checked)
                                    }
                                    className="size-4 accent-orange-500"
                                />
                                <span className="text-sm font-black">
                                    Add gift wrapping
                                    <span className="block text-xs font-medium text-slate-500">
                                        Premium wrap and message card · ₹99
                                    </span>
                                </span>
                            </label>
                            <label className="mt-4 grid gap-2 text-xs font-black">
                                Order notes
                                <textarea
                                    value={orderNotes}
                                    onChange={(event) =>
                                        setOrderNotes(event.target.value)
                                    }
                                    maxLength={500}
                                    rows={3}
                                    placeholder="Special delivery or gift instructions…"
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
                                />
                                <span className="text-right font-medium text-slate-400">
                                    {orderNotes.length}/500
                                </span>
                            </label>
                        </CheckoutCard>

                        <CheckoutCard
                            icon={CreditCard}
                            number="05"
                            title="Payment method"
                        >
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    ['upi', 'UPI / QR', 'Instant confirmation'],
                                    [
                                        'card',
                                        'Credit or debit card',
                                        'Visa, Mastercard, RuPay',
                                    ],
                                    [
                                        'wallet',
                                        'Wallet',
                                        'Paytm, PhonePe & more',
                                    ],
                                    [
                                        'cod',
                                        'Cash on delivery',
                                        'Pay when delivered',
                                    ],
                                ].map(([value, label, detail]) => (
                                    <ChoiceCard
                                        key={value}
                                        name="payment"
                                        value={value}
                                        checked={paymentMethod === value}
                                        onChange={setPaymentMethod}
                                        label={label}
                                        detail={detail}
                                    />
                                ))}
                            </div>
                            {isAuthenticated && (
                                <Link
                                    href={securePayment.url()}
                                    className="mt-4 inline-flex items-center gap-2 text-xs font-black text-orange-600"
                                >
                                    Open secure gateway payment
                                    <ChevronRight className="size-3.5" />
                                </Link>
                            )}
                        </CheckoutCard>
                    </div>

                    <OrderSummary
                        couponCode={couponCode}
                        setCouponCode={setCouponCode}
                        couponApplied={couponApplied}
                        setCouponApplied={setCouponApplied}
                        giftCardCode={giftCardCode}
                        setGiftCardCode={setGiftCardCode}
                        giftCardApplied={giftCardApplied}
                        setGiftCardApplied={setGiftCardApplied}
                        rewardsApplied={rewardsApplied}
                        setRewardsApplied={setRewardsApplied}
                        totals={totals}
                        validationMessage={validationMessage}
                        onPlaceOrder={placeOrder}
                    />
                </div>
            </section>
        </StorefrontLayout>
    );
}

function AddressSelector({
    addresses,
    selectedId,
    onSelect,
}: {
    addresses: CheckoutAddress[];
    selectedId: number;
    onSelect: (id: number) => void;
}) {
    if (addresses.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 dark:border-white/10">
                No saved address. Add one to continue.
            </div>
        );
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {addresses.map((address) => (
                <label
                    key={address.id}
                    className={`cursor-pointer rounded-2xl border p-4 ${selectedId === address.id ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-white/10'} ${!address.is_serviceable ? 'opacity-55' : ''}`}
                >
                    <input
                        type="radio"
                        checked={selectedId === address.id}
                        disabled={!address.is_serviceable}
                        onChange={() => onSelect(address.id)}
                        className="sr-only"
                    />
                    <span className="text-xs font-black capitalize">
                        {address.label || address.type}
                    </span>
                    <span className="mt-2 block text-sm font-black">
                        {address.recipient_name}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {address.line_1}, {address.city}, {address.state}{' '}
                        {address.postal_code}
                    </span>
                    <span
                        className={`mt-2 block text-[10px] font-black uppercase ${address.is_serviceable ? 'text-emerald-600' : 'text-rose-500'}`}
                    >
                        {address.is_serviceable
                            ? 'Serviceable'
                            : 'Delivery unavailable'}
                    </span>
                </label>
            ))}
        </div>
    );
}

function GuestAddressForm({
    compact = false,
    onCompleteChange,
}: {
    compact?: boolean;
    onCompleteChange: (complete: boolean) => void;
}) {
    const [values, setValues] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
    });
    const update = (key: keyof typeof values, value: string) => {
        const next = { ...values, [key]: value };
        setValues(next);
        onCompleteChange(
            next.name.trim() !== '' &&
                /^[6-9]\d{9}$/.test(next.phone) &&
                next.address.trim() !== '' &&
                next.city.trim() !== '' &&
                /^\d{6}$/.test(next.pincode),
        );
    };

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <GuestField
                label="Full name"
                value={values.name}
                onChange={(value) => update('name', value)}
            />
            <GuestField
                label="Mobile number"
                value={values.phone}
                onChange={(value) =>
                    update('phone', value.replace(/\D/g, '').slice(0, 10))
                }
            />
            <div className="sm:col-span-2">
                <GuestField
                    label={compact ? 'Billing address' : 'Delivery address'}
                    value={values.address}
                    onChange={(value) => update('address', value)}
                />
            </div>
            <GuestField
                label="City"
                value={values.city}
                onChange={(value) => update('city', value)}
            />
            <GuestField
                label="Pincode"
                value={values.pincode}
                onChange={(value) =>
                    update('pincode', value.replace(/\D/g, '').slice(0, 6))
                }
            />
        </div>
    );
}

function GuestField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="grid gap-2 text-xs font-black">
            {label}
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
            />
        </label>
    );
}

function ChoiceCard({
    name,
    value,
    checked,
    onChange,
    label,
    detail,
}: {
    name: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    label: string;
    detail: string;
}) {
    return (
        <label
            className={`cursor-pointer rounded-2xl border p-4 ${checked ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-white/10'}`}
        >
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => onChange(value)}
                className="sr-only"
            />
            <span className="text-sm font-black">{label}</span>
            <span className="mt-1 block text-xs text-slate-500">{detail}</span>
        </label>
    );
}

type CheckoutTotals = {
    subtotal: number;
    itemTax: number;
    coupon: number;
    giftCard: number;
    rewards: number;
    shipping: number;
    wrapping: number;
    total: number;
};

function OrderSummary({
    couponCode,
    setCouponCode,
    couponApplied,
    setCouponApplied,
    giftCardCode,
    setGiftCardCode,
    giftCardApplied,
    setGiftCardApplied,
    rewardsApplied,
    setRewardsApplied,
    totals,
    validationMessage,
    onPlaceOrder,
}: {
    couponCode: string;
    setCouponCode: (value: string) => void;
    couponApplied: boolean;
    setCouponApplied: (value: boolean) => void;
    giftCardCode: string;
    setGiftCardCode: (value: string) => void;
    giftCardApplied: boolean;
    setGiftCardApplied: (value: boolean) => void;
    rewardsApplied: boolean;
    setRewardsApplied: (value: boolean) => void;
    totals: CheckoutTotals;
    validationMessage: string;
    onPlaceOrder: () => void;
}) {
    return (
        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 lg:sticky lg:top-32 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2">
                <PackageCheck className="size-5 text-orange-500" />
                <h2 className="text-lg font-black">Review your order</h2>
            </div>
            <div className="mt-5 grid gap-4">
                {checkoutItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3">
                        <ProductImage
                            product={product}
                            className="size-16 shrink-0 rounded-2xl"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black">
                                {product.name}
                            </p>
                            <p className="text-xs text-slate-400">
                                Qty {quantity} · {product.seller}
                            </p>
                        </div>
                        <span className="text-sm font-black">
                            {money.format(product.price * quantity)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-5 grid gap-2 border-t border-slate-200 pt-5 dark:border-white/10">
                <PromoField
                    icon={<Tag className="size-4" />}
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={setCouponCode}
                    applied={couponApplied}
                    onApply={() =>
                        setCouponApplied(
                            couponCode.trim().toUpperCase() === 'VELORA10',
                        )
                    }
                />
                <PromoField
                    icon={<Gift className="size-4" />}
                    placeholder="Gift-card code"
                    value={giftCardCode}
                    onChange={setGiftCardCode}
                    applied={giftCardApplied}
                    onApply={() =>
                        setGiftCardApplied(giftCardCode.trim().length >= 4)
                    }
                />
                <button
                    type="button"
                    onClick={() => setRewardsApplied(!rewardsApplied)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left text-xs ${rewardsApplied ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-white/10'}`}
                >
                    <WalletCards className="size-4 text-orange-500" />
                    <span className="font-black">
                        Redeem 250 points
                        <span className="block font-medium text-slate-500">
                            Worth ₹250
                        </span>
                    </span>
                    {rewardsApplied && (
                        <Check className="ml-auto size-4 text-emerald-500" />
                    )}
                </button>
            </div>

            <div className="mt-5 grid gap-3 border-t border-slate-200 pt-5 text-sm dark:border-white/10">
                <SummaryLine
                    label="Items subtotal"
                    value={money.format(totals.subtotal)}
                />
                <SummaryLine
                    label="Included GST (18%)"
                    value={money.format(totals.itemTax)}
                />
                <SummaryLine
                    label="Shipping"
                    value={
                        totals.shipping ? money.format(totals.shipping) : 'Free'
                    }
                />
                {totals.wrapping > 0 && (
                    <SummaryLine
                        label="Gift wrapping"
                        value={money.format(totals.wrapping)}
                    />
                )}
                <SummaryLine
                    label="Discounts"
                    value={`−${money.format(totals.coupon + totals.giftCard + totals.rewards)}`}
                    accent
                />
                <div className="mt-2 flex items-end justify-between border-t border-slate-200 pt-4 dark:border-white/10">
                    <span className="font-black">Order total</span>
                    <span className="text-2xl font-black">
                        {money.format(totals.total)}
                    </span>
                </div>
            </div>

            {validationMessage && (
                <p className="mt-4 flex gap-2 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-600 dark:bg-rose-500/10">
                    <CircleAlert className="size-4 shrink-0" />
                    {validationMessage}
                </p>
            )}
            <button
                type="button"
                onClick={onPlaceOrder}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white hover:bg-orange-500 dark:bg-orange-500"
            >
                <ShieldCheck className="size-4" /> Place secure order
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Taxes are included. Final shipping and payment eligibility are
                validated before confirmation.
            </p>
        </aside>
    );
}

function PromoField({
    icon,
    placeholder,
    value,
    onChange,
    applied,
    onApply,
}: {
    icon: ReactNode;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    applied: boolean;
    onApply: () => void;
}) {
    return (
        <div
            className={`flex items-center gap-2 rounded-xl border px-3 ${applied ? 'border-emerald-400' : 'border-slate-200 dark:border-white/10'}`}
        >
            <span className="text-orange-500">{icon}</span>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={applied}
                placeholder={placeholder}
                className="h-11 min-w-0 flex-1 bg-transparent text-xs outline-none"
            />
            <button
                type="button"
                onClick={onApply}
                className={`text-[10px] font-black ${applied ? 'text-emerald-500' : 'text-orange-500'}`}
            >
                {applied ? 'Applied' : 'Apply'}
            </button>
        </div>
    );
}

function SummaryLine({
    label,
    value,
    accent = false,
}: {
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div className="flex justify-between gap-4 text-slate-500">
            <span>{label}</span>
            <span className={accent ? 'font-black text-emerald-600' : ''}>
                {value}
            </span>
        </div>
    );
}

function CheckoutCard({
    icon: Icon,
    number,
    title,
    children,
}: {
    icon: typeof MapPin;
    number: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                        <Icon className="size-5" />
                    </span>
                    <h2 className="text-lg font-black">{title}</h2>
                </div>
                <span className="text-xs font-black text-slate-300">
                    {number}
                </span>
            </div>
            <div className="mt-6">{children}</div>
        </section>
    );
}

function OrderConfirmation({ total }: { total: number }) {
    return (
        <StorefrontLayout>
            <Head title="Order confirmed" />
            <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
                <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10">
                    <Check className="size-10" />
                </span>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-black tracking-wider text-orange-500 uppercase">
                    <Sparkles className="size-4" /> Order confirmed
                </span>
                <h1 className="mt-3 text-4xl font-black tracking-[-0.05em]">
                    Thank you for your order.
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-slate-500">
                    Your order VL-
                    {Math.round(total).toString().padStart(8, '0')} for{' '}
                    {money.format(total)} is confirmed. We’ll notify you as it
                    moves toward delivery.
                </p>
                <div className="mx-auto mt-8 grid max-w-lg gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left sm:grid-cols-2 dark:border-white/10 dark:bg-white/5">
                    <span className="inline-flex items-center gap-2 text-sm font-black">
                        <Clock3 className="size-4 text-orange-500" /> Delivery
                        slot reserved
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-black">
                        <ShieldCheck className="size-4 text-emerald-500" />{' '}
                        Secure payment
                    </span>
                </div>
                <Link
                    href={cart.url()}
                    className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white dark:bg-orange-500"
                >
                    Continue shopping
                </Link>
            </section>
        </StorefrontLayout>
    );
}
