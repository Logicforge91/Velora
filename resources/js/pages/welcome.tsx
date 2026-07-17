import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    ChevronDown,
    Clock3,
    Headphones,
    Heart,
    Home as HomeIcon,
    Laptop,
    Menu,
    PackageCheck,
    Search,
    ShieldCheck,
    Shirt,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
    Sparkles,
    Star,
    Truck,
    Watch,
    X,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { dashboard, home, login } from '@/routes';

const categories = [
    {
        label: 'Mobiles',
        icon: Smartphone,
        tone: 'from-blue-100 to-indigo-50 text-blue-700',
    },
    {
        label: 'Fashion',
        icon: Shirt,
        tone: 'from-pink-100 to-rose-50 text-rose-700',
    },
    {
        label: 'Electronics',
        icon: Laptop,
        tone: 'from-violet-100 to-purple-50 text-violet-700',
    },
    {
        label: 'Home',
        icon: HomeIcon,
        tone: 'from-amber-100 to-orange-50 text-amber-700',
    },
    {
        label: 'Appliances',
        icon: Zap,
        tone: 'from-cyan-100 to-sky-50 text-cyan-700',
    },
    {
        label: 'Accessories',
        icon: Watch,
        tone: 'from-emerald-100 to-teal-50 text-emerald-700',
    },
];

const products = [
    {
        id: 1,
        name: 'Nova X Pro Smartphone',
        category: 'Mobiles',
        price: 28999,
        original: 34999,
        rating: 4.6,
        offer: '17% off',
        icon: Smartphone,
        tone: 'from-blue-100 via-sky-50 to-white text-blue-700',
    },
    {
        id: 2,
        name: 'Studio Wireless Headphones',
        category: 'Electronics',
        price: 2499,
        original: 4999,
        rating: 4.4,
        offer: '50% off',
        icon: Headphones,
        tone: 'from-violet-100 via-fuchsia-50 to-white text-violet-700',
    },
    {
        id: 3,
        name: 'Everyday Classic Sneakers',
        category: 'Fashion',
        price: 1599,
        original: 2999,
        rating: 4.3,
        offer: '46% off',
        icon: ShoppingBag,
        tone: 'from-rose-100 via-orange-50 to-white text-rose-700',
    },
    {
        id: 4,
        name: 'Pulse Active Smartwatch',
        category: 'Accessories',
        price: 3499,
        original: 6999,
        rating: 4.5,
        offer: '50% off',
        icon: Watch,
        tone: 'from-emerald-100 via-teal-50 to-white text-emerald-700',
    },
    {
        id: 5,
        name: 'Airbook 14 Performance',
        category: 'Electronics',
        price: 54990,
        original: 64990,
        rating: 4.7,
        offer: '15% off',
        icon: Laptop,
        tone: 'from-slate-200 via-blue-50 to-white text-slate-700',
    },
    {
        id: 6,
        name: 'Modern Home Essentials',
        category: 'Home',
        price: 1299,
        original: 2199,
        rating: 4.2,
        offer: '40% off',
        icon: HomeIcon,
        tone: 'from-amber-100 via-yellow-50 to-white text-amber-700',
    },
];

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

