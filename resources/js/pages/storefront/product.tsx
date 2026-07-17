import { Head, Link } from '@inertiajs/react';
import {
    ChevronRight,
    Heart,
    PackageCheck,
    ShieldCheck,
    ShoppingBag,
    Star,
    Truck,
} from 'lucide-react';
import { money, products } from '@/components/storefront/catalog';
import ProductBundleSection from '@/components/storefront/product-bundle-section';
import ProductRecommendationSection from '@/components/storefront/product-recommendation-section';
import ProductReviewSection from '@/components/storefront/product-review-section';
import StorefrontLayout from '@/layouts/storefront-layout';
import { cart, catalog, wishlist } from '@/routes/storefront';

export default function Product({ productSlug }: { productSlug: string }) {
    const selectedProduct =
        products.find((item) => item.slug === productSlug) ?? products[0];
    const Icon = selectedProduct.icon;
    const alternativeProducts = products.filter(
        (item) => item.id !== selectedProduct.id,
    );
    const suggestedProducts = alternativeProducts.slice(0, 3);
    const moreProducts = [...alternativeProducts].reverse().slice(0, 3);
    const recentlyViewedProducts = [
        ...alternativeProducts.slice(2),
        ...alternativeProducts.slice(0, 2),
    ].slice(0, 3);
    const bundleProducts = [
        selectedProduct,
        ...alternativeProducts.slice(0, 2),
    ];

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

                <div className="mt-20 grid gap-20">
                    <ProductBundleSection products={bundleProducts} />
                    <ProductReviewSection product={selectedProduct} />
                    <ProductRecommendationSection
                        eyebrow="Picked around your taste"
                        title="Suggested for you"
                        description="Thoughtful recommendations inspired by the product you are viewing."
                        products={suggestedProducts}
                    />
                    <ProductRecommendationSection
                        eyebrow="Keep discovering"
                        title="More for you"
                        description="Fresh finds across categories, prices, and everyday moments."
                        products={moreProducts}
                        tone="soft"
                    />
                    <ProductRecommendationSection
                        eyebrow="Back to your browsing"
                        title="Recently viewed"
                        description="A quick way back to products that caught your attention."
                        products={recentlyViewedProducts}
                    />
                </div>
            </div>
        </StorefrontLayout>
    );
}
