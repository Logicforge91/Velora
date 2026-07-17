import { Link } from '@inertiajs/react';
import {
    ChevronDown,
    Heart,
    Menu,
    Search,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    categories,
    scrollToStorefrontSection,
} from '@/components/storefront/catalog';
import { dashboard, home, login } from '@/routes';
import { cart, catalog, wishlist } from '@/routes/storefront';

type Props = {
    isAuthenticated: boolean;
    query: string;
    onQueryChange: (query: string) => void;
    onCategoryChange: (category: string) => void;
    onSearchSubmit?: () => void;
};

export default function SiteHeader({
    isAuthenticated,
    query,
    onQueryChange,
    onCategoryChange,
    onSearchSubmit,
}: Props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (onSearchSubmit) {
            onSearchSubmit();

            return;
        }

        scrollToStorefrontSection('#deals');
    };
    const selectCategory = (category: string) => {
        onCategoryChange(category);
        setMobileMenuOpen(false);
        scrollToStorefrontSection('#deals');
    };

    return (
        <>
            <div className="bg-slate-950 px-4 py-2.5 text-center text-xs font-semibold text-white dark:bg-orange-500">
                <span className="inline-flex items-center gap-2">
                    <Sparkles className="size-3.5 text-amber-300" />
                    Festive offers are live — save up to 70% across top
                    categories
                </span>
            </div>
            <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/85">
                <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
                    <Link
                        href={home.url()}
                        className="flex shrink-0 items-center gap-2.5"
                        aria-label="Velora home"
                    >
                        <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20">
                            <ShoppingBag className="size-5" />
                        </span>
                        <span className="text-xl font-black tracking-[-0.04em]">
                            Velora
                        </span>
                    </Link>
                    <SearchForm
                        query={query}
                        onQueryChange={onQueryChange}
                        onSubmit={submitSearch}
                        className="relative hidden min-w-0 flex-1 md:block"
                    />
                    <nav className="ml-auto hidden items-center gap-2 sm:flex">
                        <Link
                            href={wishlist.url()}
                            className="grid size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-orange-500 dark:text-slate-300 dark:hover:bg-white/5"
                            aria-label="Wishlist"
                        >
                            <Heart className="size-5" />
                        </Link>
                        <Link
                            href={cart.url()}
                            className="relative grid size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-orange-500 dark:text-slate-300 dark:hover:bg-white/5"
                            aria-label="Cart"
                        >
                            <ShoppingCart className="size-5" />
                            <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-orange-500 text-[9px] font-black text-white">
                                0
                            </span>
                        </Link>
                        <Link
                            href={
                                isAuthenticated ? dashboard.url() : login.url()
                            }
                            className="ml-1 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition hover:bg-orange-500 dark:bg-orange-500"
                        >
                            {isAuthenticated ? 'Dashboard' : 'Sign in'}
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
                                onClick={() => selectCategory(category.label)}
                                className="transition hover:text-orange-500"
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                    <Link
                        href={catalog.url()}
                        className="flex items-center gap-1 text-orange-600"
                    >
                        More categories <ChevronDown className="size-3.5" />
                    </Link>
                </div>
                {mobileMenuOpen && (
                    <div className="border-t border-slate-100 p-4 sm:hidden dark:border-white/10">
                        <SearchForm
                            query={query}
                            onQueryChange={onQueryChange}
                            onSubmit={submitSearch}
                            className="relative"
                            compact
                        />
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.label}
                                    type="button"
                                    onClick={() =>
                                        selectCategory(category.label)
                                    }
                                    className="rounded-xl border border-slate-100 px-3 py-2 text-left text-sm font-semibold dark:border-white/10"
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <Link
                                href={wishlist.url()}
                                className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-bold dark:bg-white/5"
                            >
                                <Heart className="size-4" /> Wishlist
                            </Link>
                            <Link
                                href={cart.url()}
                                className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-bold dark:bg-white/5"
                            >
                                <ShoppingCart className="size-4" /> Cart
                            </Link>
                        </div>
                        <Link
                            href={
                                isAuthenticated ? dashboard.url() : login.url()
                            }
                            className="mt-4 flex justify-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white"
                        >
                            {isAuthenticated
                                ? 'Open dashboard'
                                : 'Sign in to Velora'}
                        </Link>
                    </div>
                )}
            </header>
        </>
    );
}

function SearchForm({
    query,
    onQueryChange,
    onSubmit,
    className,
    compact = false,
}: {
    query: string;
    onQueryChange: (query: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    className: string;
    compact?: boolean;
}) {
    return (
        <form onSubmit={onSubmit} className={className}>
            <Search
                className={`absolute left-3 size-4 -translate-y-1/2 text-slate-400 ${compact ? 'top-5' : 'top-1/2 left-4'}`}
            />
            <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={
                    compact
                        ? 'Search products'
                        : 'Search for products, brands and categories'
                }
                className={`${compact ? 'h-10 bg-slate-100 pl-9 dark:bg-white/5' : 'h-12 border border-slate-200 bg-slate-100/70 pr-28 pl-11 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-white/5 dark:focus:ring-orange-500/10'} w-full rounded-full pr-3 text-sm transition outline-none`}
            />
            {!compact && (
                <button className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full bg-slate-950 px-5 py-2 text-xs font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500">
                    Search
                </button>
            )}
        </form>
    );
}
