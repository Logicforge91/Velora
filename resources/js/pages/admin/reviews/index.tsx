import { router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    MessageSquareText,
    Search,
    Star,
    Timer,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import reviewsRoutes from '@/routes/admin/reviews';
import type { Counts, Paginated, Review } from '@/types/admin';
export default function ReviewsIndex({
    reviews,
    counts,
}: {
    reviews: Paginated<Review>;
    counts: Counts;
}) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const [rating, setRating] = useState(params.get('rating') ?? '');
    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            reviewsRoutes.index.url(),
            { search, status, rating },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Review Moderation" breadcrumb="Trust / Reviews">
            <div>
                <h2 className="text-xl font-black">Customer review queue</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Protect marketplace quality while preserving authentic
                    feedback.
                </p>
            </div>
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'All reviews',
                            value: counts.total,
                            icon: MessageSquareText,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Awaiting review',
                            value: counts.pending,
                            icon: Timer,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'Published',
                            value: counts.approved,
                            icon: CheckCircle2,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                        {
                            label: 'Average rating',
                            value: Number(counts.average_rating).toFixed(1),
                            icon: Star,
                            tone: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10',
                        },
                    ]}
                />
            </div>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[1fr_12rem_10rem_auto] dark:border-white/10"
                >
                    <label className="relative">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Product or review content"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All states</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All ratings</option>
                        {[5, 4, 3, 2, 1].map((value) => (
                            <option key={value} value={value}>
                                {value} stars
                            </option>
                        ))}
                    </select>
                    <button className="rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>
                <div className="grid divide-y divide-slate-100 dark:divide-white/5">
                    {reviews.data.map((review) => (
                        <ReviewRow key={review.id} review={review} />
                    ))}
                    {reviews.data.length === 0 && (
                        <div className="p-14 text-center text-sm text-slate-500">
                            No reviews match these filters.
                        </div>
                    )}
                </div>
                <Pagination links={reviews.links} />
            </section>
        </AdminLayout>
    );
}
function ReviewRow({ review }: { review: Review }) {
    const form = useForm({ status: review.status });
    const moderate = (status: Review['status']) => {
        form.setData('status', status);
        form.transform(() => ({ status }));
        form.put(reviewsRoutes.update.url(review.id), { preserveScroll: true });
    };

    return (
        <article className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_13rem]">
            <div>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="flex text-amber-500">
                        {Array.from({ length: 5 }, (_, i) => (
                            <Star
                                key={i}
                                className={`size-4 ${i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`}
                            />
                        ))}
                    </span>
                    <strong>{review.title ?? review.product.name}</strong>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold capitalize dark:bg-white/10">
                        {review.status}
                    </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {review.body}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                    {review.user.name} · {review.user.email} ·{' '}
                    {review.product.name} ({review.product.sku})
                </p>
            </div>
            <div className="flex items-center justify-end gap-2">
                <button
                    onClick={() => moderate('approved')}
                    disabled={form.processing}
                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                >
                    <CheckCircle2 className="size-4" />
                    Approve
                </button>
                <button
                    onClick={() => moderate('rejected')}
                    disabled={form.processing}
                    className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                >
                    <XCircle className="size-4" />
                    Reject
                </button>
            </div>
        </article>
    );
}
