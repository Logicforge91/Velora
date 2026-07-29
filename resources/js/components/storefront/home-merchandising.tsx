import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Clock3,
    Flame,
    Gift,
    Sparkles,
    Store,
    Tag,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { products } from '@/components/storefront/catalog';
import type { StorefrontProduct } from '@/components/storefront/catalog';
import ProductCard from '@/components/storefront/product-card';
import ProductImage from '@/components/storefront/product-image';
import SectionTitle from '@/components/storefront/section-title';
import { catalog, product as productRoute } from '@/routes/storefront';

const productCollections = [
    {
        eyebrow: 'Editor approved',
        title: 'Featured products',
        description: 'Standout pieces selected by the Velora team.',
        products: [products[0], products[3], products[4]],
    },
    {
        eyebrow: 'Popular right now',
        title: 'Trending products',
        description: 'The finds everyone is viewing, saving, and sharing.',
        products: [products[2], products[1], products[5]],
    },
    {
        eyebrow: 'Customer favourites',
        title: 'Best-selling products',
        description: 'Tried, loved, and reordered by Velora shoppers.',
        products: [products[3], products[0], products[1]],
    },
    {
        eyebrow: 'Just landed',
        title: 'New arrivals',
        description: 'Fresh additions for your wardrobe, home, and tech kit.',
        products: [products[4], products[5], products[2]],
    },
] as const;

const brands = [
    { name: 'NOVA', category: 'Mobiles', position: '0% 0%' },
    { name: 'STUDIO', category: 'Electronics', position: '50% 0%' },
    { name: 'PULSE', category: 'Accessories', position: '0% 100%' },
    { name: 'AIRBOOK', category: 'Electronics', position: '50% 100%' },
    { name: 'MODERN HOME', category: 'Home', position: '100% 100%' },
] as const;

const stores = [
    {
        name: 'The Tech Edit',
        category: 'Electronics',
        copy: 'Smart upgrades from trusted makers.',
        tone: 'from-sky-500 to-indigo-700',
    },
    {
        name: 'House of Everyday',
        category: 'Home',
        copy: 'Useful design for calmer spaces.',
        tone: 'from-amber-400 to-orange-600',
    },
    {
        name: 'Move Studio',
        category: 'Fashion',
        copy: 'Comfort-first style for every plan.',
        tone: 'from-rose-400 to-pink-700',
    },
] as const;

export default function HomeMerchandising() {
    return (
        <>
            <SaleSpotlight />
            <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
                <OfferCard
                    icon={<Gift className="size-5" />}
                    eyebrow="Picked for you"
                    title="An extra 10% off your first style order"
                    copy="Use code HELLO10 at checkout."
                    href={catalog.url({ query: { category: 'Fashion' } })}
                    className="bg-[#eadffc] text-violet-950"
                />
                <OfferCard
                    icon={<Tag className="size-5" />}
                    eyebrow="Personalized price"
                    title="Accessories from ₹999, selected for you"
                    copy="Based on what shoppers like you love."
                    href={catalog.url({ query: { category: 'Accessories' } })}
                    className="bg-[#dff1e6] text-emerald-950"
                />
                <OfferCard
                    icon={<Sparkles className="size-5" />}
                    eyebrow="Velora Plus"
                    title="Members get early access to every drop"
                    copy="Join free and unlock your welcome benefits."
                    href="/login"
                    className="bg-[#ffe0d1] text-orange-950"
                />
            </section>

            {productCollections.map((collection, index) => (
                <ProductCollection
                    key={collection.title}
                    {...collection}
                    muted={index % 2 === 1}
                />
            ))}

            <BrandAndStoreSection />

            <ProductCollection
                eyebrow="Chosen for you"
                title="Recommended products"
                description="A thoughtful mix inspired by your recent browsing."
                products={[products[1], products[4], products[3]]}
                muted
            />
            <ProductCollection
                eyebrow="Pick up where you left off"
                title="Recently viewed"
                description="Your latest finds, ready for another look."
                products={[products[5], products[0], products[2]]}
            />
        </>
    );
}

