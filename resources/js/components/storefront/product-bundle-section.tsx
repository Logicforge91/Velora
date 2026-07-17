import { Link } from '@inertiajs/react';
import { Check, Plus, ShoppingBag, Sparkles } from 'lucide-react';
import { money } from '@/components/storefront/catalog';
import type { StorefrontProduct } from '@/components/storefront/catalog';
import { cart, product as productRoute } from '@/routes/storefront';

export default function ProductBundleSection({
    products,
}: {
    products: StorefrontProduct[];
}) {
    const bundleTotal = products.reduce(
        (total, product) => total + product.price,
        0,
    );

    return (
        <section className="overflow-hidden rounded-[2.5rem] bg-slate-950 text-white">
            <div className="grid lg:grid-cols-[1fr_320px]">
                <div className="p-6 sm:p-9">
                    <span className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-orange-300 uppercase">
                        <Sparkles className="size-4" /> Complete the experience
                    </span>
                    <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                        Try it together
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        A ready-made combination selected to work beautifully
                        together.
                    </p>
                    <div className="mt-7 flex gap-3 overflow-x-auto pb-2">
                        {products.map((product, index) => {
                            const Icon = product.icon;

                            return (
                                <div
                                    key={product.id}
                                    className="flex shrink-0 items-center gap-3"
                                >
                                    {index > 0 && (
                                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10">
                                            <Plus className="size-4" />
                                        </span>
                                    )}
                                    <Link
                                        href={productRoute.url(product.slug)}
                                        prefetch
                                        className="w-36 rounded-[1.5rem] bg-white/10 p-3 transition hover:bg-white/15 sm:w-44"
                                    >
                                        <span
                                            className={`grid aspect-square place-items-center rounded-[1rem] bg-gradient-to-br ${product.tone}`}
                                        >
                                            <Icon className="size-12 sm:size-16" />
                                        </span>
                                        <p className="mt-3 truncate text-xs font-black">
                                            {product.name}
                                        </p>
                                        <p className="mt-1 text-xs text-orange-300">
                                            {money.format(product.price)}
                                        </p>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <aside className="border-t border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:border-t-0 lg:border-l">
                    <p className="text-xs font-bold text-slate-400">
                        Bundle price
                    </p>
                    <p className="mt-2 text-3xl font-black">
                        {money.format(bundleTotal)}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-emerald-400">
                        You save ₹1,200 when purchased together
                    </p>
                    <ul className="mt-6 grid gap-3 text-xs text-slate-300">
                        <li className="flex items-center gap-2">
                            <Check className="size-4 text-emerald-400" /> All
                            items are in stock
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="size-4 text-emerald-400" /> One
                            simple delivery
                        </li>
                    </ul>
                    <Link
                        href={cart.url()}
                        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3.5 text-sm font-black transition hover:bg-orange-400"
                    >
                        <ShoppingBag className="size-4" /> Add all to cart
                    </Link>
                </aside>
            </div>
        </section>
    );
}
