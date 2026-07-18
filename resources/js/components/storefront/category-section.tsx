import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/components/storefront/catalog';
import SectionTitle from '@/components/storefront/section-title';
import { catalog } from '@/routes/storefront';

export default function CategorySection() {
    return (
        <section
            id="categories"
            className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:scroll-mt-36 lg:px-8"
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
                        <Link
                            key={category.label}
                            href={catalog.url({
                                query: { category: category.label },
                            })}
                            prefetch
                            className="group rounded-[1.75rem] border border-slate-200/80 bg-white p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-950/5 motion-reduce:transform-none dark:border-white/10 dark:bg-white/5"
                        >
                            <span
                                className={`grid aspect-square place-items-center rounded-2xl bg-gradient-to-br ${category.tone}`}
                            >
                                <Icon className="size-8 transition group-hover:scale-110" />
                            </span>
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
