import { Link } from '@inertiajs/react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { money } from '@/components/storefront/catalog';
import type { StorefrontProduct } from '@/components/storefront/catalog';
import { product as productRoute } from '@/routes/storefront';

export default function ProductCard({
    product,
}: {
    product: StorefrontProduct;
}) {
    const Icon = product.icon;

    return (
        <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/5 motion-reduce:transform-none dark:border-white/10 dark:bg-white/5">
            <div
                className={`relative grid aspect-[4/3] place-items-center bg-gradient-to-br ${product.tone}`}
            >
                <span className="absolute top-3 left-3 rounded-lg bg-white px-2 py-1 text-[10px] font-black text-emerald-600 shadow-sm">
                    {product.offer}
                </span>
                <button
                    type="button"
                    className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:text-rose-500"
                    aria-label={`Save ${product.name}`}
                >
                    <Heart className="size-4" />
                </button>
                <Link
                    href={productRoute.url(product.slug)}
                    prefetch
                    aria-label={`View ${product.name}`}
                >
                    <Icon className="size-20 transition duration-300 group-hover:scale-110 group-hover:-rotate-3" />
                </Link>
            </div>
            <div className="p-4">
                <p className="text-xs font-bold text-slate-400">
                    {product.category}
                </p>
                <h3 className="mt-1 truncate font-black">
                    <Link
                        href={productRoute.url(product.slug)}
                        prefetch
                        className="hover:text-orange-500"
                    >
                        {product.name}
                    </Link>
                </h3>
                <div className="mt-2 flex items-center gap-1 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-1.5 py-0.5 font-bold text-white">
                        {product.rating}
                        <Star className="size-2.5 fill-current" />
                    </span>
                    <span className="text-slate-400">Top rated</span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                        <span className="text-lg font-black">
                            {money.format(product.price)}
                        </span>
                        <span className="ml-2 text-xs text-slate-400 line-through">
                            {money.format(product.original)}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="grid size-10 place-items-center rounded-full bg-slate-950 text-white transition hover:bg-orange-500 dark:bg-orange-500"
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <ShoppingCart className="size-4" />
                    </button>
                </div>
            </div>
        </article>
    );
}
