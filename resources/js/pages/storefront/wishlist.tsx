import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Heart } from 'lucide-react';
import { products } from '@/components/storefront/catalog';
import ProductCard from '@/components/storefront/product-card';
import StorefrontLayout from '@/layouts/storefront-layout';
import { catalog } from '@/routes/storefront';

export default function Wishlist() {
    const savedProducts = products.slice(1, 5);

    return (
        <StorefrontLayout>
            <Head title="Your wishlist" />
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.18em] text-rose-500 uppercase">
                            <Heart className="size-4 fill-current" /> Saved for
                            later
                        </span>
                        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                            Your wishlist
                        </h1>
                        <p className="mt-3 text-slate-500 dark:text-slate-400">
                            Keep the things you love close by.
                        </p>
                    </div>
                    <Link
                        href={catalog.url()}
                        className="inline-flex items-center gap-2 text-sm font-black text-orange-500"
                    >
                        Continue shopping <ArrowRight className="size-4" />
                    </Link>
                </div>
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {savedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </StorefrontLayout>
    );
}
