import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Box,
    ChevronRight,
    CircleDollarSign,
    Clock3,
    Heart,
    HelpCircle,
    LogOut,
    MapPin,
    MessageSquareText,
    PackageCheck,
    PackageOpen,
    Settings,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Truck,
    WalletCards,
} from 'lucide-react';
import { useState } from 'react';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import { money, products } from '@/components/storefront/catalog';
import ProductCard from '@/components/storefront/product-card';
import StorefrontLayout from '@/layouts/storefront-layout';
import { logout } from '@/routes';
import { edit as profile } from '@/routes/customer/profile';
import { edit as security } from '@/routes/security';
import {
    cart,
    catalog,
    product as productRoute,
    wishlist,
} from '@/routes/storefront';
import type { DashboardInvitation, User } from '@/types';

type OrderSummary = {
    total: number;
    active: number;
    delivered: number;
    spent: number;
};

type CustomerOrder = {
    id: number;
    number: string;
    status: string;
    total: number;
    placedAt: string;
    itemCount: number;
    itemPreview: string;
    shipment: {
        status: string;
        estimatedDelivery: string | null;
    } | null;
};

type Props = {
    pendingInvitations?: DashboardInvitation[];
    orderSummary: OrderSummary;
    recentOrders: CustomerOrder[];
};

const orderStatus: Record<
    string,
    { label: string; className: string; icon: typeof Box }
> = {
    pending: {
        label: 'Order placed',
        className:
            'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
        icon: Clock3,
    },
    processing: {
        label: 'Being packed',
        className:
            'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
        icon: PackageOpen,
    },
    shipped: {
        label: 'On the way',
        className:
            'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
        icon: Truck,
    },
    delivered: {
        label: 'Delivered',
        className:
            'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
        icon: PackageCheck,
    },
    cancelled: {
        label: 'Cancelled',
        className:
            'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300',
        icon: Box,
    },
};

