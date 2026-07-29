import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    BellRing,
    ChevronDown,
    CircleAlert,
    Heart,
    Minus,
    PackageCheck,
    Plus,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    Tag,
    Trash2,
    Truck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { money, products } from '@/components/storefront/catalog';
import type { StorefrontProduct } from '@/components/storefront/catalog';
import ProductImage from '@/components/storefront/product-image';
import { createProductVariants } from '@/components/storefront/product-variants';
import type { ProductVariant } from '@/components/storefront/product-variants';
import StorefrontLayout from '@/layouts/storefront-layout';
import {
    checkout,
    catalog,
    product as productRoute,
    wishlist,
} from '@/routes/storefront';

type CartItem = {
    id: number;
    product: StorefrontProduct;
    variant: ProductVariant;
    quantity: number;
    selected: boolean;
    savedForLater: boolean;
    priceChanged: boolean;
};

const maximumQuantity = 5;
const minimumOrder = 499;

function initialItem(
    product: StorefrontProduct,
    id: number,
    quantity = 1,
): CartItem {
    const variants = createProductVariants(product);
    const variant = variants.find((item) => item.stock > 0) ?? variants[0];

    return {
        id,
        product,
        variant,
        quantity,
        selected: true,
        savedForLater: false,
        priceChanged: id === 2,
    };
}

