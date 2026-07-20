import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import type { StorefrontProduct } from '@/components/storefront/catalog';
import { categories } from '@/components/storefront/catalog';
import ProductCard from '@/components/storefront/product-card';
import SectionTitle from '@/components/storefront/section-title';
import { catalog } from '@/routes/storefront';

type Props = {
    activeCategory: string;
    products: StorefrontProduct[];
    onCategoryChange: (category: string) => void;
    onClear: () => void;
};

export default function DealsSection({
    activeCategory,
    products,
    onCategoryChange,
    onClear,
}: Props) {
    return (
        <section
            id="deals"
            className="scroll-mt-24 border-y border-slate-950/8 bg-white py-14 sm:py-20 lg:scroll-mt-36 dark:border-white/10 dark:bg-white/[0.025]"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <SectionTitle
                        eyebrow="Limited-time savings"
                        title="Deals worth discovering"
                        description="Hand-picked offers with prices you'll love."
                    />
                    <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                        {[
                            'All',
                            ...categories.map((category) => category.label),
                        ].map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => onCategoryChange(category)}
                                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${activeCategory === category ? 'bg-slate-950 text-white dark:bg-orange-500' : 'bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:bg-white/5 dark:text-slate-300'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {products.length === 0 && (
                    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
                        <Search className="mx-auto size-8 text-slate-300" />
                        <p className="mt-3 font-black">
                            No matching deals found
                        </p>
                        <button
                            type="button"
                            onClick={onClear}
                            className="mt-2 text-sm font-bold text-orange-500"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
                {products.length > 0 && (
                    <div className="mt-10 text-center">
                        <Link
                            href={catalog.url()}
                            prefetch
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-white/5"
                        >
                            View all products
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
