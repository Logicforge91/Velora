import { Head, Link } from '@inertiajs/react';
import {
    BadgePercent,
    Banknote,
    Check,
    ChevronRight,
    Clock3,
    Copy,
    Gift,
    PackagePlus,
    ShoppingBag,
    Smartphone,
    Sparkles,
    Store,
    Tag,
    Truck,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { money, products } from '@/components/storefront/catalog';
import ProductImage from '@/components/storefront/product-image';
import StorefrontLayout from '@/layouts/storefront-layout';
import { cart, checkout } from '@/routes/storefront';

type PromotionType =
    | 'store'
    | 'seller'
    | 'category'
    | 'product'
    | 'first-order'
    | 'referral'
    | 'bank'
    | 'upi'
    | 'shipping';

type Coupon = {
    code: string;
    title: string;
    description: string;
    type: PromotionType;
    value: string;
    minimum: number;
    expiresInHours: number;
    scope: string;
    icon: LucideIcon;
    eligible: boolean;
    reason?: string;
};

const coupons: Coupon[] = [
    {
        code: 'VELORA10',
        title: '10% off your basket',
        description: 'Save up to ₹1,000 across eligible products.',
        type: 'store',
        value: '10% OFF',
        minimum: 999,
        expiresInHours: 18,
        scope: 'Store-wide',
        icon: BadgePercent,
        eligible: true,
    },
    {
        code: 'TECH500',
        title: 'The Tech Edit special',
        description: '₹500 off products sold by The Tech Edit.',
        type: 'seller',
        value: '₹500 OFF',
        minimum: 4999,
        expiresInHours: 48,
        scope: 'Seller-specific',
        icon: Store,
        eligible: true,
    },
    {
        code: 'STYLE15',
        title: 'Fashion refresh',
        description: '15% off fashion and footwear categories.',
        type: 'category',
        value: '15% OFF',
        minimum: 1499,
        expiresInHours: 72,
        scope: 'Category-specific',
        icon: ShoppingBag,
        eligible: true,
    },
    {
        code: 'NOVA2000',
        title: 'Nova X Pro launch offer',
        description: 'Extra ₹2,000 off the Nova X Pro Smartphone.',
        type: 'product',
        value: '₹2,000 OFF',
        minimum: 0,
        expiresInHours: 6,
        scope: 'Product-specific',
        icon: Smartphone,
        eligible: true,
    },
    {
        code: 'WELCOME20',
        title: 'First-order welcome',
        description: '20% off your first Velora order.',
        type: 'first-order',
        value: '20% OFF',
        minimum: 999,
        expiresInHours: 168,
        scope: 'First order',
        icon: Sparkles,
        eligible: false,
        reason: 'Available only before your first completed order.',
    },
    {
        code: 'FRIEND250',
        title: 'Referral reward',
        description: '₹250 off after a friend completes their first order.',
        type: 'referral',
        value: '₹250 OFF',
        minimum: 999,
        expiresInHours: 120,
        scope: 'Referral',
        icon: Gift,
        eligible: false,
        reason: 'Your referred friend has not completed an order yet.',
    },
    {
        code: 'HDFC750',
        title: 'HDFC Bank instant discount',
        description: '₹750 instant discount on eligible cards.',
        type: 'bank',
        value: '₹750 OFF',
        minimum: 7500,
        expiresInHours: 30,
        scope: 'Bank offer',
        icon: Banknote,
        eligible: true,
    },
    {
        code: 'UPI150',
        title: 'UPI payment offer',
        description: '₹150 cashback when paying with UPI.',
        type: 'upi',
        value: '₹150 BACK',
        minimum: 1499,
        expiresInHours: 12,
        scope: 'UPI offer',
        icon: Smartphone,
        eligible: true,
    },
    {
        code: 'SHIPFREE',
        title: 'Free delivery',
        description: 'Waives standard shipping charges.',
        type: 'shipping',
        value: 'FREE SHIP',
        minimum: 499,
        expiresInHours: 24,
        scope: 'Shipping',
        icon: Truck,
        eligible: true,
    },
];

const automaticPromotions = [
    {
        title: 'Buy one, get one',
        detail: 'Add any two Studio audio accessories; the lower-priced item is free.',
        badge: 'BOGO',
        icon: Gift,
    },
    {
        title: 'Work-from-anywhere bundle',
        detail: 'Save ₹3,000 when Airbook 14 and Studio Headphones are bought together.',
        badge: 'BUNDLE',
        icon: PackagePlus,
    },
    {
        title: 'Automatic cart saving',
        detail: 'Extra 5% applies automatically when three eligible items are in your cart.',
        badge: 'AUTO',
        icon: Sparkles,
    },
];

const filters: Array<{ label: string; value: PromotionType | 'all' }> = [
    { label: 'All offers', value: 'all' },
    { label: 'Seller', value: 'seller' },
    { label: 'Category', value: 'category' },
    { label: 'Product', value: 'product' },
    { label: 'Bank & UPI', value: 'bank' },
    { label: 'Shipping', value: 'shipping' },
];

export default function Promotions() {
    const [filter, setFilter] = useState<PromotionType | 'all'>('all');
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [showEligibleOnly, setShowEligibleOnly] = useState(false);
    const visibleCoupons = useMemo(
        () =>
            coupons.filter((coupon) => {
                const filterMatches =
                    filter === 'all' ||
                    coupon.type === filter ||
                    (filter === 'bank' && coupon.type === 'upi');

                return filterMatches && (!showEligibleOnly || coupon.eligible);
            }),
        [filter, showEligibleOnly],
    );
    const appliedCoupon = coupons.find((coupon) => coupon.code === appliedCode);

    const copyCode = async (code: string) => {
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);
        window.setTimeout(() => setCopiedCode(null), 1500);
    };

    return (
        <StorefrontLayout>
            <Head title="Coupons and promotions" />
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-500 via-rose-500 to-violet-600 px-6 py-10 text-white sm:px-10">
                    <div className="absolute -top-24 right-0 size-80 rounded-full bg-white/20 blur-3xl" />
                    <div className="relative max-w-2xl">
                        <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.18em] text-orange-100 uppercase">
                            <Tag className="size-4" /> Promotion wallet
                        </span>
                        <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
                            More joy, less at checkout.
                        </h1>
                        <p className="mt-4 text-sm leading-6 text-white/80">
                            Browse eligible coupons, discover automatic
                            promotions, and take the best offer to your cart.
                        </p>
                    </div>
                </section>

                {coupons.some((coupon) => coupon.expiresInHours <= 12) && (
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                        <Clock3 className="mt-0.5 size-5 shrink-0" />
                        <div>
                            <p className="text-sm font-black">
                                Offers expiring soon
                            </p>
                            <p className="mt-1 text-xs">
                                NOVA2000 expires in 6 hours and UPI150 expires
                                in 12 hours.
                            </p>
                        </div>
                    </div>
                )}

                <section className="mt-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-black tracking-wider text-orange-600 uppercase">
                                Applied automatically
                            </p>
                            <h2 className="mt-1 text-2xl font-black">
                                No coupon code needed
                            </h2>
                        </div>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                        {automaticPromotions.map((promotion) => {
                            const Icon = promotion.icon;

                            return (
                                <article
                                    key={promotion.title}
                                    className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10">
                                            <Icon className="size-5" />
                                        </span>
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-700 dark:bg-emerald-500/10">
                                            {promotion.badge}
                                        </span>
                                    </div>
                                    <h3 className="mt-4 font-black">
                                        {promotion.title}
                                    </h3>
                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        {promotion.detail}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <div className="mt-9 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <section>
                        <div className="flex flex-wrap items-center gap-2">
                            {filters.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setFilter(item.value)}
                                    className={`rounded-full px-4 py-2 text-xs font-black ${filter === item.value ? 'bg-slate-950 text-white dark:bg-orange-500' : 'border border-slate-200 dark:border-white/10'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            <label className="ml-auto inline-flex items-center gap-2 text-xs font-black">
                                <input
                                    type="checkbox"
                                    checked={showEligibleOnly}
                                    onChange={(event) =>
                                        setShowEligibleOnly(
                                            event.target.checked,
                                        )
                                    }
                                    className="size-4 accent-orange-500"
                                />
                                Eligible only
                            </label>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            {visibleCoupons.map((coupon) => (
                                <CouponCard
                                    key={coupon.code}
                                    coupon={coupon}
                                    applied={appliedCode === coupon.code}
                                    copied={copiedCode === coupon.code}
                                    onApply={() =>
                                        setAppliedCode(
                                            appliedCode === coupon.code
                                                ? null
                                                : coupon.code,
                                        )
                                    }
                                    onCopy={() => copyCode(coupon.code)}
                                />
                            ))}
                        </div>
                    </section>

                    <aside className="h-fit rounded-[2rem] bg-slate-950 p-6 text-white lg:sticky lg:top-32">
                        <Sparkles className="size-6 text-orange-400" />
                        <h2 className="mt-4 text-xl font-black">
                            Your best offer
                        </h2>
                        {appliedCoupon ? (
                            <>
                                <div className="mt-5 rounded-2xl bg-white/5 p-4">
                                    <p className="text-xs font-black tracking-wider text-orange-300 uppercase">
                                        {appliedCoupon.code}
                                    </p>
                                    <p className="mt-2 font-black">
                                        {appliedCoupon.title}
                                    </p>
                                    <p className="mt-2 text-xs text-slate-400">
                                        Eligibility confirmed ·{' '}
                                        {appliedCoupon.scope}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAppliedCode(null)}
                                    className="mt-3 inline-flex items-center gap-2 text-xs font-black text-rose-300"
                                >
                                    <X className="size-3.5" /> Remove coupon
                                </button>
                                <Link
                                    href={cart.url({
                                        query: {
                                            coupon: appliedCoupon.code,
                                        },
                                    })}
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3.5 text-sm font-black"
                                >
                                    Apply in cart{' '}
                                    <ChevronRight className="size-4" />
                                </Link>
                                <Link
                                    href={checkout.url({
                                        query: {
                                            coupon: appliedCoupon.code,
                                        },
                                    })}
                                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3.5 text-sm font-black"
                                >
                                    Use at checkout
                                </Link>
                            </>
                        ) : (
                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Select an eligible coupon to see where it can be
                                applied.
                            </p>
                        )}
                    </aside>
                </div>

                <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-white/5">
                    <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
                        <div>
                            <p className="text-xs font-black text-orange-600 uppercase">
                                Featured bundle
                            </p>
                            <h2 className="mt-2 text-xl font-black">
                                The mobile essentials set
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Nova X Pro + Studio Wireless Headphones with an
                                automatic ₹2,500 bundle saving.
                            </p>
                        </div>
                        <div className="flex -space-x-5">
                            {products.slice(0, 2).map((product) => (
                                <ProductImage
                                    key={product.id}
                                    product={product}
                                    className="size-20 rounded-2xl ring-4 ring-white dark:ring-slate-900"
                                />
                            ))}
                        </div>
                        <div className="md:text-right">
                            <p className="text-sm text-slate-400 line-through">
                                {money.format(
                                    products[0].price + products[1].price,
                                )}
                            </p>
                            <p className="text-2xl font-black">
                                {money.format(
                                    products[0].price +
                                        products[1].price -
                                        2500,
                                )}
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </StorefrontLayout>
    );
}

function CouponCard({
    coupon,
    applied,
    copied,
    onApply,
    onCopy,
}: {
    coupon: Coupon;
    applied: boolean;
    copied: boolean;
    onApply: () => void;
    onCopy: () => void;
}) {
    const Icon = coupon.icon;

    return (
        <article
            className={`relative overflow-hidden rounded-[1.5rem] border bg-white p-5 dark:bg-white/5 ${applied ? 'border-emerald-400 ring-2 ring-emerald-100 dark:ring-emerald-500/10' : 'border-slate-200 dark:border-white/10'} ${!coupon.eligible ? 'opacity-65' : ''}`}
        >
            <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                    <Icon className="size-5" />
                </span>
                <span className="text-xs font-black text-emerald-600">
                    {coupon.value}
                </span>
            </div>
            <p className="mt-4 text-[10px] font-black tracking-wider text-slate-400 uppercase">
                {coupon.scope}
            </p>
            <h3 className="mt-1 font-black">{coupon.title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">
                {coupon.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/5">
                    Min. {money.format(coupon.minimum)}
                </span>
                <span
                    className={`rounded-full px-2 py-1 ${coupon.expiresInHours <= 12 ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10' : 'bg-slate-100 dark:bg-white/5'}`}
                >
                    Expires in {coupon.expiresInHours}h
                </span>
            </div>
            {!coupon.eligible && (
                <p className="mt-3 text-[10px] font-bold text-rose-500">
                    {coupon.reason}
                </p>
            )}
            <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
                <button
                    type="button"
                    onClick={onCopy}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-[10px] font-black dark:border-white/10"
                >
                    {copied ? (
                        <Check className="size-3.5" />
                    ) : (
                        <Copy className="size-3.5" />
                    )}
                    {copied ? 'Copied' : coupon.code}
                </button>
                <button
                    type="button"
                    onClick={onApply}
                    disabled={!coupon.eligible}
                    className="ml-auto rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black text-white disabled:cursor-not-allowed disabled:opacity-30 dark:bg-orange-500"
                >
                    {applied ? 'Remove' : 'Apply'}
                </button>
            </div>
        </article>
    );
}
