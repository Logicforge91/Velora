import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Bell,
    Check,
    ChevronDown,
    EyeOff,
    FolderHeart,
    Globe2,
    Heart,
    Lock,
    PackageCheck,
    Plus,
    Share2,
    ShoppingBag,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { money, products } from '@/components/storefront/catalog';
import type { StorefrontProduct } from '@/components/storefront/catalog';
import ProductImage from '@/components/storefront/product-image';
import StorefrontLayout from '@/layouts/storefront-layout';
import { cart, catalog, product as productRoute } from '@/routes/storefront';

type Privacy = 'Private' | 'Unlisted' | 'Public';

type WishlistCollection = {
    id: number;
    name: string;
    privacy: Privacy;
};

type WishlistItem = {
    id: number;
    product: StorefrontProduct;
    collectionId: number;
    priceDropAlert: boolean;
    stockAlert: boolean;
    previousPrice: number;
};

const initialCollections: WishlistCollection[] = [
    { id: 1, name: 'My favourites', privacy: 'Private' },
    { id: 2, name: 'Home refresh', privacy: 'Unlisted' },
    { id: 3, name: 'Gift ideas', privacy: 'Public' },
];

function initialWishlistItems(requestedProduct?: StorefrontProduct) {
    const initialProducts = products.slice(1, 5);

    if (
        requestedProduct &&
        !initialProducts.some((product) => product.id === requestedProduct.id)
    ) {
        initialProducts.unshift(requestedProduct);
    }

    return initialProducts.map((product, index): WishlistItem => ({
        id: product.id,
        product,
        collectionId: index === 3 ? 2 : index === 2 ? 3 : 1,
        priceDropAlert: index === 0,
        stockAlert: product.stock === 0,
        previousPrice: index === 0 ? product.price + 400 : product.price,
    }));
}

