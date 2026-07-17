import { Head, Link } from '@inertiajs/react';
import {
    BadgeCheck,
    ChevronRight,
    Heart,
    PackageCheck,
    ShieldCheck,
    ShoppingBag,
    Star,
    Truck,
} from 'lucide-react';
import { money, products } from '@/components/storefront/catalog';
import ProductCard from '@/components/storefront/product-card';
import StorefrontLayout from '@/layouts/storefront-layout';
import { cart, catalog, wishlist } from '@/routes/storefront';

export default function Product({ productSlug }: { productSlug: string }) {
    const selectedProduct =
        products.find((item) => item.slug === productSlug) ?? products[0];
    const Icon = selectedProduct.icon;
    const relatedProducts = products
        .filter((item) => item.id !== selectedProduct.id)
        .slice(0, 3);

    return (
        <StorefrontLayout>
            <Head title={selectedProduct.name} />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <nav className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                    <Link
                        href={catalog.url()}
                        className="hover:text-orange-500"
                    >
                        Shop
                    </Link>
                    <ChevronRight className="size-3" />
                    <span>{selectedProduct.category}</span>
                    <ChevronRight className="size-3" />
                    <span>{selectedProduct.name}</span>
                </nav>

                <section className="mt-6 grid gap-10 lg:grid-cols-2">
                    <div
                        className={`relative grid min-h-[430px] place-items-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${selectedProduct.tone}`}
                    >
                        <span className="absolute top-6 left-6 rounded-full bg-white px-3 py-1.5 text-xs font-black text-emerald-600 shadow-sm">
                            {selectedProduct.offer}
                        </span>
                        <Icon className="size-44 drop-shadow-xl sm:size-56" />
                    </div>
                    <div className="py-3">
                        <p className="text-xs font-black tracking-[0.18em] text-orange-500 uppercase">
                            {selectedProduct.category}
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
                            {selectedProduct.name}
                        </h1>
                        <div className="mt-4 flex items-center gap-3 text-sm">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 font-black text-white">
                                {selectedProduct.rating}
                                <Star className="size-3 fill-current" />
                            </span>
                            <span className="text-slate-500">
                                1,248 verified ratings
                            </span>
                        </div>
                        <p className="mt-6 text-3xl font-black">
                            {money.format(selectedProduct.price)}{' '}
                            <span className="ml-2 text-base font-medium text-slate-400 line-through">
                                {money.format(selectedProduct.original)}
                            </span>
                        </p>
                        <p className="mt-5 max-w-xl leading-7 text-slate-600 dark:text-slate-300">
                            Designed for modern everyday life with dependable
                            performance, thoughtful details, and quality you can
                            feel from the first use.
                        </p>
                        <div className="mt-7">
                            <p className="text-sm font-black">Choose colour</p>
                            <div className="mt-3 flex gap-3">
                                {[
                                    'bg-slate-950',
                                    'bg-orange-500',
                                    'bg-violet-500',
                                ].map((tone) => (
                                    <button
                                        key={tone}
                                        type="button"
                                        aria-label={`Choose ${tone} colour`}
                                        className={`size-9 rounded-full border-4 border-white shadow ring-1 ring-slate-200 ${tone}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={cart.url()}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white hover:bg-orange-500 dark:bg-orange-500"
                            >
                                <ShoppingBag className="size-4" /> Add to cart
                            </Link>
                            <Link
                                href={wishlist.url()}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-black dark:border-white/10 dark:bg-white/5"
                            >
                                <Heart className="size-4" /> Save
                            </Link>
                        </div>
                        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-200 pt-6 text-center text-xs font-bold dark:border-white/10">
                            <span className="grid gap-2">
                                <Truck className="mx-auto size-5 text-blue-500" />{' '}
                                Fast delivery
                            </span>
                            <span className="grid gap-2">
                                <ShieldCheck className="mx-auto size-5 text-violet-500" />{' '}
                                Secure payment
                            </span>
                            <span className="grid gap-2">
                                <PackageCheck className="mx-auto size-5 text-emerald-500" />{' '}
                                Easy returns
                            </span>
                        </div>
                    </div>
                </section>

                <section className="mt-20">
                    <div className="flex items-center gap-2">
                        <BadgeCheck className="size-5 text-orange-500" />
                        <h2 className="text-2xl font-black">
                            You may also like
                        </h2>
                    </div>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {relatedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            </div>
        </StorefrontLayout>
    );
}
