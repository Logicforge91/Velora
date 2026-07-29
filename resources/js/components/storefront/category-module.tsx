import {
    ArrowRight,
    ChevronRight,
    Layers3,
    ShieldCheck,
    Sparkles,
    Tag,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { categories, products } from '@/components/storefront/catalog';

const categoryDetails = {
    Mobiles: {
        headline: 'Technology that keeps up.',
        copy: 'Smartphones and connected essentials selected for performance, reliability, and everyday ease.',
        offer: 'Up to 25% off smartphones',
        subcategories: {
            Smartphones: ['5G phones', 'Camera phones', 'Gaming phones'],
            Accessories: ['Cases', 'Chargers', 'Screen protection'],
        },
    },
    Fashion: {
        headline: 'Style made for real life.',
        copy: 'Comfortable, considered fashion for workdays, weekends, and everything between.',
        offer: 'Extra 10% off seasonal styles',
        subcategories: {
            Footwear: ['Sneakers', 'Sandals', 'Formal shoes'],
            Clothing: ['Everyday wear', 'Activewear', 'Occasion wear'],
        },
    },
    Electronics: {
        headline: 'Smarter tools, less noise.',
        copy: 'Trusted audio, computing, and connected technology chosen to work beautifully.',
        offer: 'Save up to 50% on audio',
        subcategories: {
            Audio: ['Headphones', 'Speakers', 'Earbuds'],
            Laptops: ['Everyday laptops', 'Performance', 'Accessories'],
        },
    },
    Home: {
        headline: 'A calmer place to land.',
        copy: 'Useful home updates and thoughtful details for spaces that feel effortlessly yours.',
        offer: 'Home refresh from ₹699',
        subcategories: {
            'Home décor': ['Soft furnishings', 'Lighting', 'Wall décor'],
            Kitchen: ['Cookware', 'Serveware', 'Storage'],
        },
    },
    Appliances: {
        headline: 'Make everyday work lighter.',
        copy: 'Dependable appliances selected for useful features, efficient performance, and lasting value.',
        offer: 'No-cost EMI on appliances',
        subcategories: {
            Kitchen: ['Mixers', 'Air fryers', 'Coffee makers'],
            Home: ['Cleaning', 'Air care', 'Personal care'],
        },
    },
    Accessories: {
        headline: 'Small details, better days.',
        copy: 'Wearables and finishing touches that bring function, personality, and ease to your routine.',
        offer: 'Wearables up to 50% off',
        subcategories: {
            Wearables: ['Smartwatches', 'Fitness bands', 'Watch straps'],
            Essentials: ['Bags', 'Wallets', 'Travel'],
        },
    },
} as const;

type CategoryName = keyof typeof categoryDetails;

type Props = {
    activeCategory: string;
    activeSubcategory: string;
    onCategoryChange: (category: string) => void;
    onSubcategoryChange: (subcategory: string) => void;
};

export default function CategoryModule({
    activeCategory,
    activeSubcategory,
    onCategoryChange,
    onSubcategoryChange,
}: Props) {
    const selectedCategory: CategoryName =
        activeCategory !== 'All' && activeCategory in categoryDetails
            ? (activeCategory as CategoryName)
            : 'Electronics';
    const details = categoryDetails[selectedCategory];
    const [expandedCategory, setExpandedCategory] =
        useState<CategoryName>(selectedCategory);
    const relevantBrands = useMemo(
        () => [
            ...new Set(
                products
                    .filter((product) => product.category === selectedCategory)
                    .map((product) => product.brand),
            ),
        ],
        [selectedCategory],
    );

    const chooseCategory = (category: CategoryName) => {
        setExpandedCategory(category);
        onCategoryChange(category);
        onSubcategoryChange('All');
    };

    return (
        <section className="border-b border-slate-950/8 bg-[#f8f7f4] py-12 dark:border-white/10 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-black tracking-[0.18em] text-orange-500 uppercase">
                            Shop by department
                        </p>
                        <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
                            Explore categories
                        </h2>
                    </div>
                    <span className="hidden items-center gap-2 text-xs font-bold text-slate-400 sm:flex">
                        <Layers3 className="size-4" /> Three levels of discovery
                    </span>
                </div>

                <div className="mt-7 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
                    <nav
                        aria-label="Product categories"
                        className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5"
                    >
                        {categories.map((category) => {
                            const name = category.label as CategoryName;
                            const isExpanded = expandedCategory === name;

                            return (
                                <div key={name}>
                                    <button
                                        type="button"
                                        onClick={() => chooseCategory(name)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black transition ${selectedCategory === name ? 'bg-slate-950 text-white dark:bg-orange-500' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                        aria-expanded={isExpanded}
                                    >
                                        <category.icon className="size-4" />
                                        {name}
                                        <ChevronRight
                                            className={`ml-auto size-4 transition ${isExpanded ? 'rotate-90' : ''}`}
                                        />
                                    </button>
                                    {isExpanded && (
                                        <div className="grid gap-1 px-3 py-2">
                                            {Object.entries(
                                                categoryDetails[name]
                                                    .subcategories,
                                            ).map(([subcategory, children]) => (
                                                <div
                                                    key={subcategory}
                                                    className="border-l border-slate-200 pl-3 dark:border-white/10"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onSubcategoryChange(
                                                                subcategory,
                                                            )
                                                        }
                                                        className={`py-1.5 text-xs font-black ${activeSubcategory === subcategory ? 'text-orange-600' : 'text-slate-600 hover:text-orange-500 dark:text-slate-300'}`}
                                                    >
                                                        {subcategory}
                                                    </button>
                                                    <div className="flex flex-wrap gap-x-3 gap-y-1 pb-2">
                                                        {children.map(
                                                            (child: string) => (
                                                                <button
                                                                    key={child}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onSubcategoryChange(
                                                                            subcategory,
                                                                        )
                                                                    }
                                                                    className="text-[10px] text-slate-400 hover:text-orange-500"
                                                                >
                                                                    {child}
                                                                </button>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    <div className="relative min-h-96 overflow-hidden rounded-[2rem] bg-slate-950 text-white">
                        <img
                            src="/images/storefront/velora-summer-edit.png"
                            alt={`${selectedCategory} category collection`}
                            className="absolute inset-0 size-full object-cover opacity-45"
                            style={{
                                objectPosition:
                                    categories.find(
                                        (item) =>
                                            item.label === selectedCategory,
                                    )?.imagePosition ?? 'center',
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                        <div className="relative flex min-h-96 max-w-xl flex-col justify-end p-7 sm:p-10">
                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-black tracking-wider uppercase">
                                <Sparkles className="size-3" /> Featured
                                category
                            </span>
                            <p className="mt-5 text-sm font-bold text-orange-300">
                                {selectedCategory}
                            </p>
                            <h3 className="mt-1 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                                {details.headline}
                            </h3>
                            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                                {details.copy}
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .querySelector('#product-results')
                                        ?.scrollIntoView({ behavior: 'smooth' })
                                }
                                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950"
                            >
                                Shop {selectedCategory}{' '}
                                <ArrowRight className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <CategoryMetaCard
                        icon={<Tag className="size-5" />}
                        label="Category offer"
                        value={details.offer}
                        tone="bg-orange-100 text-orange-950"
                    />
                    <CategoryMetaCard
                        icon={<ShieldCheck className="size-5" />}
                        label="Featured brands"
                        value={
                            relevantBrands.length > 0
                                ? relevantBrands.join(' · ')
                                : 'Verified category specialists'
                        }
                        tone="bg-emerald-100 text-emerald-950"
                    />
                    <CategoryMetaCard
                        icon={<Layers3 className="size-5" />}
                        label="Popular filters"
                        value={Object.keys(details.subcategories).join(' · ')}
                        tone="bg-violet-100 text-violet-950"
                    />
                </div>

                <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                    <p className="text-[10px] font-black tracking-[0.18em] text-slate-400 uppercase">
                        About {selectedCategory} at Velora
                    </p>
                    <h2 className="mt-2 text-xl font-black">
                        Shop the best {selectedCategory.toLowerCase()} online
                    </h2>
                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Discover curated {selectedCategory.toLowerCase()} from
                        verified brands and trusted sellers. Compare useful
                        features, transparent prices, customer ratings, and
                        delivery options to find the right choice with
                        confidence.
                    </p>
                </article>
            </div>
        </section>
    );
}

function CategoryMetaCard({
    icon,
    label,
    value,
    tone,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    tone: string;
}) {
    return (
        <div className={`rounded-[1.5rem] p-5 ${tone}`}>
            {icon}
            <p className="mt-4 text-[10px] font-black tracking-wider uppercase opacity-60">
                {label}
            </p>
            <p className="mt-1 text-sm font-black">{value}</p>
        </div>
    );
}
