import { Link } from '@inertiajs/react';
import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { money } from '@/components/storefront/catalog';
import type { StorefrontProduct } from '@/components/storefront/catalog';
import ProductImage from '@/components/storefront/product-image';
import { cart, product as productRoute, wishlist } from '@/routes/storefront';

export default function ProductCard({
    product,
}: {
    product: StorefrontProduct;
}) {
    return (
        <article className="group min-w-0 overflow-hidden rounded-[1.25rem] border border-slate-950/8 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/5 motion-reduce:transform-none sm:rounded-[1.75rem] dark:border-white/10 dark:bg-white/5">
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 sm:aspect-[4/3]">
                <ProductImage
                    product={product}
                    className="absolute inset-0 size-full scale-[1.03] transition duration-500 group-hover:scale-110"
                />
                <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black text-emerald-700 shadow-sm backdrop-blur sm:top-3 sm:left-3 sm:text-[11px]">
                    {product.offer}
                </span>
                <Link
                    href={wishlist.url()}
                    className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:scale-105 hover:text-rose-500 sm:top-3 sm:right-3"
                    aria-label={`Save ${product.name}`}
                >
                    <Heart className="size-4" />
                </Link>
                <Link
                    href={productRoute.url(product.slug)}
                    prefetch
                    aria-label={`View ${product.name}`}
                    className="absolute inset-0"
                />
                <Link
                    href={productRoute.url(product.slug)}
                    prefetch
                    className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 translate-y-3 items-center gap-2 rounded-full bg-slate-950/90 px-4 py-2 text-[11px] font-black whitespace-nowrap text-white opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100 dark:bg-white dark:text-slate-950"
                >
                    <Eye className="size-3.5" /> Quick view
                </Link>
            </div>
            <div className="p-3 sm:p-4">
                <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase sm:text-xs sm:normal-case">
                    {product.category}
                </p>
                <h3 className="mt-1 truncate text-sm font-black sm:text-base">
                    <Link
                        href={productRoute.url(product.slug)}
                        prefetch
                        className="hover:text-orange-500"
                    >
                        {product.name}
                    </Link>
                </h3>
                <div className="mt-2 flex items-center gap-1 text-[10px] sm:text-xs">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-1.5 py-0.5 font-bold text-white">
                        {product.rating}
                        <Star className="size-2.5 fill-current" />
                    </span>
                    <span className="hidden text-slate-400 sm:inline">
                        Top rated
                    </span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-2 sm:mt-4 sm:gap-3">
                    <div className="min-w-0">
                        <span className="block text-sm font-black sm:inline sm:text-lg">
                            {money.format(product.price)}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through sm:ml-2 sm:text-xs">
                            {money.format(product.original)}
                        </span>
                    </div>
                    <Link
                        href={cart.url()}
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-950 text-white transition hover:scale-105 hover:bg-orange-500 sm:size-10 dark:bg-orange-500"
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <ShoppingCart className="size-4" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
