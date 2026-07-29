import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Heart,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { dashboard, login } from '@/routes';
import { catalog } from '@/routes/storefront';

const slides = [
    {
        eyebrow: 'The summer edit',
        count: '47 new arrivals',
        lineOne: 'Find less.',
        lineTwo: 'Love more.',
        copy: 'A sharper edit of useful, beautiful things. Curated for real life, delivered across India.',
        cta: 'Shop new arrivals',
        query: { sort: 'new' },
        position: 'center',
        cardTitle: 'Colour that moves with you',
        cardCopy: 'Audio, travel and everyday tech from ₹899',
    },
    {
        eyebrow: 'Home, considered',
        count: 'New season essentials',
        lineOne: 'Live well.',
        lineTwo: 'Spend wisely.',
        copy: 'Easy upgrades and beautiful essentials that make every corner work harder.',
        cta: 'Refresh your space',
        query: { category: 'Home' },
        position: 'right',
        cardTitle: 'Small changes, calmer spaces',
        cardCopy: 'Everyday home essentials from ₹699',
    },
    {
        eyebrow: 'Future favourites',
        count: 'Tech worth knowing',
        lineOne: 'More useful.',
        lineTwo: 'Less noise.',
        copy: 'Thoughtful technology chosen for better work, richer sound, and simpler days.',
        cta: 'Explore smart tech',
        query: { category: 'Electronics' },
        position: 'left',
        cardTitle: 'Everyday tech, thoughtfully picked',
        cardCopy: 'Verified devices with dependable support',
    },
] as const;

export default function HeroSection({
    isAuthenticated,
}: {
    isAuthenticated: boolean;
}) {
    const [activeSlide, setActiveSlide] = useState(0);
    const slide = slides[activeSlide];
    const showSlide = (offset: number) => {
        setActiveSlide(
            (current) => (current + offset + slides.length) % slides.length,
        );
    };

    return (
        <section className="relative overflow-hidden bg-[#f2eee7] dark:bg-slate-950">
            <div className="relative mx-auto grid max-w-[90rem] gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-5 lg:px-8 lg:py-6">
                <div className="flex flex-col justify-center py-6 lg:px-8 lg:py-16 xl:px-14">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-950/10 bg-white/60 px-3 py-1.5 text-[11px] font-black tracking-[0.16em] text-slate-700 uppercase dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                            <Sparkles className="size-3.5 text-orange-500" />
                            {slide.eyebrow}
                        </span>
                        <span className="hidden text-xs font-bold text-slate-500 sm:block dark:text-slate-400">
                            {slide.count}
                        </span>
                    </div>
                    <h1 className="mt-6 max-w-3xl text-[clamp(3.5rem,7vw,7rem)] leading-[0.83] font-black tracking-[-0.075em] text-slate-950 dark:text-white">
                        {slide.lineOne}
                        <span className="mt-3 block font-serif font-normal tracking-[-0.05em] text-orange-600 italic dark:text-orange-400">
                            {slide.lineTwo}
                        </span>
                    </h1>
                    <p className="mt-7 max-w-lg text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
                        {slide.copy}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={catalog.url({ query: slide.query })}
                            prefetch
                            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-slate-950 px-6 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600 dark:bg-orange-500"
                        >
                            {slide.cta}
                            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href={
                                isAuthenticated ? dashboard.url() : login.url()
                            }
                            className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-950/15 bg-white/50 px-6 text-sm font-black text-slate-800 transition hover:border-orange-500 hover:text-orange-600 dark:border-white/15 dark:bg-white/5 dark:text-white"
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
                        alt="A curated edit of colourful lifestyle products"
                        className="absolute inset-0 size-full object-cover transition duration-500"
                        style={{ objectPosition: slide.position }}
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                    <div className="absolute top-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-950 shadow-lg backdrop-blur">
                        Curated, not crowded
                    </div>
                    <button
                        type="button"
                        className="absolute top-5 right-5 grid size-10 place-items-center rounded-full bg-white/90 text-slate-950 shadow-lg transition hover:text-rose-500"
                        aria-label="Save this collection"
                    >
                        <Heart className="size-4" />
                    </button>
                    <div className="absolute top-1/2 right-4 left-4 flex -translate-y-1/2 justify-between">
                        <SliderButton
                            label="Previous slide"
                            onClick={() => showSlide(-1)}
                        >
                            <ChevronLeft className="size-5" />
                        </SliderButton>
                        <SliderButton
                            label="Next slide"
                            onClick={() => showSlide(1)}
                        >
                            <ChevronRight className="size-5" />
                        </SliderButton>
                    </div>
                    <div className="absolute right-5 bottom-5 left-5 rounded-[1.4rem] border border-white/25 bg-slate-950/70 p-5 text-white shadow-2xl backdrop-blur-xl">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black tracking-[0.18em] text-orange-300 uppercase">
                                    Trending now
                                </p>
                                <p className="mt-1 text-lg font-black sm:text-xl">
                                    {slide.cardTitle}
                                </p>
                                <p className="mt-1 text-xs text-white/65">
                                    {slide.cardCopy}
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-black">
                                4.9{' '}
                                <Star className="size-3 fill-orange-400 text-orange-400" />
                            </span>
                        </div>
                        <div className="mt-4 flex justify-center gap-2">
                            {slides.map((item, index) => (
                                <button
                                    key={item.eyebrow}
                                    type="button"
                                    onClick={() => setActiveSlide(index)}
                                    className={`h-1.5 rounded-full transition-all ${index === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                                    aria-label={`Show slide ${index + 1}`}
                                    aria-current={
                                        index === activeSlide
                                            ? 'true'
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SliderButton({
    label,
    onClick,
    children,
}: {
    label: string;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="grid size-10 place-items-center rounded-full bg-white/85 text-slate-950 shadow-lg backdrop-blur transition hover:scale-105"
        >
            {children}
        </button>
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
