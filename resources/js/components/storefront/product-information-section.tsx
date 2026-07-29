import {
    BadgeCheck,
    ChevronDown,
    CircleAlert,
    Flag,
    HelpCircle,
    MessageCircleQuestion,
    ShieldCheck,
    Star,
    Store,
} from 'lucide-react';
import { useState } from 'react';
import type { StorefrontProduct } from '@/components/storefront/catalog';

const questions = [
    {
        question: 'Is this an original product?',
        answer: 'Yes. Every item is sourced from a verified seller and includes an authenticity guarantee.',
    },
    {
        question: 'Does the warranty cover manufacturing defects?',
        answer: 'Yes, the standard manufacturer warranty covers eligible manufacturing defects for one year.',
    },
    {
        question: 'Can I return it if the selected variant does not fit?',
        answer: 'Eligible unused products can be returned within seven days in their original packaging.',
    },
];

export default function ProductInformationSection({
    product,
}: {
    product: StorefrontProduct;
}) {
    const [reported, setReported] = useState(false);
    const [question, setQuestion] = useState('');
    const [submittedQuestion, setSubmittedQuestion] = useState('');

    const specifications = [
        ['Brand', product.brand],
        ['Category', product.subcategory],
        ['Material', product.material],
        ['Available colours', product.colors.join(', ')],
        ['Available sizes', product.sizes.join(', ')],
        ['SKU', `VEL-${product.id.toString().padStart(5, '0')}`],
        ['Country of origin', 'India'],
        ['Package contents', '1 product, documentation, protective packaging'],
    ];

    return (
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="grid gap-6">
                <article className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-white/[0.035]">
                    <p className="text-[11px] font-black tracking-[0.18em] text-orange-500 uppercase">
                        Product information
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">
                        Built for better everyday use.
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {product.name} combines dependable performance with
                        thoughtful details and durable materials. It is selected
                        by Velora for practical value, verified quality, and a
                        straightforward ownership experience.
                    </p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        {[
                            'Quality-checked before dispatch',
                            'Secure, recyclable packaging',
                            'Clear setup and care instructions',
                            'Responsive after-sales support',
                        ].map((highlight) => (
                            <div
                                key={highlight}
                                className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm font-bold dark:bg-white/5"
                            >
                                <BadgeCheck className="size-5 text-emerald-500" />
                                {highlight}
                            </div>
                        ))}
                    </div>
                </article>

                <article className="rounded-[2rem] border border-slate-200 p-6 sm:p-8 dark:border-white/10">
                    <h2 className="text-2xl font-black">Specifications</h2>
                    <dl className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                        {specifications.map(([label, value], index) => (
                            <div
                                key={label}
                                className={`grid gap-1 px-4 py-3 text-sm sm:grid-cols-[180px_1fr] ${index % 2 === 0 ? 'bg-slate-50 dark:bg-white/5' : ''}`}
                            >
                                <dt className="font-bold text-slate-500">
                                    {label}
                                </dt>
                                <dd className="font-semibold">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </article>

                <article className="rounded-[2rem] border border-slate-200 p-6 sm:p-8 dark:border-white/10">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-black tracking-wider text-orange-500 uppercase">
                                Customer help
                            </p>
                            <h2 className="mt-2 text-2xl font-black">
                                Questions & answers
                            </h2>
                        </div>
                        <MessageCircleQuestion className="size-7 text-orange-500" />
                    </div>
                    <div className="mt-6 divide-y divide-slate-200 dark:divide-white/10">
                        {questions.map((item) => (
                            <details key={item.question} className="group py-4">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black">
                                    {item.question}
                                    <ChevronDown className="size-4 transition group-open:rotate-180" />
                                </summary>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                    {submittedQuestion ? (
                        <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10">
                            Your question has been submitted: “
                            {submittedQuestion}”
                        </p>
                    ) : (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();

                                if (question.trim()) {
                                    setSubmittedQuestion(question.trim());
                                    setQuestion('');
                                }
                            }}
                            className="mt-5 flex gap-2"
                        >
                            <input
                                value={question}
                                onChange={(event) =>
                                    setQuestion(event.target.value)
                                }
                                placeholder="Ask a question about this product"
                                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-slate-900"
                            />
                            <button className="rounded-xl bg-slate-950 px-5 text-xs font-black text-white dark:bg-orange-500">
                                Ask
                            </button>
                        </form>
                    )}
                </article>
            </div>

            <aside className="grid content-start gap-5">
                <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
                    <Store className="size-7 text-orange-400" />
                    <p className="mt-5 text-[10px] font-black tracking-wider text-slate-400 uppercase">
                        Sold by
                    </p>
                    <h2 className="mt-1 text-xl font-black">
                        {product.seller}
                    </h2>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 font-black">
                            4.8 <Star className="size-3 fill-current" />
                        </span>
                        <span className="text-slate-400">
                            12.4k seller ratings
                        </span>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 text-center">
                        <Metric value="98%" label="on-time dispatch" />
                        <Metric value="5 yrs" label="on Velora" />
                    </div>
                </div>
                <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
                    <ShieldCheck className="size-7" />
                    <h2 className="mt-4 text-lg font-black">100% authentic</h2>
                    <p className="mt-2 text-sm leading-6 opacity-75">
                        Protected by Velora’s authenticity promise. Verified
                        seller, traceable inventory, and secure fulfilment.
                    </p>
                </div>
                <div className="rounded-[2rem] border border-slate-200 p-6 dark:border-white/10">
                    <CircleAlert className="size-6 text-orange-500" />
                    <h2 className="mt-4 font-black">Something not right?</h2>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        Help us keep the marketplace safe and accurate.
                    </p>
                    <button
                        type="button"
                        onClick={() => setReported(true)}
                        className="mt-4 inline-flex items-center gap-2 text-xs font-black text-rose-600"
                    >
                        <Flag className="size-4" />
                        {reported ? 'Report received' : 'Report this product'}
                    </button>
                </div>
                <div className="rounded-[2rem] border border-slate-200 p-6 dark:border-white/10">
                    <HelpCircle className="size-6 text-violet-500" />
                    <h2 className="mt-4 font-black">Need buying help?</h2>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        Chat with a product specialist for variant, delivery, or
                        warranty guidance.
                    </p>
                    <button
                        type="button"
                        className="mt-4 text-xs font-black text-orange-600"
                    >
                        Contact product support
                    </button>
                </div>
            </aside>
        </section>
    );
}

function Metric({ value, label }: { value: string; label: string }) {
    return (
        <div>
            <p className="text-lg font-black">{value}</p>
            <p className="mt-1 text-[9px] font-bold tracking-wide text-slate-500 uppercase">
                {label}
            </p>
        </div>
    );
}
