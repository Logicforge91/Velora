import { router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import MobileStorefrontNav from '@/components/storefront/mobile-storefront-nav';
import SiteFooter from '@/components/storefront/site-footer';
import SiteHeader from '@/components/storefront/site-header';
import StorefrontPageLoader from '@/components/storefront/storefront-page-loader';
import { catalog } from '@/routes/storefront';

type Props = PropsWithChildren<{
    query?: string;
    onQueryChange?: (query: string) => void;
}>;

export default function StorefrontLayout({
    children,
    query,
    onQueryChange,
}: Props) {
    const { auth } = usePage().props;
    const [localQuery, setLocalQuery] = useState('');
    const activeQuery = query ?? localQuery;
    const updateQuery = onQueryChange ?? setLocalQuery;

    return (
        <div className="min-h-screen bg-[#f8f8f6] pb-20 font-sans text-slate-950 antialiased sm:pb-0 dark:bg-slate-950 dark:text-white">
            <SiteHeader
                isAuthenticated={Boolean(auth.user)}
                query={activeQuery}
                onQueryChange={updateQuery}
                onCategoryChange={(category) => {
                    router.visit(catalog.url({ query: { category } }));
                }}
                onSearchSubmit={() => {
                    router.visit(
                        catalog.url({ query: { search: activeQuery } }),
                    );
                }}
            />
            <main>{children}</main>
            <SiteFooter />
            <MobileStorefrontNav />
            <StorefrontPageLoader />
        </div>
    );
}
