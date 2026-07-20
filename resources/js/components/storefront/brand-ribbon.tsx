import { BadgeCheck, CircleDot, Sparkles } from 'lucide-react';

const brands = [
    { label: 'NOVA', imagePosition: '0% 0%' },
    { label: 'STUDIO', imagePosition: '50% 0%' },
    { label: 'PULSE', imagePosition: '0% 100%' },
    { label: 'AIRBOOK', imagePosition: '50% 100%' },
    { label: 'MODERN HOME', imagePosition: '100% 100%' },
];

export default function BrandRibbon() {
    return (
        <section className="border-y border-slate-200/80 bg-white dark:border-white/10 dark:bg-white/[0.025]">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div className="flex items-center gap-2 text-xs font-black tracking-[0.16em] text-slate-500 uppercase">
                    <BadgeCheck className="size-4 text-emerald-500" />
                    Curated brands, verified quality
                </div>
                <div className="flex max-w-full items-center gap-5 overflow-hidden text-sm font-black tracking-[0.18em] text-slate-300 sm:gap-8 dark:text-slate-700">
                    {brands.map((brand, index) => (
                        <span
                            key={brand.label}
                            className="flex shrink-0 items-center gap-5 sm:gap-8"
                        >
                            <span className="flex items-center gap-2.5 text-slate-500 dark:text-slate-300">
                                <span
                                    role="img"
                                    aria-label={`${brand.label} collection`}
                                    className="size-8 rounded-full bg-[url(/images/storefront/velora-product-grid.png)] bg-[length:300%_200%] bg-no-repeat ring-1 ring-slate-950/5"
                                    style={{
                                        backgroundPosition: brand.imagePosition,
                                    }}
                                />
                                {brand.label}
                            </span>
                            {index < brands.length - 1 && (
                                <CircleDot className="size-2 text-orange-400" />
                            )}
                        </span>
                    ))}
                </div>
                <span className="hidden items-center gap-2 text-xs font-black text-orange-500 xl:flex">
                    <Sparkles className="size-4" /> New every week
                </span>
            </div>
        </section>
    );
}
