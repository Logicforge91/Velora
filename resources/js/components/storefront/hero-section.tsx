import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Headphones,
    ShieldCheck,
    Smartphone,
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
        <section className="relative overflow-hidden bg-[#f7f5f2] dark:bg-slate-950">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 size-[38rem] rounded-full bg-orange-300/30 blur-3xl dark:bg-orange-500/10" />
                <div className="absolute -bottom-48 left-1/4 size-[34rem] rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-500/10" />
                <div className="absolute inset-0 [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.025] dark:opacity-[0.05]" />
            </div>

            <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
                <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-black tracking-wide text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                        <Sparkles className="size-3.5 text-orange-500" />
                        The 2026 shopping edit
                    </span>
                    <h1 className="mt-6 text-5xl leading-[0.98] font-black tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
                        Find your next
                        <span className="block bg-gradient-to-r from-orange-500 via-rose-500 to-violet-600 bg-clip-text pb-2 text-transparent">
                            favourite thing.
                        </span>
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
                        A thoughtfully curated marketplace for everyday icons,
                        clever upgrades, and prices that feel just right.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={catalog.url()}
                            prefetch
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-500 motion-reduce:transform-none dark:bg-orange-500"
                        >
                            Shop the latest <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href={
                                isAuthenticated ? dashboard.url() : login.url()
                            }
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-black text-slate-700 backdrop-blur transition hover:border-orange-300 hover:text-orange-600 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        >
                            {isAuthenticated
                                ? 'Your account'
                                : 'Sign in to personalise'}
                        </Link>
                    </div>
                    <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-2">
                            <BadgeCheck className="size-4 text-emerald-500" />{' '}
                            Verified sellers
                        </span>
                        <span className="flex items-center gap-2">
                            <Truck className="size-4 text-blue-500" /> Fast
                            delivery
                        </span>
                        <span className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-violet-500" />{' '}
                            Secure checkout
                        </span>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-xl lg:pl-5">
                    <div className="grid grid-cols-12 gap-3 sm:gap-4">
                        <article className="col-span-12 row-span-2 overflow-hidden rounded-[2rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/20 sm:col-span-7 sm:p-7">
                            <div className="flex items-center justify-between">
                                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black tracking-wider text-orange-300 uppercase">
                                    Editor's pick
                                </span>
                                <span className="flex items-center gap-1 text-xs font-bold">
                                    4.8{' '}
                                    <Star className="size-3 fill-orange-400 text-orange-400" />
                                </span>
                            </div>
                            <div className="grid min-h-52 place-items-center sm:min-h-64">
                                <div className="relative grid size-36 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 sm:size-44">
                                    <Smartphone className="size-20 drop-shadow-2xl sm:size-24" />
                                    <span className="absolute -right-2 -bottom-2 rounded-full bg-white px-3 py-2 text-[11px] font-black text-slate-950 shadow-lg">
                                        17% off
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs font-bold text-slate-400">
                                Nova X Pro
                            </p>
                            <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
                                <h2 className="text-lg font-black sm:text-xl">
                                    Made to move.
                                </h2>
                                <span className="text-sm font-black">
                                    ₹28,999
                                </span>
                            </div>
                        </article>

                        <article className="col-span-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-200 to-fuchsia-100 p-4 text-violet-950 shadow-xl shadow-violet-950/5 sm:col-span-5 sm:p-5 dark:from-violet-500/30 dark:to-fuchsia-500/10 dark:text-white">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-[11px] font-black tracking-wider uppercase opacity-60">
                                        Sound edit
                                    </p>
                                    <p className="mt-1 text-sm font-black">
                                        Studio calm
                                    </p>
                                </div>
                                <Headphones className="size-8" />
                            </div>
                            <p className="mt-8 text-xs font-black">
                                From ₹2,499
                            </p>
                        </article>

                        <article className="col-span-6 rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-xl shadow-slate-950/5 backdrop-blur sm:col-span-5 sm:p-5 dark:border-white/10 dark:bg-white/5">
                            <div className="flex -space-x-2">
                                {['A', 'R', 'K', 'S'].map((letter, index) => (
                                    <span
                                        key={letter}
                                        className="grid size-8 place-items-center rounded-full border-2 border-white bg-slate-900 text-[11px] font-black text-white dark:border-slate-900"
                                        style={{ zIndex: 4 - index }}
                                    >
                                        {letter}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-4 text-sm font-black text-slate-950 dark:text-white">
                                Loved by 10k+ shoppers
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Real finds. Real favourites.
                            </p>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
}