export default function Cart() {
    const { url } = usePage();
    const parameters = new URLSearchParams(url.split('?')[1] ?? '');
    const requestedProduct = products.find(
        (product) => product.slug === parameters.get('add'),
    );
    const requestedQuantity = Math.min(
        maximumQuantity,
        Math.max(1, Number(parameters.get('quantity') ?? 1)),
    );
    const [items, setItems] = useState<CartItem[]>(() => {
        const initialItems = [
            initialItem(products[0], 1),
            initialItem(products[1], 2, 2),
            initialItem(products[2], 3),
        ];

        if (!requestedProduct) {
            return initialItems;
        }

        const requestedVariant = createProductVariants(requestedProduct).find(
            (variant) => variant.id === parameters.get('variant'),
        );
        const existingItem = initialItems.find(
            (item) => item.product.id === requestedProduct.id,
        );

        if (existingItem) {
            existingItem.variant = requestedVariant?.stock
                ? requestedVariant
                : existingItem.variant;
            existingItem.quantity = Math.min(
                existingItem.quantity + requestedQuantity,
                existingItem.variant.stock,
                maximumQuantity,
            );

            return initialItems;
        }

        const requestedItem = initialItem(
            requestedProduct,
            Date.now(),
            requestedQuantity,
        );

        if (requestedVariant?.stock) {
            requestedItem.variant = requestedVariant;
            requestedItem.quantity = Math.min(
                requestedQuantity,
                requestedVariant.stock,
                maximumQuantity,
            );
        }

        return [...initialItems, requestedItem];
    });
    const requestedCoupon = parameters.get('coupon') ?? '';
    const [couponCode] = useState(requestedCoupon);
    const [couponApplied] = useState(requestedCoupon === 'VELORA10');
    const [recoveryVisible, setRecoveryVisible] = useState(true);
    const activeItems = items.filter((item) => !item.savedForLater);
    const selectedItems = activeItems.filter((item) => item.selected);
    const savedItems = items.filter((item) => item.savedForLater);

    const totals = useMemo(() => {
        const subtotal = selectedItems.reduce(
            (sum, item) => sum + item.variant.price * item.quantity,
            0,
        );
        const originalTotal = selectedItems.reduce(
            (sum, item) => sum + item.variant.originalPrice * item.quantity,
            0,
        );
        const productDiscount = originalTotal - subtotal;
        const couponDiscount = couponApplied
            ? Math.min(subtotal * 0.1, 1000)
            : 0;
        const shipping = subtotal === 0 || subtotal >= 2000 ? 0 : 99;
        const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
        const tax = discountedSubtotal * 0.18;
        const total = discountedSubtotal + shipping;

        return {
            subtotal,
            originalTotal,
            productDiscount,
            couponDiscount,
            shipping,
            tax,
            total,
        };
    }, [couponApplied, selectedItems]);

    const sellerGroups = useMemo(
        () => [...new Set(activeItems.map((item) => item.product.seller))],
        [activeItems],
    );

    const updateItem = (id: number, update: Partial<CartItem>) => {
        setItems((current) =>
            current.map((item) =>
                item.id === id ? { ...item, ...update } : item,
            ),
        );
    };
    const removeItem = (id: number) =>
        setItems((current) => current.filter((item) => item.id !== id));
    const allSelected =
        activeItems.length > 0 && activeItems.every((item) => item.selected);
    const toggleAll = () =>
        setItems((current) =>
            current.map((item) =>
                item.savedForLater ? item : { ...item, selected: !allSelected },
            ),
        );

    const recoverCart = () => {
        if (!items.some((item) => item.product.id === products[5].id)) {
            setItems((current) => [
                ...current,
                initialItem(products[5], Date.now()),
            ]);
        }

        setRecoveryVisible(false);
    };

    return (
        <StorefrontLayout>
            <Head title="Your shopping cart" />
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.18em] text-orange-500 uppercase">
                            <ShoppingBag className="size-4" /> Shopping cart
                        </span>
                        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                            Everything looks good.
                        </h1>
                        <p className="mt-3 text-slate-500">
                            {activeItems.length} items from{' '}
                            {sellerGroups.length} sellers · review before
                            checkout
                        </p>
                    </div>
                    <Link
                        href={catalog.url()}
                        className="inline-flex items-center gap-2 text-sm font-black text-orange-500"
                    >
                        Continue shopping <ArrowRight className="size-4" />
                    </Link>
                </div>

                {recoveryVisible && (
                    <div className="mt-8 flex flex-col justify-between gap-4 rounded-[1.5rem] border border-violet-200 bg-violet-50 p-5 sm:flex-row sm:items-center dark:border-violet-500/20 dark:bg-violet-500/10">
                        <div className="flex items-center gap-4">
                            <span className="grid size-11 place-items-center rounded-full bg-violet-600 text-white">
                                <RotateCcw className="size-5" />
                            </span>
                            <div>
                                <p className="font-black">
                                    Welcome back—your cart was saved.
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Restore the home essential you viewed during
                                    your last visit.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={recoverCart}
                            className="rounded-full bg-violet-600 px-5 py-2.5 text-xs font-black text-white"
                        >
                            Recover saved cart
                        </button>
                    </div>
                )}

                <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_360px]">
                    <div className="grid content-start gap-6">
                        <label className="flex items-center gap-3 px-2 text-sm font-black">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleAll}
                                className="size-4 accent-orange-500"
                            />{' '}
                            Select all available items
                        </label>
                        {sellerGroups.map((seller) => (
                            <section
                                key={seller}
                                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]"
                            >
                                <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-white/5">
                                    <div>
                                        <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                            Seller
                                        </p>
                                        <h2 className="mt-1 font-black">
                                            {seller}
                                        </h2>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                        <BadgeCheck className="size-4" />{' '}
                                        Verified · 4.8
                                    </span>
                                </header>
                                <div className="divide-y divide-slate-100 dark:divide-white/10">
                                    {activeItems
                                        .filter(
                                            (item) =>
                                                item.product.seller === seller,
                                        )
                                        .map((item) => (
                                            <CartLine
                                                key={item.id}
                                                item={item}
                                                onUpdate={(update) =>
                                                    updateItem(item.id, update)
                                                }
                                                onRemove={() =>
                                                    removeItem(item.id)
                                                }
                                            />
                                        ))}
                                </div>
                                <footer className="flex items-center gap-2 border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-500 dark:border-white/10">
                                    <Truck className="size-4 text-orange-500" />{' '}
                                    Seller delivery estimate: 2–4 business days
                                </footer>
                            </section>
                        ))}

                        {savedItems.length > 0 && (
                            <section>
                                <h2 className="text-xl font-black">
                                    Saved for later ({savedItems.length})
                                </h2>
                                <div className="mt-4 grid gap-3">
                                    {savedItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
                                        >
                                            <ProductImage
                                                product={item.product}
                                                imagePosition={
                                                    item.variant.imagePosition
                                                }
                                                className="size-20 shrink-0 rounded-xl"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-black">
                                                    {item.product.name}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {item.variant.color} ·{' '}
                                                    {item.variant.size}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateItem(item.id, {
                                                        savedForLater: false,
                                                        selected: true,
                                                    })
                                                }
                                                className="text-xs font-black text-orange-600"
                                            >
                                                Move to cart
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <CartSummary
                        totals={totals}
                        selectedCount={selectedItems.length}
                        couponCode={couponCode}
                        couponApplied={couponApplied}
                    />
                </div>
            </section>
        </StorefrontLayout>
    );
}

