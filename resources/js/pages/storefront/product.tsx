import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { products } from '@/components/storefront/catalog';
import ProductBundleSection from '@/components/storefront/product-bundle-section';
import ProductDetailsExperience from '@/components/storefront/product-details-experience';
import ProductInformationSection from '@/components/storefront/product-information-section';
import ProductRecommendationSection from '@/components/storefront/product-recommendation-section';
import ProductReviewSection from '@/components/storefront/product-review-section';
import StorefrontLayout from '@/layouts/storefront-layout';
import { catalog } from '@/routes/storefront';

export default function Product({ productSlug }: { productSlug: string }) {
    const selectedProduct =
        products.find((item) => item.slug === productSlug) ?? products[0];
    const alternativeProducts = products.filter(
        (item) => item.id !== selectedProduct.id,
    );
    const suggestedProducts = alternativeProducts.slice(0, 3);
    const moreProducts = [...alternativeProducts].reverse().slice(0, 3);
    const recentlyViewedProducts = [
        ...alternativeProducts.slice(2),
        ...alternativeProducts.slice(0, 2),
    ].slice(0, 3);
    const bundleProducts = [
        selectedProduct,
        ...alternativeProducts.slice(0, 2),
    ];

    return (
        <StorefrontLayout>
            <Head title={selectedProduct.name} />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <nav className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                    <Link
                        href={catalog.url()}
                        className="hover:text-orange-500"
                    >
                        Shop
                    </Link>
                    <ChevronRight className="size-3" />
                    <span>{selectedProduct.category}</span>
                    <ChevronRight className="size-3" />
                    <span>{selectedProduct.name}</span>
                </nav>

                <ProductDetailsExperience product={selectedProduct} />

                <div className="mt-20 grid gap-20">
                    <ProductInformationSection product={selectedProduct} />
                    <ProductBundleSection products={bundleProducts} />
                    <div id="customer-reviews" className="scroll-mt-32">
                        <ProductReviewSection product={selectedProduct} />
                    </div>
                    <ProductRecommendationSection
                        eyebrow="Picked around your taste"
                        title="Similar products"
                        description="Thoughtful recommendations inspired by the product you are viewing."
                        products={suggestedProducts}
                    />
                    <ProductRecommendationSection
                        eyebrow="Keep discovering"
                        title="More for you"
                        description="Fresh finds across categories, prices, and everyday moments."
                        products={moreProducts}
                        tone="soft"
                    />
                    <ProductRecommendationSection
                        eyebrow="Back to your browsing"
                        title="Recently viewed"
                        description="A quick way back to products that caught your attention."
                        products={recentlyViewedProducts}
                    />
                </div>
            </div>
        </StorefrontLayout>
    );
}
