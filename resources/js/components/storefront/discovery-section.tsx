import { Link } from '@inertiajs/react';
import { ArrowUpRight, Gift, Heart, Sparkles, TimerReset } from 'lucide-react';
import SectionTitle from '@/components/storefront/section-title';
import { catalog } from '@/routes/storefront';

const edits = [
    {
        eyebrow: 'For your everyday',
        title: 'Small upgrades, big energy.',
        copy: 'Design-led essentials selected to make daily life feel easier.',
        icon: Sparkles,
        className: 'bg-[#dff5eb] text-emerald-950 lg:col-span-7',
        art: 'from-emerald-300 to-teal-500',
    },
    {
        eyebrow: 'Under ₹1,999',
        title: 'Good design. Better prices.',
        copy: 'High-impact finds without the high-ticket feeling.',
        icon: Gift,
        className: 'bg-[#f4e8ff] text-violet-950 lg:col-span-5',
        art: 'from-violet-300 to-fuchsia-500',
    },
    {
        eyebrow: 'Trending this week',
        title: 'The most-loved list.',
        copy: 'What Velora shoppers are saving, sharing, and buying now.',
        icon: Heart,
        className: 'bg-[#ffe9df] text-rose-950 lg:col-span-5',
        art: 'from-orange-300 to-rose-500',
    },
    {
        eyebrow: 'Fresh drop',
        title: 'New now, gone soon.',
        copy: 'Limited launches and seasonal colour stories in one place.',
        icon: TimerReset,
        className: 'bg-[#e3efff] text-blue-950 lg:col-span-7',
        art: 'from-blue-300 to-indigo-500',
    },
];

export default function DiscoverySection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionTitle
                eyebrow="Shop by mood"
                title="A better way to discover"
                description="Curated edits for what you need, love, and want next."
            />
            <div className="mt-8 grid gap-4 lg:grid-cols-12">
                {edits.map((edit, index) => {
                    const Icon = edit.icon;

                    return (
                        <Link
                            key={edit.title}
                            href={catalog.url({ query: { edit: index + 1 } })}
                            prefetch
                            className={`group relative min-h-64 overflow-hidden rounded-[2rem] p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none sm:p-8 ${edit.className}`}
                        >
                            <div className="relative z-10 max-w-sm">
                                <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.18em] uppercase opacity-60">
                                    <Icon className="size-3.5" /> {edit.eyebrow}
                                </span>
                                <h3 className="mt-4 max-w-xs text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                                    {edit.title}
                                </h3>
                                <p className="mt-3 max-w-xs text-sm leading-6 opacity-70">
                                    {edit.copy}
                                </p>
                                <span className="mt-6 inline-flex items-center gap-2 text-xs font-black">
                                    Explore the edit{' '}
                                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </div>
                            <div
                                className={`absolute -right-12 -bottom-14 size-52 rounded-full bg-gradient-to-br opacity-80 transition duration-500 group-hover:scale-110 sm:size-60 ${edit.art}`}
                            >
                                <span className="absolute inset-8 rounded-full border border-white/40" />
                                <span className="absolute inset-16 rounded-full border border-white/40" />
                            </div>
                            <span className="absolute top-5 right-6 text-6xl font-black opacity-[0.06]">
                                0{index + 1}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
