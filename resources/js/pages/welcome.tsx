import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import BrandRibbon from '@/components/storefront/brand-ribbon';
import { products } from '@/components/storefront/catalog';
import CategorySection from '@/components/storefront/category-section';
import DealsSection from '@/components/storefront/deals-section';
import DiscoverySection from '@/components/storefront/discovery-section';
import EditorialSection from '@/components/storefront/editorial-section';
import HeroSection from '@/components/storefront/hero-section';
import MembershipSection from '@/components/storefront/membership-section';
import MobileStorefrontNav from '@/components/storefront/mobile-storefront-nav';
import SiteFooter from '@/components/storefront/site-footer';
import SiteHeader from '@/components/storefront/site-header';
import StorefrontPageLoader from '@/components/storefront/storefront-page-loader';
import TrustStrip from '@/components/storefront/trust-strip';

export default function Welcome() {
    const { auth } = usePage().props;
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
    const clearFilters = () => {
        setQuery('');
        setActiveCategory('All');
    };

    return (
        <>
            <Head title="Discover what's next" />
            <div className="min-h-screen bg-[#f8f8f6] pb-20 font-sans text-slate-950 antialiased sm:pb-0 dark:bg-slate-950 dark:text-white">
                <SiteHeader
                    isAuthenticated={Boolean(auth.user)}
                    query={query}
                    onQueryChange={setQuery}
                    onCategoryChange={setActiveCategory}
                />
                <main>
                    <HeroSection isAuthenticated={Boolean(auth.user)} />
                    <BrandRibbon />
                    <CategorySection />
                    <DiscoverySection />
                    <DealsSection
                        activeCategory={activeCategory}
                        products={filteredProducts}
                        onCategoryChange={setActiveCategory}
                        onClear={clearFilters}
                    />
                    <EditorialSection />
                    <MembershipSection isAuthenticated={Boolean(auth.user)} />
                    <TrustStrip />
                </main>
                <SiteFooter />
                <MobileStorefrontNav />
                <StorefrontPageLoader />
            </div>
        </>
    );
}
