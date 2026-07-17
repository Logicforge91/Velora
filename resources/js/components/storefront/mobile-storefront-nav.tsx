import { Link, usePage } from '@inertiajs/react';
import { Heart, Home, LayoutGrid, ShoppingBag, UserRound } from 'lucide-react';
import { dashboard, home, login } from '@/routes';
import { cart, catalog, wishlist } from '@/routes/storefront';

export default function MobileStorefrontNav() {
    const { props, url } = usePage();
    const { auth } = props;
    const currentPath = url.split('?')[0];
    const accountHref = auth.user ? dashboard.url() : login.url();
    const links = [
        {
            label: 'Home',
            href: home.url(),
            icon: Home,
            active: currentPath === '/',
        },
        {
            label: 'Shop',
            href: catalog.url(),
            icon: LayoutGrid,
            active:
                currentPath === '/shop' || currentPath.startsWith('/products/'),
        },
        {
            label: 'Saved',
            href: wishlist.url(),
            icon: Heart,
            active: currentPath === '/wishlist',
        },
        {
            label: 'Cart',
            href: cart.url(),
            icon: ShoppingBag,
            active: currentPath === '/cart' || currentPath === '/checkout',
        },
        { label: 'Account', href: accountHref, icon: UserRound, active: false },
    ];

    return (
        <nav
            aria-label="Mobile storefront"
            className="fixed right-3 bottom-3 left-3 z-[60] grid grid-cols-5 rounded-[1.4rem] border border-white/70 bg-white/90 p-1.5 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl sm:hidden dark:border-white/10 dark:bg-slate-900/90"
        >
            {links.map((link) => {
                const Icon = link.icon;

                return (
                    <Link
                        key={link.label}
                        href={link.href}
                        prefetch
                        className={`relative flex min-w-0 flex-col items-center gap-1 rounded-[1rem] px-1 py-2 text-[9px] font-black transition ${link.active ? 'bg-slate-950 text-white dark:bg-orange-500' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'}`}
                    >
                        <Icon
                            className={`size-4 ${link.active ? 'stroke-[2.5]' : ''}`}
                        />
                        <span className="truncate">{link.label}</span>
                        {link.label === 'Cart' && (
                            <span className="absolute top-1 right-[22%] size-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-900" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
