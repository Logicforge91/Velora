import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    Copy,
    PackageCheck,
    Plus,
    ShoppingCart,
    Star,
    Store,
    Trash2,
    Truck,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { money, products } from '@/components/storefront/catalog';
import type { StorefrontProduct } from '@/components/storefront/catalog';
import ProductImage from '@/components/storefront/product-image';
import StorefrontLayout from '@/layouts/storefront-layout';
import { cart, catalog, product as productRoute } from '@/routes/storefront';

const maximumComparedProducts = 4;

type ComparisonRow = {
    label: string;
    value: (product: StorefrontProduct) => string;
};

const specificationRows: ComparisonRow[] = [
    { label: 'Category', value: (product) => product.category },
    { label: 'Subcategory', value: (product) => product.subcategory },
    { label: 'Brand', value: (product) => product.brand },
    { label: 'Material', value: (product) => product.material },
    { label: 'Available sizes', value: (product) => product.sizes.join(', ') },
    {
        label: 'Available colors',
        value: (product) => product.colors.join(', '),
    },
    { label: 'Designed for', value: (product) => product.gender },
    {
        label: 'Delivery coverage',
        value: (product) => product.deliveryZones.join(', '),
    },
    {
        label: 'Cash on delivery',
        value: (product) =>
            product.cashOnDelivery ? 'Available' : 'Unavailable',
    },
    {
        label: 'Shipping',
        value: (product) =>
            product.freeShipping ? 'Free shipping' : 'Calculated',
    },
    {
        label: 'Availability',
        value: (product) =>
            product.stock > 0 ? `${product.stock} in stock` : 'Out of stock',
    },
];

function initialComparedProducts(requestedProduct?: StorefrontProduct) {
    const initialProducts = products.slice(0, 3);

    if (
        requestedProduct &&
        !initialProducts.some((product) => product.id === requestedProduct.id)
    ) {
        initialProducts.unshift(requestedProduct);
        initialProducts.pop();
    }

    return initialProducts;
}