export default function Wishlist() {
    const { url } = usePage();
    const parameters = new URLSearchParams(url.split('?')[1] ?? '');
    const requestedProduct = products.find(
        (product) => product.slug === parameters.get('add'),
    );
    const [collections, setCollections] =
        useState<WishlistCollection[]>(initialCollections);
    const [items, setItems] = useState<WishlistItem[]>(() =>
        initialWishlistItems(requestedProduct),
    );
    const [activeCollectionId, setActiveCollectionId] = useState(1);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const activeCollection =
        collections.find(
            (collection) => collection.id === activeCollectionId,
        ) ?? collections[0];
    const visibleItems = useMemo(
        () => items.filter((item) => item.collectionId === activeCollectionId),
        [activeCollectionId, items],
    );

    const updateItem = (id: number, update: Partial<WishlistItem>) => {
        setItems((current) =>
            current.map((item) =>
                item.id === id ? { ...item, ...update } : item,
            ),
        );
    };

    const createCollection = () => {
        const name = newCollectionName.trim();

        if (name === '') {
            return;
        }

        const collection = {
            id: Date.now(),
            name,
            privacy: 'Private' as const,
        };
        setCollections((current) => [...current, collection]);
        setActiveCollectionId(collection.id);
        setNewCollectionName('');
        setIsCreatingCollection(false);
    };

    const updatePrivacy = (privacy: Privacy) => {
        setCollections((current) =>
            current.map((collection) =>
                collection.id === activeCollectionId
                    ? { ...collection, privacy }
                    : collection,
            ),
        );
    };

    const shareWishlist = async () => {
        const shareData = {
            title: `${activeCollection.name} on Velora`,
            text: `Take a look at my ${activeCollection.name} wishlist.`,
            url: `${window.location.origin}${window.location.pathname}?collection=${activeCollectionId}`,
        };

        if (navigator.share) {
            await navigator.share(shareData);

            return;
        }

        await navigator.clipboard.writeText(shareData.url);
        setShareMessage('Wishlist link copied');
        window.setTimeout(() => setShareMessage(''), 1800);
    };

    return (
        <StorefrontLayout>
            <Head title="Your wishlists" />
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.18em] text-rose-500 uppercase">
                            <Heart className="size-4 fill-current" /> Saved with
                            care
                        </span>
                        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                            Your wishlists
                        </h1>
                        <p className="mt-3 text-slate-500 dark:text-slate-400">
                            Organize favourites, watch prices, and return when
                            you’re ready.
                        </p>
                    </div>
                    <Link
                        href={catalog.url()}
                        className="inline-flex items-center gap-2 text-sm font-black text-orange-500"
                    >
                        Continue shopping <ArrowRight className="size-4" />
                    </Link>
                </div>

                <div className="mt-9 grid gap-7 lg:grid-cols-[250px_1fr]">
                    <aside className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-center justify-between gap-3 px-2">
                            <p className="text-xs font-black tracking-wider text-slate-400 uppercase">
                                Collections
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsCreatingCollection((value) => !value)
                                }
                                className="grid size-7 place-items-center rounded-full bg-slate-950 text-white dark:bg-orange-500"
                                aria-label="Create wishlist collection"
                            >
                                <Plus className="size-3.5" />
                            </button>
                        </div>
                        {isCreatingCollection && (
                            <div className="mt-3 flex gap-2">
                                <input
                                    value={newCollectionName}
                                    onChange={(event) =>
                                        setNewCollectionName(event.target.value)
                                    }
                                    placeholder="Collection name"
                                    className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-2 text-xs outline-none focus:border-orange-400 dark:border-white/10 dark:bg-slate-900"
                                />
                                <button
                                    type="button"
                                    onClick={createCollection}
                                    className="grid size-8 place-items-center rounded-lg bg-orange-500 text-white"
                                    aria-label="Save collection"
                                >
                                    <Check className="size-3.5" />
                                </button>
                            </div>
                        )}
                        <nav className="mt-4 grid gap-1">
                            {collections.map((collection) => {
                                const count = items.filter(
                                    (item) =>
                                        item.collectionId === collection.id,
                                ).length;

                                return (
                                    <button
                                        key={collection.id}
                                        type="button"
                                        onClick={() =>
                                            setActiveCollectionId(collection.id)
                                        }
                                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black transition ${activeCollectionId === collection.id ? 'bg-slate-950 text-white dark:bg-orange-500' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                    >
                                        <FolderHeart className="size-4" />
                                        <span className="min-w-0 flex-1 truncate">
                                            {collection.name}
                                        </span>
                                        <span className="text-[10px] opacity-60">
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    <div>
                        <header className="flex flex-col justify-between gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:flex-row sm:items-center dark:border-white/10 dark:bg-white/5">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-black">
                                        {activeCollection.name}
                                    </h2>
                                    <PrivacyIcon
                                        privacy={activeCollection.privacy}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    {visibleItems.length} saved products ·{' '}
                                    {activeCollection.privacy}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <label className="relative">
                                    <span className="sr-only">
                                        Wishlist privacy
                                    </span>
                                    <select
                                        value={activeCollection.privacy}
                                        onChange={(event) =>
                                            updatePrivacy(
                                                event.target.value as Privacy,
                                            )
                                        }
                                        className="appearance-none rounded-full border border-slate-200 bg-white py-2.5 pr-9 pl-4 text-xs font-black outline-none dark:border-white/10 dark:bg-slate-900"
                                    >
                                        <option>Private</option>
                                        <option>Unlisted</option>
                                        <option>Public</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2" />
                                </label>
                                <button
                                    type="button"
                                    onClick={shareWishlist}
                                    disabled={
                                        activeCollection.privacy === 'Private'
                                    }
                                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-35 dark:bg-orange-500"
                                >
                                    {shareMessage ? (
                                        <Check className="size-4" />
                                    ) : (
                                        <Share2 className="size-4" />
                                    )}
                                    {shareMessage || 'Share'}
                                </button>
                            </div>
                        </header>

                        {visibleItems.length > 0 ? (
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                {visibleItems.map((item) => (
                                    <WishlistCard
                                        key={item.id}
                                        item={item}
                                        collections={collections}
                                        onUpdate={(update) =>
                                            updateItem(item.id, update)
                                        }
                                        onRemove={() =>
                                            setItems((current) =>
                                                current.filter(
                                                    (currentItem) =>
                                                        currentItem.id !==
                                                        item.id,
                                                ),
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-5 rounded-[2rem] border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
                                <FolderHeart className="mx-auto size-9 text-slate-300" />
                                <h2 className="mt-4 text-xl font-black">
                                    This collection is ready for inspiration.
                                </h2>
                                <Link
                                    href={catalog.url()}
                                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white dark:bg-orange-500"
                                >
                                    Discover products{' '}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}

function WishlistCard({
    item,
    collections,
    onUpdate,
    onRemove,
}: {
    item: WishlistItem;
    collections: WishlistCollection[];
    onUpdate: (update: Partial<WishlistItem>) => void;
    onRemove: () => void;
}) {
    const priceDropped = item.product.price < item.previousPrice;

    return (
        <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Link href={productRoute.url(item.product.slug)}>
                    <ProductImage
                        product={item.product}
                        className="absolute inset-0 size-full transition duration-500 hover:scale-105"
                    />
                </Link>
                <span
                    className={`absolute top-3 left-3 rounded-full px-3 py-1.5 text-[10px] font-black shadow-sm ${item.product.stock > 0 ? 'bg-white text-emerald-600' : 'bg-rose-500 text-white'}`}
                >
                    {item.product.stock > 0
                        ? `In stock · ${item.product.stock} left`
                        : 'Currently unavailable'}
                </span>
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white text-slate-400 shadow hover:text-rose-500"
                    aria-label={`Remove ${item.product.name}`}
                >
                    <Trash2 className="size-4" />
                </button>
            </div>
            <div className="p-5">
                <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                    {item.product.brand} · {item.product.category}
                </p>
                <h3 className="mt-1 truncate text-lg font-black">
                    <Link
                        href={productRoute.url(item.product.slug)}
                        className="hover:text-orange-500"
                    >
                        {item.product.name}
                    </Link>
                </h3>
                <div className="mt-3 flex items-end gap-2">
                    <span className="text-xl font-black">
                        {money.format(item.product.price)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                        {money.format(item.product.original)}
                    </span>
                </div>
                {priceDropped && (
                    <p className="mt-2 text-xs font-black text-emerald-600">
                        Price dropped by{' '}
                        {money.format(item.previousPrice - item.product.price)}
                    </p>
                )}

                <label className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
                    Collection
                    <select
                        value={item.collectionId}
                        onChange={(event) =>
                            onUpdate({
                                collectionId: Number(event.target.value),
                            })
                        }
                        className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2 font-black text-slate-950 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-white"
                    >
                        {collections.map((collection) => (
                            <option key={collection.id} value={collection.id}>
                                {collection.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    <NotificationButton
                        active={item.priceDropAlert}
                        label="Price drops"
                        onClick={() =>
                            onUpdate({
                                priceDropAlert: !item.priceDropAlert,
                            })
                        }
                    />
                    <NotificationButton
                        active={item.stockAlert}
                        label="Back in stock"
                        onClick={() =>
                            onUpdate({ stockAlert: !item.stockAlert })
                        }
                    />
                </div>

                {item.product.stock > 0 ? (
                    <Link
                        href={cart.url({
                            query: { add: item.product.slug },
                        })}
                        onClick={onRemove}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-orange-500 dark:bg-orange-500"
                    >
                        <ShoppingBag className="size-4" /> Move to cart
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={() => onUpdate({ stockAlert: true })}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 dark:bg-white/5 dark:text-slate-300"
                    >
                        <PackageCheck className="size-4" />{' '}
                        {item.stockAlert
                            ? 'Back-in-stock alert active'
                            : 'Notify when available'}
                    </button>
                )}
            </div>
        </article>
    );
}

function NotificationButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[10px] font-black ${active ? 'border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-500/10' : 'border-slate-200 text-slate-500 dark:border-white/10'}`}
        >
            <Bell className={`size-3.5 ${active ? 'fill-current' : ''}`} />
            {label}
        </button>
    );
}

function PrivacyIcon({ privacy }: { privacy: Privacy }) {
    if (privacy === 'Public') {
        return <Globe2 className="size-4 text-emerald-500" />;
    }

    if (privacy === 'Unlisted') {
        return <EyeOff className="size-4 text-amber-500" />;
    }

    return <Lock className="size-4 text-slate-400" />;
}