function SaleSpotlight() {
    const deal = products[1];

    return (
        <section className="border-y border-slate-950/8 bg-white py-14 dark:border-white/10 dark:bg-white/[0.025]">
            <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
                <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white sm:p-10">
                    <div className="absolute -top-20 right-0 size-72 rounded-full bg-orange-500/25 blur-3xl" />
                    <div className="relative grid items-center gap-7 sm:grid-cols-[1fr_0.7fr]">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 text-[11px] font-black tracking-wider uppercase">
                                <Flame className="size-3.5" /> Flash sale
                            </span>
                            <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                                Up to 50% off.
                                <span className="block text-orange-300">
                                    Blink and it’s gone.
                                </span>
                            </h2>
                            <div className="mt-6 flex items-center gap-3 text-sm font-bold">
                                <Clock3 className="size-4 text-orange-300" />
                                Ends in
                                <TimeBox value="05" label="hrs" />
                                <TimeBox value="42" label="min" />
                                <TimeBox value="18" label="sec" />
                            </div>
                            <Link
                                href={catalog.url({ query: { sort: 'deals' } })}
                                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-orange-300"
                            >
                                Shop flash deals{' '}
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                        <Link
                            href={productRoute.url(deal.slug)}
                            className="relative mx-auto aspect-square w-full max-w-64 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15"
                            aria-label={`View ${deal.name}`}
                        >
                            <ProductImage
                                product={deal}
                                className="size-full"
                            />
                        </Link>
                    </div>
                </div>

                <article className="flex flex-col justify-between rounded-[2rem] bg-[#f5c85b] p-7 text-amber-950 sm:p-9">
                    <div>
                        <span className="text-[11px] font-black tracking-[0.18em] uppercase">
                            Deal of the day
                        </span>
                        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                            Studio sound. Half the price.
                        </h2>
                        <p className="mt-3 text-sm leading-6 opacity-75">
                            Wireless comfort, rich audio, and all-day battery
                            for ₹2,499 today only.
                        </p>
                    </div>
                    <Link
                        href={productRoute.url(deal.slug)}
                        className="mt-8 inline-flex items-center justify-between border-t border-amber-950/15 pt-5 text-sm font-black"
                    >
                        Claim today’s deal <ArrowRight className="size-5" />
                    </Link>
                </article>
            </div>
        </section>
    );
}

function ProductCollection({
    eyebrow,
    title,
    description,
    products: collectionProducts,
    muted = false,
}: {
    eyebrow: string;
    title: string;
    description: string;
    products: readonly StorefrontProduct[];
    muted?: boolean;
}) {
    return (
        <section
            className={
                muted
                    ? 'border-y border-slate-950/8 bg-white py-14 dark:border-white/10 dark:bg-white/[0.025]'
                    : 'py-14'
            }
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between gap-6">
                    <SectionTitle
                        eyebrow={eyebrow}
                        title={title}
                        description={description}
                    />
                    <Link
                        href={catalog.url()}
                        className="hidden shrink-0 items-center gap-2 text-sm font-black text-orange-600 sm:flex"
                    >
                        View all <ArrowRight className="size-4" />
                    </Link>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                    {collectionProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function BrandAndStoreSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionTitle
                eyebrow="Names worth knowing"
                title="Top brands"
                description="Quality-first labels, verified and ready to explore."
            />
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {brands.map((brand) => (
                    <Link
                        key={brand.name}
                        href={catalog.url({
                            query: { category: brand.category },
                        })}
                        className="group flex flex-col items-center rounded-2xl border border-slate-950/8 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-orange-200 dark:border-white/10 dark:bg-white/5"
                    >
                        <span
                            className="size-16 rounded-full bg-[length:300%_200%] bg-no-repeat ring-4 ring-slate-50 dark:ring-white/5"
                            style={{
                                backgroundImage:
                                    "url('/images/storefront/velora-product-grid.png')",
                                backgroundPosition: brand.position,
                            }}
                        />
                        <span className="mt-4 text-sm font-black tracking-wider">
                            {brand.name}
                        </span>
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <BadgeCheck className="size-3.5" /> Verified
                        </span>
                    </Link>
                ))}
            </div>

            <div className="mt-16 flex items-end justify-between gap-6">
                <SectionTitle
                    eyebrow="Shop their world"
                    title="Featured stores"
                    description="Distinctive collections from standout sellers."
                />
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
                {stores.map((store) => (
                    <Link
                        key={store.name}
                        href={catalog.url({
                            query: { category: store.category },
                        })}
                        className={`group relative min-h-56 overflow-hidden rounded-[2rem] bg-gradient-to-br p-7 text-white ${store.tone}`}
                    >
                        <Store className="size-7 opacity-80" />
                        <h3 className="mt-8 text-2xl font-black tracking-tight">
                            {store.name}
                        </h3>
                        <p className="mt-2 max-w-xs text-sm text-white/75">
                            {store.copy}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black">
                            Visit store
                            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function OfferCard({
    icon,
    eyebrow,
    title,
    copy,
    href,
    className,
}: {
    icon: ReactNode;
    eyebrow: string;
    title: string;
    copy: string;
    href: string;
    className: string;
}) {
    return (
        <Link
            href={href}
            className={`group rounded-[1.5rem] p-6 transition hover:-translate-y-1 ${className}`}
        >
            <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.16em] uppercase opacity-70">
                {icon} {eyebrow}
            </span>
            <h3 className="mt-4 text-xl font-black tracking-tight">{title}</h3>
            <p className="mt-2 text-xs font-medium opacity-65">{copy}</p>
            <ArrowRight className="mt-5 size-5 transition group-hover:translate-x-1" />
        </Link>
    );
}

function TimeBox({ value, label }: { value: string; label: string }) {
    return (
        <span className="rounded-lg bg-white/10 px-2.5 py-1.5 text-center">
            <span className="block font-black">{value}</span>
            <span className="block text-[8px] tracking-wider text-slate-400 uppercase">
                {label}
            </span>
        </span>
    );
}
