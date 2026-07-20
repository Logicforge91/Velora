import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Heart,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
} from 'lucide-react';
import { dashboard, login } from '@/routes';
import { catalog } from '@/routes/storefront';

export default function HeroSection({
    isAuthenticated,
}: {
    isAuthenticated: boolean;
}) {
    return (
        <section className="relative overflow-hidden bg-[#f2eee7] dark:bg-slate-950">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
            <div className="relative mx-auto grid max-w-[90rem] gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:gap-5 lg:px-8 lg:py-6">
                <div className="flex flex-col justify-center py-6 lg:px-8 lg:py-16 xl:px-14">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-950/10 bg-white/60 px-3 py-1.5 text-[11px] font-black tracking-[0.16em] text-slate-700 uppercase backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                            <Sparkles className="size-3.5 text-orange-500" />
                            The summer edit
                        </span>
                        <span className="hidden text-xs font-bold text-slate-500 sm:block dark:text-slate-400">
                            47 new arrivals
                        </span>
                    </div>

                    <h1 className="mt-6 max-w-3xl text-[clamp(3.5rem,7vw,7rem)] leading-[0.83] font-black tracking-[-0.075em] text-slate-950 dark:text-white">
                        Find less.
                        <span className="mt-3 block font-serif font-normal tracking-[-0.05em] text-orange-600 italic dark:text-orange-400">
                            Love more.
                        </span>
                    </h1>
                    <p className="mt-7 max-w-lg text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
                        A sharper edit of useful, beautiful things. Curated for
                        real life, delivered across India.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={catalog.url()}
                            prefetch
                            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-slate-950 px-6 text-sm font-black text-white shadow-[0_12px_30px_rgb(15_23_42/0.16)] transition hover:-translate-y-0.5 hover:bg-orange-600 motion-reduce:transform-none dark:bg-orange-500"
                        >
                            Shop new arrivals
                            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href={
                                isAuthenticated ? dashboard.url() : login.url()
                            }
                            className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-950/15 bg-white/50 px-6 text-sm font-black text-slate-800 backdrop-blur transition hover:border-orange-500 hover:bg-white hover:text-orange-600 dark:border-white/15 dark:bg-white/5 dark:text-white"
                        >
                            {isAuthenticated
                                ? 'Open my account'
                                : 'Personalise my shop'}
                        </Link>
                    </div>

                    <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-950/10 pt-6 dark:border-white/10">
                        <HeroProof
                            icon={BadgeCheck}
                            value="4.8/5"
                            label="shopper rating"
                        />
                        <HeroProof
                            icon={Truck}
                            value="2-day"
                            label="fast dispatch"
                        />
                        <HeroProof
                            icon={ShieldCheck}
                            value="100%"
                            label="secure checkout"
                        />
                    </div>
                </div>

                <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-[#e6c39e] sm:min-h-[600px] lg:min-h-[680px] lg:rounded-[2.5rem]">
                    <img
                        src="/images/storefront/velora-summer-edit.png"
                        alt="A curated edit of headphones, a speaker, travel tumbler and camera"
                        className="absolute inset-0 size-full object-cover object-center"
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

                    <div className="absolute top-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-950 shadow-lg backdrop-blur sm:top-6 sm:left-6">
                        Curated, not crowded
                    </div>
                    <button
                        type="button"
                        className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/90 text-slate-950 shadow-lg backdrop-blur transition hover:scale-105 hover:text-rose-500 sm:top-6 sm:right-6"
                        aria-label="Save the summer edit"
                    >
                        <Heart className="size-4" />
                    </button>

                    <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-4 rounded-[1.4rem] border border-white/25 bg-slate-950/70 p-4 text-white shadow-2xl backdrop-blur-xl sm:right-6 sm:bottom-6 sm:left-6 sm:p-5">
                        <div>
                            <p className="text-[10px] font-black tracking-[0.18em] text-orange-300 uppercase">
                                Trending now
                            </p>
                            <p className="mt-1 text-lg font-black tracking-tight sm:text-xl">
                                Colour that moves with you
                            </p>
                            <p className="mt-1 hidden text-xs text-white/65 sm:block">
                                Audio, travel and everyday tech from ₹899
                            </p>
                        </div>
                        <div className="shrink-0 text-right">
                            <span className="inline-flex items-center gap-1 text-xs font-black">
                                4.9{' '}
                                <Star className="size-3 fill-orange-400 text-orange-400" />
                            </span>
                            <p className="mt-1 text-[10px] text-white/60">
                                1.2k saves
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function HeroProof({
    icon: Icon,
    value,
    label,
}: {
    icon: typeof BadgeCheck;
    value: string;
    label: string;
}) {
    return (
        <div>
            <div className="flex items-center gap-1.5">
                <Icon className="size-3.5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-black">{value}</span>
            </div>
            <p className="mt-1 text-[10px] font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {label}
            </p>
        </div>
    );
}
