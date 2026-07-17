import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Minus,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Trash2,
} from 'lucide-react';
import { money, products } from '@/components/storefront/catalog';
import StorefrontLayout from '@/layouts/storefront-layout';
import {
    catalog,
    checkout,
    product as productRoute,
} from '@/routes/storefront';

const cartProducts = products.slice(0, 2);
const subtotal = cartProducts.reduce(
    (total, product) => total + product.price,
    0,
);
const discount = 1500;

export default function Cart() {
    return (
        <StorefrontLayout>
            <Head title="Your cart" />
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-black tracking-[0.18em] text-orange-500 uppercase">
                            Almost yours
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                            Shopping cart
                        </h1>
                    </div>
                    <p className="text-sm font-bold text-slate-500">
                        {cartProducts.length} items
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
                    <div className="grid gap-4">
                        {cartProducts.map((product) => {
                            const Icon = product.icon;

                            return (
                                <article
                                    key={product.id}
                                    className="flex flex-col gap-5 rounded-[1.75rem] border border-slate-200 bg-white p-4 sm:flex-row sm:items-center dark:border-white/10 dark:bg-white/5"
                                >
                                    <Link
                                        href={productRoute.url(product.slug)}
                                        className={`grid size-32 shrink-0 place-items-center rounded-[1.25rem] bg-gradient-to-br ${product.tone}`}
                                    >
                                        <Icon className="size-16" />
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-slate-400">
                                            {product.category}
                                        </p>
                                        <h2 className="mt-1 font-black">
                                            {product.name}
                                        </h2>
                                        <p className="mt-2 text-sm text-emerald-600">
                                            In stock · Delivery in 2–4 days
                                        </p>
                                        <div className="mt-4 inline-flex items-center rounded-full border border-slate-200 p-1 dark:border-white/10">
                                            <button
                                                type="button"
                                                aria-label="Decrease quantity"
                                                className="grid size-8 place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
                                            >
                                                <Minus className="size-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-black">
                                                1
                                            </span>
                                            <button
                                                type="button"
                                                aria-label="Increase quantity"
                                                className="grid size-8 place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
                                            >
                                                <Plus className="size-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 sm:grid sm:text-right">
                                        <p className="text-lg font-black">
                                            {money.format(product.price)}
                                        </p>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-rose-500"
                                        >
                                            <Trash2 className="size-3.5" />{' '}
                                            Remove
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                        <Link
                            href={catalog.url()}
                            className="inline-flex items-center gap-2 px-2 text-sm font-black text-orange-500"
                        >
                            <ArrowRight className="size-4 rotate-180" />{' '}
                            Continue shopping
                        </Link>
                    </div>

                    <aside className="h-fit rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8 lg:sticky lg:top-32">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="size-5 text-orange-400" />
                            <h2 className="text-xl font-black">
                                Order summary
                            </h2>
                        </div>
                        <div className="mt-7 grid gap-4 text-sm">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span>{money.format(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Delivery</span>
                                <span className="font-bold text-emerald-400">
                                    Free
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Velora savings</span>
                                <span>-{money.format(discount)}</span>
                            </div>
                            <div className="border-t border-white/10 pt-4">
                                <div className="flex items-end justify-between">
                                    <span className="font-black">Total</span>
                                    <span className="text-2xl font-black">
                                        {money.format(subtotal - discount)}
                                    </span>
                                </div>
                                <p className="mt-1 text-right text-xs text-slate-500">
                                    Including all taxes
                                </p>
                            </div>
                        </div>
                        <Link
                            href={checkout.url()}
                            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-4 text-sm font-black hover:bg-orange-400"
                        >
                            Secure checkout <ArrowRight className="size-4" />
                        </Link>
                        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                            <ShieldCheck className="size-4" /> Payments are
                            encrypted and secure
                        </p>
                    </aside>
                </div>
            </section>
        </StorefrontLayout>
    );
}
