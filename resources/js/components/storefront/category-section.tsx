import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/components/storefront/catalog';
import SectionTitle from '@/components/storefront/section-title';
import { catalog } from '@/routes/storefront';

export default function CategorySection() {
    return (
        <section
            id="categories"
            className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 lg:scroll-mt-36 lg:px-8"
        >
            <SectionTitle
                eyebrow="Shop your way"
                title="Explore popular categories"
                description="From daily essentials to your next upgrade."
            />
            <div className="-mx-4 mt-7 flex snap-x snap-mandatory [scrollbar-width:none] gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6 [&::-webkit-scrollbar]:hidden">
                {categories.map((category) => {
                    return (
                        <Link
                            key={category.label}
                            href={catalog.url({
                                query: { category: category.label },
                            })}
                            prefetch
                            className="group w-32 shrink-0 snap-start rounded-[1.5rem] border border-slate-950/8 bg-white p-3 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-950/5 motion-reduce:transform-none sm:w-auto sm:p-4 dark:border-white/10 dark:bg-white/5"
                        >
                            <span
                                role="img"
                                aria-label={category.label}
                                className="block aspect-square rounded-[1.1rem] bg-[url(/images/storefront/velora-product-grid.png)] bg-[length:300%_200%] bg-no-repeat transition duration-500 group-hover:scale-[1.03]"
                                style={{
                                    backgroundPosition: category.imagePosition,
                                }}
                            />
                            <span className="mt-3 flex items-center justify-between text-sm font-black">
                                {category.label}
                                <ArrowRight className="size-3.5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
