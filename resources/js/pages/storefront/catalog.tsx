import { Head, usePage } from '@inertiajs/react';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { categories, products } from '@/components/storefront/catalog';
import ProductCard from '@/components/storefront/product-card';
import StorefrontLayout from '@/layouts/storefront-layout';

export default function Catalog() {
    const { url } = usePage();
    const parameters = new URLSearchParams(url.split('?')[1] ?? '');
    const editCategories = [
        'All',
        'Home',
        'Fashion',
        'Accessories',
        'Electronics',
    ];
    const requestedEdit = Number(parameters.get('edit') ?? 0);
    const requestedSort = parameters.get('sort');
    const [query, setQuery] = useState(parameters.get('search') ?? '');
    const [category, setCategory] = useState(
        parameters.get('category') ?? editCategories[requestedEdit] ?? 'All',
    );
    const [sort, setSort] = useState(
        requestedSort === 'rating'
            ? 'Top rated'
            : requestedSort === 'new'
              ? 'Newest'
              : requestedSort === 'deals'
                ? 'Biggest savings'
                : 'Featured',
    );
    const filteredProducts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        const matches = products.filter(
            (product) =>
                (category === 'All' || product.category === category) &&
                (normalizedQuery === '' ||
                    `${product.name} ${product.category}`
                        .toLowerCase()
                        .includes(normalizedQuery)),
        );

        return [...matches].sort((first, second) => {
            if (sort === 'Price: Low to high') {
                return first.price - second.price;
            }

            if (sort === 'Price: High to low') {
                return second.price - first.price;
            }

            if (sort === 'Top rated') {
                return second.rating - first.rating;
            }

            if (sort === 'Newest') {
                return second.id - first.id;
            }

            if (sort === 'Biggest savings') {
                const firstSaving = 1 - first.price / first.original;
                const secondSaving = 1 - second.price / second.original;

                return secondSaving - firstSaving;
            }

            return first.id - second.id;
        });
    }, [category, query, sort]);

    return (
        <StorefrontLayout query={query} onQueryChange={setQuery}>
            <Head title="Shop all products" />
            <section className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.025]">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.18em] text-orange-500 uppercase">
                        <Sparkles className="size-4" /> The Velora edit
                    </span>
                    <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                        Find something brilliant.
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
                        Explore trusted products across technology, fashion,
                        home, and everyday essentials.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
                <aside>
                    <div className="sticky top-32 rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-center gap-2 font-black">
                            <SlidersHorizontal className="size-4" /> Filters
                        </div>
                        <div className="mt-6 grid gap-2">
                            {[
                                'All',
                                ...categories.map((item) => item.label),
                            ].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setCategory(item)}
                                    className={`rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${category === item ? 'bg-slate-950 text-white dark:bg-orange-500' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
                <div>
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <p className="text-sm font-bold text-slate-500">
                            <span className="text-slate-950 dark:text-white">
                                {filteredProducts.length}
                            </span>{' '}
                            products found
                        </p>
                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold outline-none dark:border-white/10 dark:bg-slate-900"
                        >
                            {[
                                'Featured',
                                'Newest',
                                'Biggest savings',
                                'Price: Low to high',
                                'Price: High to low',
                                'Top rated',
                            ].map((option) => (
                                <option key={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="mt-6 rounded-[2rem] border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
                            <p className="text-lg font-black">
                                No products found
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery('');
                                    setCategory('All');
                                }}
                                className="mt-2 text-sm font-bold text-orange-500"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </StorefrontLayout>
    );
}
