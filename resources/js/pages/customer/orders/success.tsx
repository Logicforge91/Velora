import { Head, Link } from '@inertiajs/react';
import {
    Check,
    ChevronRight,
    Download,
    PackageCheck,
    Sparkles,
    Truck,
} from 'lucide-react';
import { money } from '@/components/storefront/catalog';
import StorefrontLayout from '@/layouts/storefront-layout';
import { index, invoice, show } from '@/routes/customer/orders';
import type { CustomerOrder } from './types';

export default function OrderSuccess({ order }: { order: CustomerOrder }) {
    return (
        <StorefrontLayout>
            <Head title="Order placed successfully" />
            <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
                <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10">
                    <Check className="size-10" />
                </span>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-black tracking-wider text-orange-500 uppercase">
                    <Sparkles className="size-4" /> Order confirmed
                </span>
                <h1 className="mt-3 text-4xl font-black tracking-[-0.05em]">
                    Your order is in.
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-slate-500">
                    Order {order.number} for {money.format(Number(order.total))}{' '}
                    has been placed successfully. We’ll keep you updated as each
                    shipment moves.
                </p>
                <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 text-left dark:border-white/10 dark:bg-white/5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase">
                                Delivery to
                            </p>
                            <p className="mt-2 text-sm font-black">
                                {order.shipping_address.recipient_name}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                {order.shipping_address.line_1},{' '}
                                {order.shipping_address.city}{' '}
                                {order.shipping_address.postal_code}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase">
                                Shipment
                            </p>
                            <p className="mt-2 inline-flex items-center gap-2 text-sm font-black">
                                <Truck className="size-4 text-orange-500" />
                                {order.shipment?.status ?? 'Preparing'}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                {order.items.length} items · Payment{' '}
                                {order.payment_status}
                            </p>
                        </div>
                    </div>
                </section>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <Link
                        href={show(order.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white dark:bg-orange-500"
                    >
                        <PackageCheck className="size-4" /> View order
                        <ChevronRight className="size-4" />
                    </Link>
                    <a
                        href={invoice.url(order.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-black dark:border-white/10"
                    >
                        <Download className="size-4" /> Invoice
                    </a>
                    <Link
                        href={index()}
                        className="inline-flex items-center rounded-full border border-slate-200 px-5 py-3 text-sm font-black dark:border-white/10"
                    >
                        Order history
                    </Link>
                </div>
            </main>
        </StorefrontLayout>
    );
}