function CartLine({
    item,
    onUpdate,
    onRemove,
}: {
    item: CartItem;
    onUpdate: (update: Partial<CartItem>) => void;
    onRemove: () => void;
}) {
    const variants = createProductVariants(item.product);
    const availableVariants = variants.filter((variant) => variant.stock > 0);
    const limit = Math.min(maximumQuantity, item.variant.stock);

    return (
        <article
            className={`p-5 transition ${item.selected ? '' : 'opacity-60'}`}
        >
            {item.priceChanged && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                    <BellRing className="mt-0.5 size-4 shrink-0" />
                    <span>
                        <strong>Price update:</strong> This item is now ₹200
                        lower than when you added it.
                    </span>
                    <button
                        type="button"
                        onClick={() => onUpdate({ priceChanged: false })}
                        className="ml-auto font-black"
                    >
                        Dismiss
                    </button>
                </div>
            )}
            <div className="grid gap-4 sm:grid-cols-[auto_120px_1fr_auto]">
                <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={(event) =>
                        onUpdate({ selected: event.target.checked })
                    }
                    className="mt-2 size-4 accent-orange-500"
                    aria-label={`Select ${item.product.name}`}
                />
                <Link
                    href={productRoute.url(item.product.slug)}
                    className="overflow-hidden rounded-2xl bg-slate-100"
                >
                    <ProductImage
                        product={item.product}
                        imagePosition={item.variant.imagePosition}
                        className="aspect-square size-full"
                    />
                </Link>
                <div className="min-w-0">
                    <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                        {item.product.brand} · {item.product.category}
                    </p>
                    <h3 className="mt-1 font-black">{item.product.name}</h3>
                    <p className="mt-2 text-xs font-bold text-emerald-600">
                        {item.variant.stock > 0
                            ? `In stock · ${item.variant.stock} available`
                            : 'Out of stock'}
                    </p>
                    <label className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold dark:border-white/10">
                        <span className="text-slate-400">Variant</span>
                        <select
                            value={item.variant.id}
                            onChange={(event) =>
                                onUpdate({
                                    variant:
                                        variants.find(
                                            (variant) =>
                                                variant.id ===
                                                event.target.value,
                                        ) ?? item.variant,
                                    quantity: 1,
                                })
                            }
                            className="max-w-44 bg-transparent outline-none"
                        >
                            {availableVariants.map((variant) => (
                                <option
                                    key={variant.id}
                                    value={variant.id}
                                    className="text-slate-950"
                                >
                                    {variant.color} · {variant.size} ·{' '}
                                    {variant.storage} · {variant.packSize}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="size-3" />
                    </label>
                    <p className="mt-2 text-[10px] text-slate-400">
                        SKU {item.variant.sku}
                    </p>
                </div>
                <div className="flex items-end justify-between gap-4 sm:grid sm:text-right">
                    <div>
                        <p className="text-lg font-black">
                            {money.format(item.variant.price * item.quantity)}
                        </p>
                        <p className="text-xs text-slate-400 line-through">
                            {money.format(
                                item.variant.originalPrice * item.quantity,
                            )}
                        </p>
                    </div>
                    <div className="inline-flex items-center rounded-full border border-slate-200 p-1 dark:border-white/10">
                        <QuantityButton
                            label="Decrease quantity"
                            disabled={item.quantity === 1}
                            onClick={() =>
                                onUpdate({ quantity: item.quantity - 1 })
                            }
                        >
                            <Minus className="size-3" />
                        </QuantityButton>
                        <span className="w-8 text-center text-sm font-black">
                            {item.quantity}
                        </span>
                        <QuantityButton
                            label="Increase quantity"
                            disabled={item.quantity >= limit}
                            onClick={() =>
                                onUpdate({ quantity: item.quantity + 1 })
                            }
                        >
                            <Plus className="size-3" />
                        </QuantityButton>
                    </div>
                </div>
            </div>
            {item.quantity >= limit && (
                <p className="mt-3 text-right text-[10px] font-bold text-amber-600">
                    Maximum {limit} units allowed for this variant
                </p>
            )}
            <div className="mt-4 flex flex-wrap justify-end gap-4 border-t border-slate-100 pt-4 text-xs font-black dark:border-white/10">
                <Link
                    href={wishlist.url()}
                    onClick={onRemove}
                    className="inline-flex items-center gap-1.5 text-rose-500"
                >
                    <Heart className="size-3.5" /> Move to wishlist
                </Link>
                <button
                    type="button"
                    onClick={() =>
                        onUpdate({ savedForLater: true, selected: false })
                    }
                    className="inline-flex items-center gap-1.5 text-slate-500"
                >
                    <PackageCheck className="size-3.5" /> Save for later
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="inline-flex items-center gap-1.5 text-slate-400 hover:text-rose-500"
                >
                    <Trash2 className="size-3.5" /> Remove
                </button>
            </div>
        </article>
    );
}

type Totals = {
    subtotal: number;
    originalTotal: number;
    productDiscount: number;
    couponDiscount: number;
    shipping: number;
    tax: number;
    total: number;
};

function CartSummary({
    totals,
    selectedCount,
    couponCode,
    couponApplied,
}: {
    totals: Totals;
    selectedCount: number;
    couponCode: string;
    couponApplied: boolean;
}) {
    const meetsMinimum = totals.subtotal >= minimumOrder;

    return (
        <aside className="h-fit rounded-[2rem] bg-slate-950 p-6 text-white sm:p-7 lg:sticky lg:top-32">
            <div className="flex items-center gap-2">
                <ShoppingBag className="size-5 text-orange-400" />
                <h2 className="text-xl font-black">Cart summary</h2>
            </div>
            <div className="mt-6 rounded-xl border border-white/10 p-4">
                <div className="flex items-start gap-3">
                    <Tag className="mt-0.5 size-4 shrink-0 text-orange-400" />
                    <div>
                        <p className="text-sm font-black">
                            Coupons, gift cards & rewards
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            {couponApplied
                                ? `${couponCode} selected. Redeem or change benefits at checkout.`
                                : 'Redeem all available benefits once at secure checkout.'}
                        </p>
                    </div>
                </div>
                <Link
                    href={checkout.url({
                        query: couponApplied ? { coupon: couponCode } : {},
                    })}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-black text-orange-400 hover:text-orange-300"
                >
                    Manage at checkout <ArrowRight className="size-3.5" />
                </Link>
            </div>
            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm">
                <SummaryLine
                    label={`Subtotal (${selectedCount} items)`}
                    value={money.format(totals.subtotal)}
                />
                <SummaryLine
                    label="Product discount"
                    value={`−${money.format(totals.productDiscount)}`}
                    accent
                />
                <SummaryLine
                    label="Coupon"
                    value={`−${money.format(totals.couponDiscount)}`}
                    accent
                />
                <SummaryLine
                    label="Shipping charge"
                    value={
                        totals.shipping === 0
                            ? 'Free'
                            : money.format(totals.shipping)
                    }
                    accent={totals.shipping === 0}
                />
                <SummaryLine
                    label="Tax included (18% GST)"
                    value={money.format(totals.tax)}
                />
                <div className="mt-2 border-t border-white/10 pt-4">
                    <div className="flex items-end justify-between">
                        <span className="font-black">Order total</span>
                        <span className="text-2xl font-black">
                            {money.format(totals.total)}
                        </span>
                    </div>
                    <p className="mt-2 text-right text-xs font-bold text-emerald-400">
                        You save{' '}
                        {money.format(
                            totals.productDiscount + totals.couponDiscount,
                        )}
                    </p>
                </div>
            </div>
            {totals.subtotal > 0 && totals.subtotal < 2000 && (
                <p className="mt-4 rounded-xl bg-white/5 p-3 text-xs text-slate-300">
                    Add {money.format(2000 - totals.subtotal)} more for free
                    shipping.
                </p>
            )}
            {!meetsMinimum && (
                <p className="mt-4 flex gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-300">
                    <CircleAlert className="size-4 shrink-0" /> Minimum selected
                    order value is {money.format(minimumOrder)}.
                </p>
            )}
            <Link
                href={checkout.url({
                    query: couponApplied ? { coupon: couponCode } : {},
                })}
                aria-disabled={!meetsMinimum || selectedCount === 0}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-black ${meetsMinimum && selectedCount > 0 ? 'bg-orange-500 hover:bg-orange-400' : 'pointer-events-none bg-white/10 text-slate-500'}`}
            >
                Secure checkout <ArrowRight className="size-4" />
            </Link>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[9px] font-bold text-slate-400">
                <span>
                    <ShieldCheck className="mx-auto mb-1 size-4" />
                    Secure
                </span>
                <span>
                    <Truck className="mx-auto mb-1 size-4" />
                    Fast delivery
                </span>
                <span>
                    <PackageCheck className="mx-auto mb-1 size-4" />
                    Easy returns
                </span>
            </div>
        </aside>
    );
}

function SummaryLine({
    label,
    value,
    accent = false,
}: {
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div className="flex justify-between gap-4 text-slate-400">
            <span>{label}</span>
            <span className={accent ? 'font-bold text-emerald-400' : ''}>
                {value}
            </span>
        </div>
    );
}
function QuantityButton({
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
            className="grid size-8 place-items-center rounded-full hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-white/10"
        >
            {children}
        </button>
    );
}
