import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronRight,
    Clock3,
    PackageCheck,
    RefreshCw,
    ShoppingBag,
    Truck,
} from 'lucide-react';
import { money } from '@/components/storefront/catalog';
import StorefrontLayout from '@/layouts/storefront-layout';
import { dashboard } from '@/routes';
import { show } from '@/routes/customer/orders';
import { catalog } from '@/routes/storefront';
import type { CustomerOrder } from './types';

type OrdersPage = {
    data: CustomerOrder[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

export default function OrderHistory({ orders }: { orders: OrdersPage }) {
    return (
        <StorefrontLayout>
            <Head title="Order history" />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <Link
                    href={dashboard()}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600"
                >
                    <ArrowLeft className="size-4" /> Back to my account
                </Link>
                <section className="relative mt-6 overflow-hidden rounded-[2.25rem] bg-slate-950 px-6 py-8 text-white sm:px-9">
                    <div className="absolute -top-24 right-0 size-72 rounded-full bg-orange-500/25 blur-3xl" />
                    <div className="relative">
                        <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.16em] text-orange-300 uppercase">
                            <ShoppingBag className="size-4" /> Your purchases
                        </span>
                        <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                            Order history
                        </h1>
                        <p className="mt-3 text-sm text-slate-300">
                            Track deliveries, review details, download
                            documents, or buy your favourites again.
                        </p>
                    </div>
                </section>

                {orders.data.length > 0 ? (
                    <div className="mt-6 grid gap-4">
                        {orders.data.map((order) => (
                            <article
                                key={order.id}
                                className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/5"
                            >
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                    <div>
                                        <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                            {order.number}
                                        </p>
                                        <h2 className="mt-1 text-lg font-black">
                                            {order.items.length} item
                                            {order.items.length === 1
                                                ? ''
                                                : 's'}{' '}
                                            ·{' '}
                                            {money.format(Number(order.total))}
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Placed{' '}
                                            {new Date(
                                                order.placed_at,
                                            ).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-black uppercase ${order.status === 'cancelled' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' : order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-orange-50 text-orange-600 dark:bg-orange-500/10'}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center dark:border-white/10">
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                        {order.shipment?.status ===
                                        'delivered' ? (
                                            <PackageCheck className="size-4 text-emerald-500" />
                                        ) : (
                                            <Truck className="size-4 text-orange-500" />
                                        )}
                                        <span>
                                            Shipment:{' '}
                                            {order.shipment?.status ??
                                                'Preparing'}
                                        </span>
                                        {order.shipment
                                            ?.estimated_delivery_at && (
                                            <span className="hidden items-center gap-1 sm:inline-flex">
                                                <Clock3 className="size-3.5" />
                                                ETA{' '}
                                                {new Date(
                                                    order.shipment
                                                        .estimated_delivery_at,
                                                ).toLocaleDateString('en-IN')}
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        href={show(order.id)}
                                        className="inline-flex items-center gap-1 text-xs font-black text-orange-600"
                                    >
                                        View order details{' '}
                                        <ChevronRight className="size-4" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                        <div className="flex justify-between gap-3">
                            {orders.prev_page_url ? (
                                <Link
                                    href={orders.prev_page_url}
                                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black dark:border-white/10"
                                >
                                    Previous
                                </Link>
                            ) : (
                                <span />
                            )}
                            {orders.next_page_url && (
                                <Link
                                    href={orders.next_page_url}
                                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black dark:border-white/10"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 rounded-[2rem] border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
                        <RefreshCw className="mx-auto size-9 text-slate-300" />
                        <h2 className="mt-4 text-xl font-black">
                            Your first order is waiting.
                        </h2>
                        <Link
                            href={catalog.url()}
                            className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white dark:bg-orange-500"
                        >
                            Start shopping
                        </Link>
                    </div>
                )}
            </main>
        </StorefrontLayout>
    );
}
