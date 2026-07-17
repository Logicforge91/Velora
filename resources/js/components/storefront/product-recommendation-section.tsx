import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { StorefrontProduct } from '@/components/storefront/catalog';
import ProductCard from '@/components/storefront/product-card';
import { catalog } from '@/routes/storefront';

type Props = {
    eyebrow: string;
    title: string;
    description: string;
    products: StorefrontProduct[];
    tone?: 'plain' | 'soft';
};

export default function ProductRecommendationSection({
    eyebrow,
    title,
    description,
    products,
    tone = 'plain',
}: Props) {
    return (
        <section
            className={
                tone === 'soft'
                    ? 'rounded-[2.5rem] bg-white p-6 sm:p-8 dark:bg-white/[0.035]'
                    : ''
            }
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[11px] font-black tracking-[0.2em] text-orange-500 uppercase">
                        {eyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
                <Link
                    href={catalog.url()}
                    prefetch
                    className="inline-flex shrink-0 items-center gap-2 text-sm font-black text-orange-500"
                >
                    View all <ArrowRight className="size-4" />
                </Link>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