export default function Comparison() {
    const { url } = usePage();
    const parameters = new URLSearchParams(url.split('?')[1] ?? '');
    const requestedProduct = products.find(
        (product) => product.slug === parameters.get('add'),
    );
    const [comparedProducts, setComparedProducts] = useState<
        StorefrontProduct[]
    >(() => initialComparedProducts(requestedProduct));
    const [selectedProductId, setSelectedProductId] = useState('');
    const [highlightDifferences, setHighlightDifferences] = useState(true);
    const availableProducts = products.filter(
        (product) =>
            !comparedProducts.some(
                (comparedProduct) => comparedProduct.id === product.id,
            ),
    );
    const lowestPrice = Math.min(
        ...comparedProducts.map((product) => product.price),
    );
    const highestRating = Math.max(
        ...comparedProducts.map((product) => product.rating),
    );

    const addProduct = () => {
        const product = products.find(
            (candidate) => candidate.id === Number(selectedProductId),
        );

        if (!product || comparedProducts.length >= maximumComparedProducts) {
            return;
        }

        setComparedProducts((current) => [...current, product]);
        setSelectedProductId('');
    };

    return (
        <StorefrontLayout>
            <Head title="Compare products" />
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                    <div>
                        <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.18em] text-orange-500 uppercase">
                            <Copy className="size-4" /> Side-by-side
                        </span>
                        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                            Compare products
                        </h1>
                        <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
                            Compare prices, specifications, ratings, sellers,
                            and availability before you decide.
                        </p>
                    </div>
                    <Link
                        href={catalog.url()}
                        className="inline-flex items-center gap-2 text-sm font-black text-orange-500"
                    >
                        Browse products <ArrowRight className="size-4" />
                    </Link>
                </div>

                <div className="mt-8 flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 sm:flex-row sm:items-center dark:border-white/10 dark:bg-white/5">
                    <label className="min-w-0 flex-1">
                        <span className="sr-only">Select another product</span>
                        <select
                            value={selectedProductId}
                            onChange={(event) =>
                                setSelectedProductId(event.target.value)
                            }
                            disabled={
                                comparedProducts.length >=
                                maximumComparedProducts
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-orange-400 disabled:opacity-50 dark:border-white/10 dark:bg-slate-900"
                        >
                            <option value="">
                                {comparedProducts.length >=
                                maximumComparedProducts
                                    ? 'Comparison is full'
                                    : 'Choose a product to compare'}
                            </option>
                            {availableProducts.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="button"
                        onClick={addProduct}
                        disabled={
                            selectedProductId === '' ||
                            comparedProducts.length >= maximumComparedProducts
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-orange-500"
                    >
                        <Plus className="size-4" /> Add product
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            setHighlightDifferences((current) => !current)
                        }
                        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-black ${highlightDifferences ? 'border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-500/10' : 'border-slate-200 dark:border-white/10'}`}
                    >
                        {highlightDifferences ? (
                            <Check className="size-4" />
                        ) : (
                            <X className="size-4" />
                        )}
                        Highlight differences
                    </button>
                </div>

                {comparedProducts.length > 0 ? (
                    <ComparisonTable
                        products={comparedProducts}
                        lowestPrice={lowestPrice}
                        highestRating={highestRating}
                        highlightDifferences={highlightDifferences}
                        onRemove={(productId) =>
                            setComparedProducts((current) =>
                                current.filter(
                                    (product) => product.id !== productId,
                                ),
                            )
                        }
                    />
                ) : (
                    <div className="mt-6 rounded-[2rem] border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
                        <Copy className="mx-auto size-10 text-slate-300" />
                        <h2 className="mt-4 text-xl font-black">
                            Add products to start comparing.
                        </h2>
                    </div>
                )}
            </section>
        </StorefrontLayout>
    );
}

function ComparisonTable({
    products: comparedProducts,
    lowestPrice,
    highestRating,
    highlightDifferences,
    onRemove,
}: {
    products: StorefrontProduct[];
    lowestPrice: number;
    highestRating: number;
    highlightDifferences: boolean;
    onRemove: (productId: number) => void;
}) {
    return (
        <div className="mt-6 overflow-x-auto rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
            <div
                className="grid min-w-[760px]"
                style={{
                    gridTemplateColumns: `180px repeat(${comparedProducts.length}, minmax(190px, 1fr))`,
                }}
            >
                <div className="border-r border-b border-slate-200 p-5 dark:border-white/10">
                    <p className="text-xs font-black tracking-wider text-slate-400 uppercase">
                        Products
                    </p>
                </div>
                {comparedProducts.map((product) => (
                    <ProductColumn
                        key={product.id}
                        product={product}
                        lowestPrice={lowestPrice}
                        highestRating={highestRating}
                        onRemove={() => onRemove(product.id)}
                    />
                ))}
                <ComparisonRow
                    label="Seller"
                    values={comparedProducts.map((product) => product.seller)}
                    highlightDifferences={highlightDifferences}
                    icon={<Store className="size-4" />}
                />
                <ComparisonRow
                    label="Price"
                    values={comparedProducts.map((product) =>
                        money.format(product.price),
                    )}
                    highlightDifferences={highlightDifferences}
                />
                <ComparisonRow
                    label="Customer rating"
                    values={comparedProducts.map(
                        (product) => `${product.rating} / 5`,
                    )}
                    highlightDifferences={highlightDifferences}
                    icon={<Star className="size-4" />}
                />
                {specificationRows.map((row) => (
                    <ComparisonRow
                        key={row.label}
                        label={row.label}
                        values={comparedProducts.map(row.value)}
                        highlightDifferences={highlightDifferences}
                        icon={
                            row.label === 'Delivery coverage' ? (
                                <Truck className="size-4" />
                            ) : row.label === 'Availability' ? (
                                <PackageCheck className="size-4" />
                            ) : undefined
                        }
                    />
                ))}
            </div>
        </div>
    );
}

function ProductColumn({
    product,
    lowestPrice,
    highestRating,
    onRemove,
}: {
    product: StorefrontProduct;
    lowestPrice: number;
    highestRating: number;
    onRemove: () => void;
}) {
    return (
        <article className="relative border-r border-b border-slate-200 p-4 last:border-r-0 dark:border-white/10">
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-3 right-3 z-10 grid size-8 place-items-center rounded-full bg-white text-slate-400 shadow hover:text-rose-500 dark:bg-slate-900"
                aria-label={`Remove ${product.name} from comparison`}
            >
                <Trash2 className="size-4" />
            </button>
            <Link
                href={productRoute.url(product.slug)}
                className="block aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"
            >
                <ProductImage product={product} className="size-full" />
            </Link>
            <p className="mt-3 text-[10px] font-black tracking-wider text-slate-400 uppercase">
                {product.brand}
            </p>
            <h2 className="mt-1 min-h-10 text-sm font-black">
                <Link
                    href={productRoute.url(product.slug)}
                    className="hover:text-orange-500"
                >
                    {product.name}
                </Link>
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                    className={`text-lg font-black ${product.price === lowestPrice ? 'text-emerald-600' : ''}`}
                >
                    {money.format(product.price)}
                </span>
                {product.price === lowestPrice && (
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-700 uppercase">
                        Lowest
                    </span>
                )}
            </div>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {product.rating}
                {product.rating === highestRating && (
                    <span className="text-emerald-600">Best rated</span>
                )}
            </p>
            {product.stock > 0 ? (
                <Link
                    href={cart.url({ query: { add: product.slug } })}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-black text-white hover:bg-orange-500 dark:bg-orange-500"
                >
                    <ShoppingCart className="size-4" /> Add to cart
                </Link>
            ) : (
                <span className="mt-4 block rounded-full bg-slate-100 px-4 py-2.5 text-center text-xs font-black text-slate-400 dark:bg-white/5">
                    Out of stock
                </span>
            )}
        </article>
    );
}

function ComparisonRow({
    label,
    values,
    highlightDifferences,
    icon,
}: {
    label: string;
    values: string[];
    highlightDifferences: boolean;
    icon?: ReactNode;
}) {
    const differs = new Set(values).size > 1;

    return (
        <>
            <div className="flex items-center gap-2 border-r border-b border-slate-200 bg-slate-50 p-4 text-xs font-black dark:border-white/10 dark:bg-white/5">
                {icon}
                {label}
            </div>
            {values.map((value, index) => (
                <div
                    key={`${label}-${index}`}
                    className={`border-r border-b border-slate-200 p-4 text-sm font-bold last:border-r-0 dark:border-white/10 ${highlightDifferences && differs ? 'bg-orange-50/80 text-orange-950 dark:bg-orange-500/10 dark:text-orange-100' : ''}`}
                >
                    {value}
                </div>
            ))}
        </>
    );
}