export default function Welcome() {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const filteredProducts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return products.filter((product) => {
            const categoryMatches =
                activeCategory === 'All' || product.category === activeCategory;
            const queryMatches =
                normalizedQuery === '' ||
                `${product.name} ${product.category}`
                    .toLowerCase()
                    .includes(normalizedQuery);

            return categoryMatches && queryMatches;
        });
    }, [activeCategory, query]);

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        document
            .querySelector('#deals')
            ?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Head title="Shop smarter" />
            <div className="min-h-screen bg-[#f5f7fb] font-sans text-slate-950 antialiased dark:bg-slate-950 dark:text-white">
                <div className="bg-slate-950 px-4 py-2.5 text-center text-xs font-semibold text-white dark:bg-orange-500">
                    <span className="inline-flex items-center gap-2">
                        <Sparkles className="size-3.5 text-amber-300" />
                        Festive offers are live — save up to 70% across top
                        categories
                    </span>
                </div>

                <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90">
                    <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
                        <Link
                            href={home.url()}
                            className="flex shrink-0 items-center gap-2.5"
                            aria-label="Velora home"
                        >
                            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20">
                                <ShoppingBag className="size-5" />
                            </span>
                            <span className="text-xl font-black tracking-[-0.04em]">
                                Velora
                            </span>
                        </Link>

                        <form
                            onSubmit={submitSearch}
                            className="relative hidden min-w-0 flex-1 md:block"
                        >
                            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Search for products, brands and categories"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-28 pl-11 text-sm transition outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-white/5 dark:focus:ring-orange-500/10"
                            />
                            <button className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500">
                                Search
                            </button>
                        </form>

                        <nav className="ml-auto hidden items-center gap-2 sm:flex">
                            <button
                                type="button"
                                className="grid size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-orange-500 dark:text-slate-300 dark:hover:bg-white/5"
                                aria-label="Wishlist"
                            >
                                <Heart className="size-5" />
                            </button>
                            <button
                                type="button"
                                className="relative grid size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-orange-500 dark:text-slate-300 dark:hover:bg-white/5"
                                aria-label="Cart"
                            >
                                <ShoppingCart className="size-5" />
                                <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-orange-500 text-[9px] font-black text-white">
                                    0
                                </span>
                            </button>
                            <Link
                                href={auth.user ? dashboard.url() : login.url()}
                                className="ml-1 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                            >
                                {auth.user ? 'Dashboard' : 'Sign in'}
                            </Link>
                        </nav>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            className="ml-auto grid size-10 place-items-center rounded-xl border border-slate-200 sm:hidden dark:border-white/10"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="size-5" />
                            ) : (
                                <Menu className="size-5" />
                            )}
                        </button>
                    </div>

                    <div className="mx-auto hidden max-w-7xl items-center justify-between border-t border-slate-100 px-4 py-2.5 text-xs font-bold text-slate-600 lg:flex dark:border-white/5 dark:text-slate-300">
                        <div className="flex items-center gap-7">
                            {categories.slice(0, 5).map((category) => (
                                <button
                                    key={category.label}
                                    type="button"
                                    onClick={() => {
                                        setActiveCategory(category.label);
                                        document
                                            .querySelector('#deals')
                                            ?.scrollIntoView({
                                                behavior: 'smooth',
                                            });
                                    }}
                                    className="transition hover:text-orange-500"
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="flex items-center gap-1 text-orange-600"
                        >
                            More categories <ChevronDown className="size-3.5" />
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div className="border-t border-slate-100 p-4 sm:hidden dark:border-white/10">
                            <form onSubmit={submitSearch} className="relative">
                                <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search products"
                                    className="h-10 w-full rounded-xl bg-slate-100 pr-3 pl-9 text-sm outline-none dark:bg-white/5"
                                />
                            </form>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.label}
                                        type="button"
                                        onClick={() => {
                                            setActiveCategory(category.label);
                                            setMobileMenuOpen(false);
                                            document
                                                .querySelector('#deals')
                                                ?.scrollIntoView({
                                                    behavior: 'smooth',
                                                });
                                        }}
                                        className="rounded-xl border border-slate-100 px-3 py-2 text-left text-sm font-semibold dark:border-white/10"
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                            <Link
                                href={auth.user ? dashboard.url() : login.url()}
                                className="mt-4 flex justify-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white"
                            >
                                {auth.user
                                    ? 'Open dashboard'
                                    : 'Sign in to Velora'}
                            </Link>
                        </div>
                    )}
                </header>

                <main>
                    <section className="relative overflow-hidden bg-[#fffaf4] dark:bg-slate-950">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -top-36 right-0 size-[34rem] rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-500/10" />
                            <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-amber-100/60 blur-3xl dark:bg-amber-500/5" />
                        </div>
                        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
                            <div className="max-w-2xl">
                                <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-black tracking-wide text-orange-600 uppercase shadow-sm dark:border-orange-500/20 dark:bg-white/5">
                                    <Zap className="size-3.5" />
                                    The smarter way to shop
                                </span>
                                <h1 className="mt-6 text-4xl leading-[1.05] font-black tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
                                    Everything you love.
                                    <br />
                                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                        One extraordinary store.
                                    </span>
                                </h1>
                                <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
                                    Discover trusted brands, fresh arrivals, and
                                    everyday essentials—with secure payments and
                                    dependable delivery across India.
                                </p>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <a
                                        href="#deals"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-orange-500 dark:bg-orange-500"
                                    >
                                        Explore today's deals{' '}
                                        <ArrowRight className="size-4" />
                                    </a>
                                    <a
                                        href="#categories"
                                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 transition hover:border-orange-300 hover:text-orange-600 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    >
                                        Browse categories
                                    </a>
                                </div>
                                <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <BadgeCheck className="size-4 text-emerald-500" />
                                        Verified sellers
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Truck className="size-4 text-blue-500" />
                                        Fast delivery
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <ShieldCheck className="size-4 text-violet-500" />
                                        Secure checkout
                                    </span>
                                </div>
                            </div>

                            <div className="relative mx-auto w-full max-w-xl">
                                <div className="absolute -inset-4 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-orange-400 to-amber-300 opacity-30 blur-2xl" />
                                <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-2xl shadow-orange-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 flex items-center justify-between rounded-2xl bg-slate-950 p-5 text-white">
                                            <div>
                                                <p className="text-xs font-bold text-orange-300">
                                                    Deal of the day
                                                </p>
                                                <p className="mt-1 text-xl font-black">
                                                    Smart living, better prices.
                                                </p>
                                            </div>
                                            <div className="grid size-14 place-items-center rounded-2xl bg-orange-500">
                                                <Zap className="size-7" />
                                            </div>
                                        </div>
                                        <HeroProduct
                                            icon={Smartphone}
                                            label="Nova X Pro"
                                            price="₹28,999"
                                            tone="bg-gradient-to-br from-blue-100 to-sky-50 text-blue-700"
                                        />
                                        <HeroProduct
                                            icon={Headphones}
                                            label="Studio Sound"
                                            price="₹2,499"
                                            tone="bg-gradient-to-br from-violet-100 to-fuchsia-50 text-violet-700"
                                        />
                                        <div className="col-span-2 flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/5">
                                            <div className="flex -space-x-2">
                                                {['A', 'R', 'K', 'S'].map(
                                                    (letter, index) => (
                                                        <span
                                                            key={letter}
                                                            className="grid size-8 place-items-center rounded-full border-2 border-white bg-slate-900 text-[10px] font-black text-white"
                                                            style={{
                                                                zIndex:
                                                                    4 - index,
                                                            }}
                                                        >
                                                            {letter}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                            <p className="text-right text-xs font-semibold text-slate-500">
                                                <strong className="block text-sm text-slate-950 dark:text-white">
                                                    10k+ happy shoppers
                                                </strong>
                                                joined this month
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="categories"
                        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
                    >
                        <SectionTitle
                            eyebrow="Shop your way"
                            title="Explore popular categories"
                            description="From daily essentials to your next upgrade."
                        />
                        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                            {categories.map((category) => {
                                const Icon = category.icon;

                                return (
                                    <button
                                        key={category.label}
                                        type="button"
                                        onClick={() => {
                                            setActiveCategory(category.label);
                                            document
                                                .querySelector('#deals')
                                                ?.scrollIntoView({
                                                    behavior: 'smooth',
                                                });
                                        }}
                                        className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-950/5 dark:border-white/10 dark:bg-white/5"
                                    >
                                        <span
                                            className={`grid aspect-square place-items-center rounded-xl bg-gradient-to-br ${category.tone}`}
                                        >
                                            <Icon className="size-8 transition group-hover:scale-110" />
                                        </span>
                                        <span className="mt-3 flex items-center justify-between text-sm font-black">
                                            {category.label}
                                            <ArrowRight className="size-3.5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section
                        id="deals"
                        className="border-y border-slate-200 bg-white py-16 dark:border-white/10 dark:bg-white/[0.025]"
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
                                        ...categories.map(
                                            (category) => category.label,
                                        ),
                                    ].map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() =>
                                                setActiveCategory(category)
                                            }
                                            className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${activeCategory === category ? 'bg-slate-950 text-white dark:bg-orange-500' : 'bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:bg-white/5 dark:text-slate-300'}`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredProducts.slice(0, 4).map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                            {filteredProducts.length === 0 && (
                                <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
                                    <Search className="mx-auto size-8 text-slate-300" />
                                    <p className="mt-3 font-black">
                                        No matching deals found
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQuery('');
                                            setActiveCategory('All');
                                        }}
                                        className="mt-2 text-sm font-bold text-orange-500"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid overflow-hidden rounded-[2rem] bg-slate-950 text-white lg:grid-cols-2">
                            <div className="relative p-8 sm:p-12">
                                <div className="absolute top-0 right-0 size-56 rounded-full bg-orange-500/20 blur-3xl" />
                                <span className="relative text-xs font-black tracking-[0.2em] text-orange-300 uppercase">
                                    Velora Plus
                                </span>
                                <h2 className="relative mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                                    More value in every order.
                                </h2>
                                <p className="relative mt-4 max-w-md text-sm leading-6 text-slate-300">
                                    Unlock priority delivery, members-only
                                    offers, and early access to our biggest sale
                                    events.
                                </p>
                                <Link
                                    href={
                                        auth.user
                                            ? dashboard.url()
                                            : login.url()
                                    }
                                    className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950"
                                >
                                    {auth.user
                                        ? 'View your account'
                                        : 'Join Velora'}{' '}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-px bg-white/10">
                                <Benefit
                                    icon={Truck}
                                    title="Priority delivery"
                                    copy="Faster dispatch on eligible orders"
                                />
                                <Benefit
                                    icon={ShieldCheck}
                                    title="Protected payments"
                                    copy="Secure checkout every time"
                                />
                                <Benefit
                                    icon={PackageCheck}
                                    title="Easy returns"
                                    copy="Clear, trackable return journeys"
                                />
                                <Benefit
                                    icon={Headphones}
                                    title="Helpful support"
                                    copy="Assistance whenever you need it"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="border-t border-slate-200 bg-white py-12 dark:border-white/10 dark:bg-white/[0.025]">
                        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                            <TrustItem
                                icon={Truck}
                                title="Fast delivery"
                                copy="Across thousands of pin codes"
                            />
                            <TrustItem
                                icon={ShieldCheck}
                                title="Secure payments"
                                copy="Protected checkout experience"
                            />
                            <TrustItem
                                icon={PackageCheck}
                                title="Easy returns"
                                copy="Simple and transparent process"
                            />
                            <TrustItem
                                icon={Clock3}
                                title="Always available"
                                copy="Shop whenever it suits you"
                            />
                        </div>
                    </section>
                </main>

                <footer className="bg-slate-950 text-slate-300">
                    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
                        <div>
                            <div className="flex items-center gap-2.5 text-white">
                                <span className="grid size-9 place-items-center rounded-xl bg-orange-500">
                                    <ShoppingBag className="size-4" />
                                </span>
                                <span className="text-xl font-black">
                                    Velora
                                </span>
                            </div>
                            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
                                A modern marketplace built around better
                                selection, transparent operations, and
                                delightful shopping.
                            </p>
                        </div>
                        <FooterLinks
                            title="Shop"
                            links={[
                                'Mobiles',
                                'Fashion',
                                'Electronics',
                                'Home',
                            ]}
                        />
                        <FooterLinks
                            title="Help"
                            links={[
                                'Order support',
                                'Returns',
                                'Payments',
                                'Delivery',
                            ]}
                        />
                        <FooterLinks
                            title="Company"
                            links={[
                                'About Velora',
                                'Sell with us',
                                'Careers',
                                'Contact',
                            ]}
                        />
                    </div>
                    <div className="border-t border-white/10">
                        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
                            <p>
                                © {new Date().getFullYear()} Velora Commerce.
                                All rights reserved.
                            </p>
                            <p>Made for modern Indian shopping.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function HeroProduct({
    icon: Icon,
    label,
    price,
    tone,
}: {
    icon: typeof Smartphone;
    label: string;
    price: string;
    tone: string;
}) {
    return (
        <div className={`rounded-2xl p-4 ${tone}`}>
            <div className="grid h-28 place-items-center">
                <Icon className="size-16 drop-shadow-sm" />
            </div>
            <p className="text-xs font-bold opacity-70">Trending now</p>
            <div className="mt-1 flex items-end justify-between gap-2">
                <p className="font-black text-slate-950">{label}</p>
                <span className="text-xs font-black text-slate-950">
                    {price}
                </span>
            </div>
        </div>
    );
}

function SectionTitle({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div>
            <p className="text-xs font-black tracking-[0.18em] text-orange-500 uppercase">
                {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                {title}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {description}
            </p>
        </div>
    );
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
    const Icon = product.icon;

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/5 dark:border-white/10 dark:bg-white/5">
            <div
                className={`relative grid aspect-[4/3] place-items-center bg-gradient-to-br ${product.tone}`}
            >
                <span className="absolute top-3 left-3 rounded-lg bg-white px-2 py-1 text-[10px] font-black text-emerald-600 shadow-sm">
                    {product.offer}
                </span>
                <button
                    type="button"
                    className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:text-rose-500"
                    aria-label={`Save ${product.name}`}
                >
                    <Heart className="size-4" />
                </button>
                <Icon className="size-20 transition duration-300 group-hover:scale-110 group-hover:-rotate-3" />
            </div>
            <div className="p-4">
                <p className="text-xs font-bold text-slate-400">
                    {product.category}
                </p>
                <h3 className="mt-1 truncate font-black">{product.name}</h3>
                <div className="mt-2 flex items-center gap-1 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-1.5 py-0.5 font-bold text-white">
                        {product.rating}
                        <Star className="size-2.5 fill-current" />
                    </span>
                    <span className="text-slate-400">Top rated</span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                        <span className="text-lg font-black">
                            {money.format(product.price)}
                        </span>
                        <span className="ml-2 text-xs text-slate-400 line-through">
                            {money.format(product.original)}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white transition hover:bg-orange-500 dark:bg-orange-500"
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <ShoppingCart className="size-4" />
                    </button>
                </div>
            </div>
        </article>
    );
}

function Benefit({
    icon: Icon,
    title,
    copy,
}: {
    icon: typeof Truck;
    title: string;
    copy: string;
}) {
    return (
        <div className="bg-slate-950 p-6 sm:p-8">
            <Icon className="size-6 text-orange-400" />
            <h3 className="mt-4 text-sm font-black text-white">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-400">{copy}</p>
        </div>
    );
}

function TrustItem({
    icon: Icon,
    title,
    copy,
}: {
    icon: typeof Truck;
    title: string;
    copy: string;
}) {
    return (
        <div className="flex items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                <Icon className="size-5" />
            </span>
            <div>
                <p className="text-sm font-black">{title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{copy}</p>
            </div>
        </div>
    );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
    return (
        <div>
            <h3 className="text-sm font-black text-white">{title}</h3>
            <ul className="mt-4 grid gap-3 text-sm text-slate-400">
                {links.map((link) => (
                    <li key={link}>
                        <a
                            href="#categories"
                            className="transition hover:text-orange-400"
                        >
                            {link}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
