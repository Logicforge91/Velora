import {
    BadgeCheck,
    Camera,
    ChevronDown,
    MessageSquareText,
    Star,
    ThumbsUp,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { StorefrontProduct } from '@/components/storefront/catalog';

const ratingDistribution = [
    { rating: 5, percentage: 76, count: 948 },
    { rating: 4, percentage: 16, count: 202 },
    { rating: 3, percentage: 5, count: 61 },
    { rating: 2, percentage: 2, count: 24 },
    { rating: 1, percentage: 1, count: 13 },
];

const reviews = [
    {
        id: 1,
        name: 'Aarav Mehta',
        initials: 'AM',
        rating: 5,
        title: 'Exactly what I was hoping for',
        copy: 'The quality feels excellent and setup was effortless. It arrived earlier than expected and the packaging was thoughtful too.',
        date: '12 July 2026',
        helpful: 184,
        photos: 2,
        tone: 'bg-blue-100 text-blue-700',
    },
    {
        id: 2,
        name: 'Diya Nair',
        initials: 'DN',
        rating: 5,
        title: 'A genuinely great everyday upgrade',
        copy: 'I have used it every day for two weeks and it has been completely reliable. The little design details make a real difference.',
        date: '8 July 2026',
        helpful: 96,
        photos: 1,
        tone: 'bg-rose-100 text-rose-700',
    },
    {
        id: 3,
        name: 'Kabir Shah',
        initials: 'KS',
        rating: 4,
        title: 'Very good value for the price',
        copy: 'Performance and finish are both impressive. Delivery tracking was clear and the product matched the description perfectly.',
        date: '29 June 2026',
        helpful: 63,
        photos: 0,
        tone: 'bg-emerald-100 text-emerald-700',
    },
    {
        id: 4,
        name: 'Ishita Rao',
        initials: 'IR',
        rating: 5,
        title: 'Would happily recommend it',
        copy: 'This was my first Velora order and the entire experience felt premium. I would definitely purchase this again as a gift.',
        date: '18 June 2026',
        helpful: 41,
        photos: 0,
        tone: 'bg-violet-100 text-violet-700',
    },
];

export default function ProductReviewSection({
    product,
}: {
    product: StorefrontProduct;
}) {
    const [filter, setFilter] = useState('All reviews');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const ProductIcon = product.icon;
    const visibleReviews =
        filter === 'With photos'
            ? reviews.filter((review) => review.photos > 0)
            : filter === '5 star'
              ? reviews.filter((review) => review.rating === 5)
              : reviews;

    return (
        <section
            id="customer-reviews"
            className="scroll-mt-24 rounded-[2.5rem] border border-slate-200 bg-white p-6 sm:p-9 lg:scroll-mt-36 dark:border-white/10 dark:bg-white/[0.035]"
        >
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[11px] font-black tracking-[0.2em] text-orange-500 uppercase">
                        Real experiences
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                        Customer reviews
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        What verified shoppers think about {product.name}.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowReviewForm((visible) => !visible)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-500 dark:bg-orange-500"
                >
                    <MessageSquareText className="size-4" /> Write a review
                </button>
            </div>

            {showReviewForm && (
                <div className="mt-7 rounded-[2rem] border border-orange-200 bg-orange-50 p-5 sm:p-7 dark:border-orange-500/20 dark:bg-orange-500/5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="font-black">
                                Share your experience
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Your feedback helps other Velora shoppers.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            aria-label="Close review form"
                            className="grid size-8 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                    <div className="mt-5 flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                aria-label={`Rate ${star} stars`}
                            >
                                <Star className="size-7 fill-orange-400 text-orange-400 transition hover:scale-110" />
                            </button>
                        ))}
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <input
                            placeholder="Review title"
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-slate-900"
                        />
                        <input
                            placeholder="Your name"
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-slate-900"
                        />
                        <textarea
                            placeholder="What did you like about this product?"
                            rows={4}
                            className="rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-orange-400 sm:col-span-2 dark:border-white/10 dark:bg-slate-900"
                        />
                    </div>
                    <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 text-xs font-black text-slate-500"
                        >
                            <Camera className="size-4" /> Add photos
                        </button>
                        <button
                            type="button"
                            className="rounded-full bg-slate-950 px-5 py-2.5 text-xs font-black text-white dark:bg-orange-500"
                        >
                            Submit review
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-8 grid gap-8 border-y border-slate-200 py-8 lg:grid-cols-[260px_1fr] dark:border-white/10">
                <div className="text-center lg:border-r lg:border-slate-200 lg:pr-8 dark:lg:border-white/10">
                    <div className="flex items-end justify-center gap-2">
                        <span className="text-6xl font-black tracking-[-0.06em]">
                            {product.rating}
                        </span>
                        <span className="pb-2 text-sm text-slate-400">/ 5</span>
                    </div>
                    <div className="mt-3 flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className="size-4 fill-orange-400 text-orange-400"
                            />
                        ))}
                    </div>
                    <p className="mt-3 text-xs font-bold text-slate-500">
                        Based on 1,248 verified ratings
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <BadgeCheck className="size-3.5" /> 96% recommend this
                    </span>
                </div>
                <div className="grid gap-3">
                    {ratingDistribution.map((item) => (
                        <div
                            key={item.rating}
                            className="grid grid-cols-[42px_1fr_40px] items-center gap-3 text-xs"
                        >
                            <span className="flex items-center gap-1 font-black">
                                {item.rating}
                                <Star className="size-3 fill-orange-400 text-orange-400" />
                            </span>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500"
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>
                            <span className="text-right text-slate-400">
                                {item.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                    {[
                        'All reviews',
                        'With photos',
                        '5 star',
                        'Most helpful',
                    ].map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setFilter(option)}
                            className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${filter === option ? 'bg-slate-950 text-white dark:bg-orange-500' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 text-xs font-black text-slate-500"
                >
                    Newest first <ChevronDown className="size-4" />
                </button>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-2">
                {visibleReviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        ProductIcon={ProductIcon}
                        productTone={product.tone}
                    />
                ))}
            </div>
            <button
                type="button"
                className="mx-auto mt-7 block rounded-full border border-slate-200 px-6 py-3 text-sm font-black transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10"
            >
                Load more reviews
            </button>
        </section>
    );
}

function ReviewCard({
    review,
    ProductIcon,
    productTone,
}: {
    review: (typeof reviews)[number];
    ProductIcon: StorefrontProduct['icon'];
    productTone: string;
}) {
    const [helpful, setHelpful] = useState(false);

    return (
        <article className="rounded-[1.75rem] border border-slate-200 p-5 sm:p-6 dark:border-white/10">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span
                        className={`grid size-10 place-items-center rounded-full text-xs font-black ${review.tone}`}
                    >
                        {review.initials}
                    </span>
                    <div>
                        <p className="text-sm font-black">{review.name}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <BadgeCheck className="size-3" /> Verified purchase
                        </p>
                    </div>
                </div>
                <span className="text-[11px] text-slate-400">
                    {review.date}
                </span>
            </div>
            <div className="mt-5 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`size-3.5 ${star <= review.rating ? 'fill-orange-400 text-orange-400' : 'text-slate-200 dark:text-slate-700'}`}
                    />
                ))}
            </div>
            <h3 className="mt-3 font-black">{review.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {review.copy}
            </p>
            {review.photos > 0 && (
                <div className="mt-4 flex gap-2">
                    {Array.from({ length: review.photos }, (_, index) => (
                        <span
                            key={index}
                            className={`grid size-16 place-items-center rounded-xl bg-gradient-to-br ${productTone}`}
                        >
                            <ProductIcon className="size-8" />
                        </span>
                    ))}
                </div>
            )}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-white/10">
                <span className="text-slate-400">Was this helpful?</span>
                <button
                    type="button"
                    onClick={() => setHelpful((value) => !value)}
                    className={`inline-flex items-center gap-1.5 font-black ${helpful ? 'text-orange-500' : 'text-slate-500'}`}
                >
                    <ThumbsUp
                        className={`size-3.5 ${helpful ? 'fill-current' : ''}`}
                    />{' '}
                    {review.helpful + (helpful ? 1 : 0)}
                </button>
            </div>
        </article>
    );
}