export default function Dashboard({
    pendingInvitations = [],
    orderSummary,
    recentOrders,
}: Props) {
    const { auth } = usePage().props;
    const user = auth.user as User;
    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );
    const firstName = user.name.split(' ')[0];

    return (
        <StorefrontLayout>
            <Head title="My account" />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <section className="relative overflow-hidden rounded-[2.25rem] bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-950/15 sm:px-10 sm:py-11">
                    <div className="absolute -top-32 -right-24 size-80 rounded-full bg-orange-500/30 blur-3xl" />
                    <div className="absolute -bottom-36 left-1/3 size-80 rounded-full bg-violet-500/20 blur-3xl" />
                    <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-black tracking-[0.14em] text-orange-200 uppercase">
                                <Sparkles className="size-3.5" /> My Velora
                            </span>
                            <h1 className="mt-5 text-4xl leading-none font-black tracking-[-0.055em] sm:text-5xl">
                                Good to see you, {firstName}.
                            </h1>
                            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                                Track orders, revisit favourites and keep your
                                account ready for a faster checkout.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={catalog.url()}
                                className="inline-flex h-12 items-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-black shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
                            >
                                Continue shopping{' '}
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                href={logout()}
                                method="post"
                                as="button"
                                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 text-sm font-bold transition hover:bg-white/10"
                            >
                                <LogOut className="size-4" /> Sign out
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
                    <SummaryCard
                        icon={ShoppingBag}
                        label="Total orders"
                        value={String(orderSummary.total)}
                        tone="bg-orange-50 text-orange-600 dark:bg-orange-500/10"
                    />
                    <SummaryCard
                        icon={Truck}
                        label="Active deliveries"
                        value={String(orderSummary.active)}
                        tone="bg-violet-50 text-violet-600 dark:bg-violet-500/10"
                    />
                    <SummaryCard
                        icon={BadgeCheck}
                        label="Delivered"
                        value={String(orderSummary.delivered)}
                        tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                    />
                    <SummaryCard
                        icon={CircleDollarSign}
                        label="Completed spend"
                        value={money.format(orderSummary.spent)}
                        tone="bg-blue-50 text-blue-600 dark:bg-blue-500/10"
                    />
                </section>

                <div
                    id="track-order"
                    className="mt-8 grid scroll-mt-36 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]"
                >
                    <section
                        id="orders"
                        className="scroll-mt-36 rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-sm sm:p-7 dark:border-white/10 dark:bg-white/[0.035]"
                    >
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-black tracking-[0.16em] text-orange-600 uppercase">
                                    Order activity
                                </p>
                                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                                    Recent orders
                                </h2>
                            </div>
                            {recentOrders.length > 0 && (
                                <span className="hidden text-xs font-bold text-slate-400 sm:block">
                                    Latest {recentOrders.length}
                                </span>
                            )}
                        </div>

                        {recentOrders.length > 0 ? (
                            <div className="mt-6 grid gap-3">
                                {recentOrders.map((order) => (
                                    <OrderRow key={order.id} order={order} />
                                ))}
                            </div>
                        ) : (
                            <EmptyOrders />
                        )}
                    </section>

                    <aside className="space-y-5">
                        <AccountCard user={user} />
                        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
                            <h2 className="text-lg font-black tracking-[-0.03em]">
                                Quick access
                            </h2>
                            <div className="mt-4 grid gap-2">
                                <QuickLink
                                    href={wishlist.url()}
                                    icon={Heart}
                                    label="Saved items"
                                    detail="Your wishlist"
                                />
                                <QuickLink
                                    href={cart.url()}
                                    icon={WalletCards}
                                    label="Cart & checkout"
                                    detail="Finish your order"
                                />
                                <QuickLink
                                    href={security.url()}
                                    icon={ShieldCheck}
                                    label="Login & security"
                                    detail="Protect your account"
                                />
                                <QuickLink
                                    href={catalog.url()}
                                    icon={HelpCircle}
                                    label="Help centre"
                                    detail="Returns and support"
                                />
                            </div>
                        </div>
                    </aside>
                </div>

                <section
                    id="reviews"
                    className="mt-8 scroll-mt-36 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-100 via-white to-orange-50 p-6 sm:p-8 dark:from-violet-500/15 dark:via-white/[0.035] dark:to-orange-500/10"
                >
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="max-w-xl">
                            <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.16em] text-violet-700 uppercase dark:text-violet-300">
                                <MessageSquareText className="size-4" /> Product
                                reviews
                            </span>
                            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                                Share what you think
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Your feedback helps other shoppers choose well
                                and helps sellers improve every delivery.
                            </p>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[420px]">
                            {products.slice(0, 2).map((product) => (
                                <Link
                                    key={product.id}
                                    href={`${productRoute.url(product.slug)}#customer-reviews`}
                                    className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/75 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
                                >
                                    <span
                                        className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${product.tone}`}
                                    >
                                        <product.icon className="size-5" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-black">
                                            {product.name}
                                        </span>
                                        <span className="mt-0.5 block text-xs font-bold text-orange-600">
                                            Write a review
                                        </span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-12">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-black tracking-[0.16em] text-orange-600 uppercase">
                                Pick up where you left off
                            </p>
                            <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
                                Selected for you
                            </h2>
                        </div>
                        <Link
                            href={catalog.url()}
                            className="inline-flex items-center gap-2 text-sm font-black text-orange-600"
                        >
                            View the full edit <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {products.slice(0, 3).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            </div>
        </StorefrontLayout>
    );
}

function SummaryCard({
    icon: Icon,
    label,
    value,
    tone,
}: {
    icon: typeof ShoppingBag;
    label: string;
    value: string;
    tone: string;
}) {
    return (
        <article className="rounded-[1.5rem] border border-slate-200/70 bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-white/[0.035]">
            <div
                className={`grid size-10 place-items-center rounded-xl ${tone}`}
            >
                <Icon className="size-5" />
            </div>
            <p className="mt-4 text-xl font-black tracking-[-0.04em] sm:text-2xl">
                {value}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                {label}
            </p>
        </article>
    );
}

function OrderRow({ order }: { order: CustomerOrder }) {
    const status = orderStatus[order.status] ?? orderStatus.pending;
    const StatusIcon = status.icon;

    return (
        <article className="flex flex-col gap-4 rounded-[1.4rem] border border-slate-100 bg-slate-50/70 p-4 transition hover:border-orange-200 hover:bg-orange-50/40 sm:flex-row sm:items-center dark:border-white/5 dark:bg-white/[0.025] dark:hover:border-orange-500/20 dark:hover:bg-orange-500/5">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-white/5 dark:text-white">
                <StatusIcon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black">{order.itemPreview}</p>
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-black ${status.className}`}
                    >
                        {status.label}
                    </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {order.number} · {order.itemCount}{' '}
                    {order.itemCount === 1 ? 'item' : 'items'} ·{' '}
                    {new Date(order.placedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </p>
                {order.shipment?.estimatedDelivery && (
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-300">
                        <MapPin className="size-3.5" /> Expected by{' '}
                        {new Date(
                            order.shipment.estimatedDelivery,
                        ).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                        })}
                    </p>
                )}
            </div>
            <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                <p className="font-black">{money.format(order.total)}</p>
                <ChevronRight className="size-4 text-slate-400 sm:mt-2 sm:ml-auto" />
            </div>
        </article>
    );
}

function EmptyOrders() {
    return (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 px-6 py-10 text-center dark:border-white/10">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                <PackageOpen className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-black">Your first find awaits</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                Orders you place on Velora will appear here with live delivery
                updates.
            </p>
            <Link
                href={catalog.url()}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white dark:bg-orange-500"
            >
                Explore products <ArrowRight className="size-4" />
            </Link>
        </div>
    );
}

function AccountCard({ user }: { user: User }) {
    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-rose-500 p-5 text-white shadow-xl shadow-orange-500/15">
            <div className="flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/20 text-lg font-black ring-1 ring-white/25 backdrop-blur">
                    {initials}
                </span>
                <div className="min-w-0">
                    <p className="truncate text-lg font-black">{user.name}</p>
                    <p className="truncate text-xs text-white/75">
                        {user.email}
                    </p>
                </div>
            </div>
            <Link
                href={profile.url()}
                className="mt-5 flex items-center justify-between rounded-xl bg-white/15 px-4 py-3 text-sm font-bold transition hover:bg-white/20"
            >
                <span className="inline-flex items-center gap-2">
                    <Settings className="size-4" /> Manage profile
                </span>
                <ChevronRight className="size-4" />
            </Link>
        </div>
    );
}

function QuickLink({
    href,
    icon: Icon,
    label,
    detail,
}: {
    href: string;
    icon: typeof ShoppingBag;
    label: string;
    detail: string;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50 dark:hover:bg-white/5"
        >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-orange-50 group-hover:text-orange-600 dark:bg-white/5 dark:text-slate-300 dark:group-hover:bg-orange-500/10">
                <Icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-black">{label}</span>
                <span className="block text-xs text-slate-400">{detail}</span>
            </span>
            <ChevronRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-orange-500" />
        </Link>
    );
}
