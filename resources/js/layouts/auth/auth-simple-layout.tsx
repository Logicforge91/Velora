import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeCheck,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Truck,
} from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <main className="min-h-svh bg-[#f5f7fb] text-slate-950 dark:bg-[#080c14] dark:text-white">
            <div className="grid min-h-svh lg:grid-cols-[minmax(0,1.05fr)_minmax(520px,0.95fr)]">
                <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col xl:p-14">
                    <div className="absolute -top-40 -left-32 size-[30rem] rounded-full bg-orange-500/25 blur-3xl" />
                    <div className="absolute right-[-15%] bottom-[-20%] size-[34rem] rounded-full bg-violet-600/20 blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.08),transparent_28%)]" />

                    <Link
                        href={home()}
                        className="relative z-10 flex w-fit items-center gap-3 text-xl font-black tracking-[-0.04em]"
                    >
                        <span className="grid size-11 place-items-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/25">
                            <ShoppingBag className="size-5" />
                        </span>
                        {String(name)}
                    </Link>

                    <div className="relative z-10 my-auto max-w-xl py-16">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-black tracking-[0.16em] text-orange-200 uppercase">
                            <Sparkles className="size-3.5" /> Your Velora
                            account
                        </span>
                        <h2 className="mt-7 text-5xl leading-[0.98] font-black tracking-[-0.065em] xl:text-6xl">
                            Everything you love, all in one place.
                        </h2>
                        <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 xl:text-lg">
                            Save favourites, follow every delivery and discover
                            offers selected for you.
                        </p>

                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            <Benefit icon={Truck} label="Live order tracking" />
                            <Benefit
                                icon={BadgeCheck}
                                label="Verified products"
                            />
                            <Benefit
                                icon={ShieldCheck}
                                label="Secure checkout"
                            />
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-slate-500">
                        © {new Date().getFullYear()} {String(name)}. Shop with
                        confidence.
                    </p>
                </section>

                <section className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
                    <div className="absolute top-0 right-0 size-72 rounded-full bg-orange-100/70 blur-3xl dark:bg-orange-500/10" />
                    <div className="relative w-full max-w-[500px]">
                        <Link
                            href={home()}
                            className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-600 dark:text-slate-400"
                        >
                            <ArrowLeft className="size-4" /> Back to shopping
                        </Link>

                        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-2xl shadow-slate-900/8 backdrop-blur-xl sm:p-9 dark:border-white/10 dark:bg-slate-900/90 dark:shadow-black/30">
                            <Link
                                href={home()}
                                className="mb-7 flex items-center gap-2.5 font-black tracking-[-0.04em] lg:hidden"
                            >
                                <span className="grid size-9 place-items-center rounded-xl bg-orange-500 text-white">
                                    <ShoppingBag className="size-4" />
                                </span>
                                {String(name)}
                            </Link>

                            <div className="mb-8 space-y-2">
                                <h1 className="text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                                    {title}
                                </h1>
                                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    {description}
                                </p>
                            </div>

                            {children}
                        </div>

                        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                            Protected by encrypted sessions and secure account
                            recovery.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

function Benefit({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
            <Icon className="size-5 text-orange-300" />
            <p className="mt-3 text-sm leading-5 font-bold text-slate-200">
                {label}
            </p>
        </div>
    );
}
