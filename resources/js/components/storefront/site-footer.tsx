import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { cart, catalog, checkout, wishlist } from '@/routes/storefront';

const groups = [
    {
        title: 'Shop',
        links: [
            { label: 'All products', href: catalog.url() },
            {
                label: 'Mobiles',
                href: catalog.url({ query: { category: 'Mobiles' } }),
            },
            {
                label: 'Fashion',
                href: catalog.url({ query: { category: 'Fashion' } }),
            },
            {
                label: 'Electronics',
                href: catalog.url({ query: { category: 'Electronics' } }),
            },
        ],
    },
    {
        title: 'Your account',
        links: [
            { label: 'Wishlist', href: wishlist.url() },
            { label: 'Shopping cart', href: cart.url() },
            { label: 'Checkout', href: checkout.url() },
            { label: 'Continue shopping', href: catalog.url() },
        ],
    },
    {
        title: 'Discover',
        links: [
            {
                label: 'New arrivals',
                href: catalog.url({ query: { sort: 'new' } }),
            },
            {
                label: 'Top rated',
                href: catalog.url({ query: { sort: 'rating' } }),
            },
            {
                label: 'Best deals',
                href: catalog.url({ query: { sort: 'deals' } }),
            },
            { label: 'Home', href: home.url() },
        ],
    },
];

export default function SiteFooter() {
    return (
        <footer className="bg-slate-950 text-slate-300">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
                <div>
                    <Link
                        href={home.url()}
                        className="flex items-center gap-2.5 text-white"
                        aria-label="Velora home"
                    >
                        <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500">
                            <AppLogoIcon className="size-6" />
                        </span>
                        <span className="text-xl font-black tracking-tight">
                            Velora
                        </span>
                    </Link>
                    <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
                        A modern marketplace built around better selection,
                        transparent operations, and delightful shopping.
                    </p>
                </div>
                {groups.map((group) => (
                    <FooterLinks key={group.title} {...group} />
                ))}
            </div>
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
                    <p>
                        © {new Date().getFullYear()} Velora Commerce. All rights
                        reserved.
                    </p>
                    <p>Made for modern Indian shopping.</p>
                </div>
            </div>
        </footer>
    );
}

function FooterLinks({
    title,
    links,
}: {
    title: string;
    links: Array<{ label: string; href: string }>;
}) {
    return (
        <div>
            <h3 className="text-sm font-black text-white">{title}</h3>
            <ul className="mt-4 grid gap-3 text-sm text-slate-400">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            prefetch
                            className="group inline-flex items-center gap-1 transition hover:text-orange-400"
                        >
                            {link.label}
                            <ArrowUpRight className="size-3 opacity-0 transition group-hover:opacity-100" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
