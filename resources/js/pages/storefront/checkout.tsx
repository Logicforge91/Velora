import { Head, Link } from '@inertiajs/react';
import {
    ChevronRight,
    CreditCard,
    LockKeyhole,
    MapPin,
    PackageCheck,
    ShieldCheck,
} from 'lucide-react';
import { money, products } from '@/components/storefront/catalog';
import ProductImage from '@/components/storefront/product-image';
import StorefrontLayout from '@/layouts/storefront-layout';
import { cart } from '@/routes/storefront';

const checkoutProducts = products.slice(0, 2);
const total =
    checkoutProducts.reduce((amount, product) => amount + product.price, 0) -
    1500;

export default function Checkout() {
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
                            Your information is protected.
                        </p>
                    </div>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px]">
                    <div className="grid gap-6">
                        <CheckoutCard
                            icon={MapPin}
                            number="01"
                            title="Delivery address"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Full name"
                                    placeholder="Enter your name"
                                />
                                <Field
                                    label="Mobile number"
                                    placeholder="10-digit mobile number"
                                />
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Address"
                                        placeholder="House number, street and area"
                                    />
                                </div>
                                <Field label="City" placeholder="Your city" />
                                <Field
                                    label="PIN code"
                                    placeholder="6-digit PIN code"
                                />
                            </div>
                        </CheckoutCard>
                        <CheckoutCard
                            icon={CreditCard}
                            number="02"
                            title="Payment method"
                        >
                            <div className="grid gap-3">
                                {[
                                    'UPI / QR payment',
                                    'Credit or debit card',
                                    'Cash on delivery',
                                ].map((method, index) => (
                                    <label
                                        key={method}
                                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 has-checked:border-orange-400 has-checked:bg-orange-50 dark:border-white/10 dark:has-checked:bg-orange-500/10"
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            defaultChecked={index === 0}
                                            className="size-4 accent-orange-500"
                                        />
                                        <span className="text-sm font-black">
                                            {method}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </CheckoutCard>
                    </div>

                    <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 lg:sticky lg:top-32 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-center gap-2">
                            <PackageCheck className="size-5 text-orange-500" />
                            <h2 className="text-lg font-black">Your order</h2>
                        </div>
                        <div className="mt-6 grid gap-4">
                            {checkoutProducts.map((product) => {
                                return (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-3"
                                    >
                                        <ProductImage
                                            product={product}
                                            className="size-16 shrink-0 rounded-2xl"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-black">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Qty 1
                                            </p>
                                        </div>
                                        <span className="text-sm font-black">
                                            {money.format(product.price)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Items and delivery</span>
                                <span>{money.format(total)}</span>
                            </div>
                            <div className="mt-4 flex items-end justify-between">
                                <span className="font-black">Order total</span>
                                <span className="text-2xl font-black">
                                    {money.format(total)}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white hover:bg-orange-500 dark:bg-orange-500"
                        >
                            <ShieldCheck className="size-4" /> Place secure
                            order
                        </button>
                        <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                            By placing your order, you agree to Velora's terms
                            and return policy.
                        </p>
                    </aside>
                </div>
            </section>
        </StorefrontLayout>
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
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
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

function Field({ label, placeholder }: { label: string; placeholder: string }) {
    return (
        <label className="grid gap-2 text-xs font-black text-slate-600 dark:text-slate-300">
            {label}
            <input
                placeholder={placeholder}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium transition outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-white/5 dark:focus:ring-orange-500/10"
            />
        </label>
    );
}
