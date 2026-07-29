import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Grid2X2,
    List,
    SearchX,
    SlidersHorizontal,
    Sparkles,
    Star,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { categories, money, products } from '@/components/storefront/catalog';
import type { StorefrontProduct } from '@/components/storefront/catalog';
import CategoryModule from '@/components/storefront/category-module';
import ProductCard from '@/components/storefront/product-card';
import ProductImage from '@/components/storefront/product-image';
import StorefrontLayout from '@/layouts/storefront-layout';
import { product as productRoute } from '@/routes/storefront';

const pageSize = 3;
const unique = (values: string[]) => ['All', ...new Set(values)];

type ViewMode = 'grid' | 'list';
type DiscoveryMode =
    | 'All products'
    | 'Deals & offers'
    | 'New arrivals'
    | 'Best sellers'
    | 'Recommended';

export default function Catalog() {
    const { url } = usePage();
    const parameters = new URLSearchParams(url.split('?')[1] ?? '');
    const [query, setQuery] = useState(parameters.get('search') ?? '');
    const [category, setCategory] = useState(
        parameters.get('category') ?? 'All',
    );
    const [subcategory, setSubcategory] = useState('All');
    const [brand, setBrand] = useState('All');
    const [seller, setSeller] = useState('All');
    const [collection, setCollection] = useState('All');
    const [minimumPrice, setMinimumPrice] = useState(0);
    const [maximumPrice, setMaximumPrice] = useState(60000);
    const [minimumDiscount, setMinimumDiscount] = useState(0);
    const [minimumRating, setMinimumRating] = useState(0);
    const [availability, setAvailability] = useState('All');
    const [size, setSize] = useState('All');
    const [color, setColor] = useState('All');
    const [material, setMaterial] = useState('All');
    const [gender, setGender] = useState('All');
    const [deliveryZone, setDeliveryZone] = useState('All');
    const [cashOnDeliveryOnly, setCashOnDeliveryOnly] = useState(false);
    const [freeShippingOnly, setFreeShippingOnly] = useState(false);
    const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>(
        parameters.get('sort') === 'new'
            ? 'New arrivals'
            : parameters.get('sort') === 'deals'
              ? 'Deals & offers'
              : 'All products',
    );
    const [sort, setSort] = useState('Relevance');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [visibleCount, setVisibleCount] = useState(pageSize);
    const [currentPage, setCurrentPage] = useState(1);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const filteredProducts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        const matches = products.filter((product) => {
            const searchable =
                `${product.name} ${product.category} ${product.subcategory} ${product.brand} ${product.seller} ${product.collection}`.toLowerCase();
            const modeMatches =
                discoveryMode === 'All products' ||
                (discoveryMode === 'Deals & offers' &&
                    product.price < product.original) ||
                (discoveryMode === 'New arrivals' && product.id >= 4) ||
                (discoveryMode === 'Best sellers' && product.isBestSeller) ||
                (discoveryMode === 'Recommended' && product.isRecommended);
            const discount = Math.round(
                (1 - product.price / product.original) * 100,
            );

            return (
                (category === 'All' || product.category === category) &&
                (subcategory === 'All' ||
                    product.subcategory === subcategory) &&
                (brand === 'All' || product.brand === brand) &&
                (seller === 'All' || product.seller === seller) &&
                (collection === 'All' || product.collection === collection) &&
                product.price >= minimumPrice &&
                product.price <= maximumPrice &&
                discount >= minimumDiscount &&
                product.rating >= minimumRating &&
                (availability === 'All' ||
                    (availability === 'In stock' && product.stock > 0) ||
                    (availability === 'Out of stock' && product.stock === 0)) &&
                (size === 'All' || product.sizes.includes(size)) &&
                (color === 'All' || product.colors.includes(color)) &&
                (material === 'All' || product.material === material) &&
                (gender === 'All' || product.gender === gender) &&
                (deliveryZone === 'All' ||
                    product.deliveryZones.includes(deliveryZone)) &&
                (!cashOnDeliveryOnly || product.cashOnDelivery) &&
                (!freeShippingOnly || product.freeShipping) &&
                modeMatches &&
                (normalizedQuery === '' || searchable.includes(normalizedQuery))
            );
        });

        return [...matches].sort((first, second) => {
            if (sort === 'Price: Low to high') {
                return first.price - second.price;
            }

            if (sort === 'Price: High to low') {
                return second.price - first.price;
            }

            if (sort === 'Highest rated') {
                return second.rating - first.rating;
            }

            if (sort === 'Latest products') {
                return second.id - first.id;
            }

            if (sort === 'Highest discount') {
                return (
                    1 -
                    second.price / second.original -
                    (1 - first.price / first.original)
                );
            }

            if (sort === 'Popularity') {
                return second.popularity - first.popularity;
            }

            if (sort === 'Best selling') {
                return Number(second.isBestSeller) - Number(first.isBestSeller);
            }

            return first.id - second.id;
        });
    }, [
        brand,
        cashOnDeliveryOnly,
        category,
        color,
        collection,
        deliveryZone,
        discoveryMode,
        freeShippingOnly,
        gender,
        material,
        maximumPrice,
        minimumDiscount,
        minimumPrice,
        minimumRating,
        query,
        seller,
        size,
        sort,
        subcategory,
        availability,
    ]);

    const pageCount = Math.max(
        1,
        Math.ceil(filteredProducts.length / pageSize),
    );
    const visibleProducts = filteredProducts.slice(0, visibleCount);

    useEffect(() => {
        const target = loadMoreRef.current;

        if (!target || visibleCount >= filteredProducts.length) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisibleCount((count) =>
                        Math.min(count + pageSize, filteredProducts.length),
                    );
                }
            },
            { rootMargin: '200px' },
        );
        observer.observe(target);

        return () => observer.disconnect();
    }, [filteredProducts.length, visibleCount]);

    const goToPage = (page: number) => {
        const nextPage = Math.min(Math.max(page, 1), pageCount);
        setCurrentPage(nextPage);
        setVisibleCount(Math.min(nextPage * pageSize, filteredProducts.length));
        document
            .querySelector('#product-results')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const clearFilters = () => {
        setQuery('');
        setCategory('All');
        setSubcategory('All');
        setBrand('All');
        setSeller('All');
        setCollection('All');
        setMinimumPrice(0);
        setMaximumPrice(60000);
        setMinimumDiscount(0);
        setMinimumRating(0);
        setAvailability('All');
        setSize('All');
        setColor('All');
        setMaterial('All');
        setGender('All');
        setDeliveryZone('All');
        setCashOnDeliveryOnly(false);
        setFreeShippingOnly(false);
        setDiscoveryMode('All products');
    };

    return (
        <StorefrontLayout query={query} onQueryChange={setQuery}>
            <Head title="Discover products" />
            <section className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.025]">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.18em] text-orange-500 uppercase">
                        <Sparkles className="size-4" /> Product discovery
                    </span>
                    <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                        Find your next favourite.
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
                        Browse by category, brand, seller, collection, or the
                        way you like to shop.
                    </p>
                    <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
                        {(
                            [
                                'All products',
                                'Deals & offers',
                                'New arrivals',
                                'Best sellers',
                                'Recommended',
                            ] as DiscoveryMode[]
                        ).map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => setDiscoveryMode(mode)}
                                className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-black transition ${discoveryMode === mode ? 'bg-slate-950 text-white dark:bg-orange-500' : 'bg-slate-100 hover:bg-orange-50 hover:text-orange-600 dark:bg-white/5'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <CategoryModule
                activeCategory={category}
                activeSubcategory={subcategory}
                onCategoryChange={setCategory}
                onSubcategoryChange={setSubcategory}
            />

            <section
                id="product-results"
                className="mx-auto grid max-w-7xl scroll-mt-32 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8"
            >
                <aside>
                    <div className="sticky top-32 max-h-[calc(100vh-9rem)] [scrollbar-width:thin] overflow-y-auto rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
                        <div className="flex items-center gap-2 font-black">
                            <SlidersHorizontal className="size-4" /> Refine
                            discovery
                        </div>
                        <div className="mt-6 grid gap-4">
                            <FilterSelect
                                label="Category"
                                value={category}
                                options={[
                                    'All',
                                    ...categories.map((item) => item.label),
                                ]}
                                onChange={setCategory}
                            />
                            <FilterSelect
                                label="Subcategory"
                                value={subcategory}
                                options={unique(
                                    products
                                        .filter(
                                            (product) =>
                                                category === 'All' ||
                                                product.category === category,
                                        )
                                        .map((product) => product.subcategory),
                                )}
                                onChange={setSubcategory}
                            />
                            <FilterSelect
                                label="Brand"
                                value={brand}
                                options={unique(
                                    products.map((product) => product.brand),
                                )}
                                onChange={setBrand}
                            />
                            <FilterSelect
                                label="Seller / store"
                                value={seller}
                                options={unique(
                                    products.map((product) => product.seller),
                                )}
                                onChange={setSeller}
                            />
                            <FilterSelect
                                label="Collection"
                                value={collection}
                                options={unique(
                                    products.map(
                                        (product) => product.collection,
                                    ),
                                )}
                                onChange={setCollection}
                            />
                            <fieldset className="grid gap-2">
                                <legend className="text-xs font-black text-slate-500">
                                    Price range
                                </legend>
                                <div className="grid grid-cols-2 gap-2">
                                    <NumberFilter
                                        label="Minimum price"
                                        value={minimumPrice}
                                        onChange={setMinimumPrice}
                                    />
                                    <NumberFilter
                                        label="Maximum price"
                                        value={maximumPrice}
                                        onChange={setMaximumPrice}
                                    />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="60000"
                                    step="500"
                                    value={maximumPrice}
                                    onChange={(event) =>
                                        setMaximumPrice(
                                            Number(event.target.value),
                                        )
                                    }
                                    aria-label="Maximum price"
                                    className="w-full accent-orange-500"
                                />
                                <p className="text-[10px] font-bold text-slate-400">
                                    {money.format(minimumPrice)} –{' '}
                                    {money.format(maximumPrice)}
                                </p>
                            </fieldset>
                            <FilterSelect
                                label="Discount"
                                value={String(minimumDiscount)}
                                options={['0', '10', '20', '30', '40', '50']}
                                optionLabel={(option) =>
                                    option === '0'
                                        ? 'Any discount'
                                        : `${option}% or more`
                                }
                                onChange={(value) =>
                                    setMinimumDiscount(Number(value))
                                }
                            />
                            <FilterSelect
                                label="Customer rating"
                                value={String(minimumRating)}
                                options={['0', '3', '4', '4.5']}
                                optionLabel={(option) =>
                                    option === '0'
                                        ? 'Any rating'
                                        : `${option}★ & above`
                                }
                                onChange={(value) =>
                                    setMinimumRating(Number(value))
                                }
                            />
                            <FilterSelect
                                label="Availability"
                                value={availability}
                                options={['All', 'In stock', 'Out of stock']}
                                onChange={setAvailability}
                            />

                            <div className="border-t border-slate-100 pt-4 dark:border-white/10">
                                <p className="mb-3 text-xs font-black text-slate-500">
                                    Product attributes
                                </p>
                                <div className="grid gap-4">
                                    <FilterSelect
                                        label="Size"
                                        value={size}
                                        options={unique(
                                            products.flatMap(
                                                (product) => product.sizes,
                                            ),
                                        )}
                                        onChange={setSize}
                                    />
                                    <FilterSelect
                                        label="Color"
                                        value={color}
                                        options={unique(
                                            products.flatMap(
                                                (product) => product.colors,
                                            ),
                                        )}
                                        onChange={setColor}
                                    />
                                    <FilterSelect
                                        label="Material"
                                        value={material}
                                        options={unique(
                                            products.map(
                                                (product) => product.material,
                                            ),
                                        )}
                                        onChange={setMaterial}
                                    />
                                    <FilterSelect
                                        label="Gender"
                                        value={gender}
                                        options={unique(
                                            products.map(
                                                (product) => product.gender,
                                            ),
                                        )}
                                        onChange={setGender}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 dark:border-white/10">
                                <p className="mb-3 text-xs font-black text-slate-500">
                                    Delivery options
                                </p>
                                <div className="grid gap-3">
                                    <FilterSelect
                                        label="Delivery availability"
                                        value={deliveryZone}
                                        options={unique(
                                            products.flatMap(
                                                (product) =>
                                                    product.deliveryZones,
                                            ),
                                        )}
                                        onChange={setDeliveryZone}
                                    />
                                    <FilterCheckbox
                                        label="Cash on delivery"
                                        checked={cashOnDeliveryOnly}
                                        onChange={setCashOnDeliveryOnly}
                                    />
                                    <FilterCheckbox
                                        label="Free shipping"
                                        checked={freeShippingOnly}
                                        onChange={setFreeShippingOnly}
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black hover:border-orange-300 hover:text-orange-600 dark:border-white/10"
                        >
                            Clear all filters
                        </button>
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
                        <div className="flex items-center gap-2">
                            <select
                                value={sort}
                                onChange={(event) =>
                                    setSort(event.target.value)
                                }
                                className="min-w-0 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold outline-none dark:border-white/10 dark:bg-slate-900"
                            >
                                {[
                                    'Relevance',
                                    'Popularity',
                                    'Price: Low to high',
                                    'Price: High to low',
                                    'Latest products',
                                    'Highest discount',
                                    'Highest rated',
                                    'Best selling',
                                ].map((option) => (
                                    <option key={option}>{option}</option>
                                ))}
                            </select>
                            <div className="flex rounded-full border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/5">
                                <ViewButton
                                    label="Grid view"
                                    active={viewMode === 'grid'}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid2X2 className="size-4" />
                                </ViewButton>
                                <ViewButton
                                    label="List view"
                                    active={viewMode === 'list'}
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="size-4" />
                                </ViewButton>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            viewMode === 'grid'
                                ? 'mt-6 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3'
                                : 'mt-6 grid gap-4'
                        }
                    >
                        {visibleProducts.map((product) =>
                            viewMode === 'grid' ? (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ) : (
                                <ProductListCard
                                    key={product.id}
                                    product={product}
                                />
                            ),
                        )}
                    </div>

                    {filteredProducts.length === 0 && (
                        <NoResults query={query} onClear={clearFilters} />
                    )}
                    <div ref={loadMoreRef} className="h-1" aria-hidden="true" />

                    {filteredProducts.length > 0 && (
                        <nav
                            aria-label="Product pagination"
                            className="mt-10 flex items-center justify-center gap-2"
                        >
                            <PageButton
                                label="Previous page"
                                disabled={currentPage === 1}
                                onClick={() => goToPage(currentPage - 1)}
                            >
                                <ChevronLeft className="size-4" />
                            </PageButton>
                            {Array.from(
                                { length: pageCount },
                                (_, index) => index + 1,
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => goToPage(page)}
                                    aria-current={
                                        page === currentPage
                                            ? 'page'
                                            : undefined
                                    }
                                    className={`grid size-9 place-items-center rounded-full text-xs font-black ${page === currentPage ? 'bg-slate-950 text-white dark:bg-orange-500' : 'border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <PageButton
                                label="Next page"
                                disabled={currentPage === pageCount}
                                onClick={() => goToPage(currentPage + 1)}
                            >
                                <ChevronRight className="size-4" />
                            </PageButton>
                        </nav>
                    )}
                </div>
            </section>
        </StorefrontLayout>
    );
}

function FilterSelect({
    label,
    value,
    options,
    onChange,
    optionLabel,
}: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    optionLabel?: (option: string) => string;
}) {
    return (
        <label className="grid gap-1.5 text-xs font-black text-slate-500">
            <span>{label}</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-950 outline-none focus:border-orange-400 dark:border-white/10 dark:bg-slate-900 dark:text-white"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {optionLabel?.(option) ?? option}
                    </option>
                ))}
            </select>
        </label>
    );
}

function NumberFilter({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
}) {
    return (
        <label>
            <span className="sr-only">{label}</span>
            <input
                type="number"
                min="0"
                step="500"
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold outline-none focus:border-orange-400 dark:border-white/10 dark:bg-slate-950"
            />
        </label>
    );
}

function FilterCheckbox({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-xs font-bold">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="size-4 rounded border-slate-300 accent-orange-500"
            />
            {label}
        </label>
    );
}

function ProductListCard({ product }: { product: StorefrontProduct }) {
    return (
        <article className="grid overflow-hidden rounded-[1.5rem] border border-slate-950/8 bg-white shadow-sm sm:grid-cols-[190px_1fr] dark:border-white/10 dark:bg-white/5">
            <Link
                href={productRoute.url(product.slug)}
                className="relative min-h-48 overflow-hidden bg-slate-100"
            >
                <ProductImage
                    product={product}
                    className="absolute inset-0 size-full transition hover:scale-105"
                />
            </Link>
            <div className="flex flex-col justify-center p-5 sm:p-7">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black tracking-wide text-slate-400 uppercase">
                    <span>
                        {product.category} / {product.subcategory}
                    </span>
                    <span className="rounded-full bg-orange-50 px-2 py-1 text-orange-600 dark:bg-orange-500/10">
                        {product.offer}
                    </span>
                </div>
                <h2 className="mt-2 text-xl font-black">
                    <Link
                        href={productRoute.url(product.slug)}
                        className="hover:text-orange-500"
                    >
                        {product.name}
                    </Link>
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    By {product.brand} · Sold by {product.seller} ·{' '}
                    {product.collection}
                </p>
                <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                        <span className="text-xl font-black">
                            {money.format(product.price)}
                        </span>
                        <span className="ml-2 text-xs text-slate-400 line-through">
                            {money.format(product.original)}
                        </span>
                        <span className="ml-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                            {product.rating}
                            <Star className="size-3 fill-current" />
                        </span>
                    </div>
                    <Link
                        href={productRoute.url(product.slug)}
                        className="inline-flex items-center gap-2 text-sm font-black text-orange-600"
                    >
                        View product <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
    return (
        <div className="mt-6 rounded-[2rem] border border-dashed border-slate-300 p-8 text-center dark:border-white/10">
            <SearchX className="mx-auto size-8 text-slate-300" />
            <p className="mt-3 text-lg font-black">
                No exact products found{query ? ` for “${query}”` : ''}
            </p>
            <p className="mt-2 text-sm text-slate-500">
                Try a broader term, check the spelling, or explore these popular
                alternatives.
            </p>
            <button
                type="button"
                onClick={onClear}
                className="mt-4 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white dark:bg-orange-500"
            >
                Show recommended products
            </button>
            <div className="mt-8 grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
                {products.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

function ViewButton({
    label,
    active,
    onClick,
    children,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={`grid size-8 place-items-center rounded-full ${active ? 'bg-slate-950 text-white dark:bg-orange-500' : 'text-slate-400'}`}
        >
            {children}
        </button>
    );
}

function PageButton({
    label,
    disabled,
    onClick,
    children,
}: {
    label: string;
    disabled: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/10 dark:bg-white/5"
        >
            {children}
        </button>
    );
}
