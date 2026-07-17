import { BadgeCheck, CircleDot, Sparkles } from 'lucide-react';

const labels = ['NOVA', 'STUDIO', 'PULSE', 'AIRBOOK', 'MODERN HOME'];

export default function BrandRibbon() {
    return (
        <section className="border-y border-slate-200/80 bg-white dark:border-white/10 dark:bg-white/[0.025]">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div className="flex items-center gap-2 text-xs font-black tracking-[0.16em] text-slate-500 uppercase">
                    <BadgeCheck className="size-4 text-emerald-500" />
                    Curated brands, verified quality
                </div>
                <div className="flex max-w-full items-center gap-5 overflow-hidden text-sm font-black tracking-[0.18em] text-slate-300 sm:gap-8 dark:text-slate-700">
                    {labels.map((label, index) => (
                        <span
                            key={label}
                            className="flex shrink-0 items-center gap-5 sm:gap-8"
                        >
                            {label}
                            {index < labels.length - 1 && (
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
