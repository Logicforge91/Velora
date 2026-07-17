import { Link } from '@inertiajs/react';
import { ArrowRight, Heart, Quote, Sparkles, Star } from 'lucide-react';
import { catalog } from '@/routes/storefront';

const reviews = [
    {
        copy: 'The whole experience feels considered—from discovering something new to the delivery at my door.',
        name: 'Anika S.',
        city: 'Bengaluru',
        tone: 'bg-[#f7d7c9]',
    },
    {
        copy: 'I found better choices without opening twenty tabs. Velora makes browsing feel calm again.',
        name: 'Rohan M.',
        city: 'Pune',
        tone: 'bg-[#dcebdc]',
    },
    {
        copy: 'Beautiful products, clear prices, and no clutter. This is how a modern marketplace should feel.',
        name: 'Meera K.',
        city: 'Chennai',
        tone: 'bg-[#dedcf4]',
    },
];

export default function EditorialSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[2.5rem] bg-[#151515] text-white">
                <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
                    <div className="relative overflow-hidden p-8 sm:p-12 lg:p-14">
                        <div className="absolute -top-20 -left-20 size-72 rounded-full bg-orange-500/20 blur-3xl" />
                        <div className="absolute right-0 bottom-0 size-64 rounded-full bg-violet-500/15 blur-3xl" />
                        <div className="relative">
                            <span className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-orange-300 uppercase">
                                <Sparkles className="size-4" /> The human edit
                            </span>
                            <h2 className="mt-5 max-w-lg text-4xl leading-[1.02] font-black tracking-[-0.055em] sm:text-5xl">
                                Less endless scrolling.
                                <span className="block font-serif font-normal text-orange-300 italic">
                                    More brilliant finding.
                                </span>
                            </h2>
                            <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
                                Every Velora collection is shaped around
                                usefulness, quality, and a little everyday
                                joy—not simply what is loudest.
                            </p>
                            <Link
                                href={catalog.url()}
                                prefetch
                                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-orange-300"
                            >
                                Explore the full edit{' '}
                                <ArrowRight className="size-4" />
                            </Link>
                            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-7">
                                <Metric value="4.8/5" label="shopper love" />
                                <Metric value="10k+" label="new members" />
                                <Metric value="6" label="curated worlds" />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-px bg-white/10 sm:grid-cols-2">
                        {reviews.map((review, index) => (
                            <article
                                key={review.name}
                                className={`${review.tone} p-7 text-slate-950 sm:p-8 ${index === 0 ? 'sm:col-span-2' : ''}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <Quote className="size-7 fill-current opacity-20" />
                                    <span className="inline-flex items-center gap-1 text-xs font-black">
                                        5.0{' '}
                                        <Star className="size-3 fill-orange-500 text-orange-500" />
                                    </span>
                                </div>
                                <p
                                    className={`mt-6 font-black tracking-[-0.025em] ${index === 0 ? 'max-w-xl text-2xl sm:text-3xl' : 'text-lg'}`}
                                >
                                    “{review.copy}”
                                </p>
                                <div className="mt-7 flex items-center gap-3">
                                    <span className="grid size-9 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">
                                        {review.name.charAt(0)}
                                    </span>
                                    <div>
                                        <p className="text-xs font-black">
                                            {review.name}
                                        </p>
                                        <p className="text-[11px] opacity-60">
                                            Verified shopper · {review.city}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                    <Heart className="size-4 text-rose-500" /> Chosen with care
                </span>
                <span>Independent marketplace</span>
                <span>Designed for discovery</span>
            </div>
        </section>
    );
}

function Metric({ value, label }: { value: string; label: string }) {
    return (
        <div>
            <p className="text-xl font-black sm:text-2xl">{value}</p>
            <p className="mt-1 text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                {label}
            </p>
        </div>
    );
}
