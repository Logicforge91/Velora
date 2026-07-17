import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const loadingCards = Array.from({ length: 6 }, (_, index) => index);

export default function StorefrontPageLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const removeStartListener = router.on('start', () => {
            loadingTimer.current = setTimeout(() => setIsLoading(true), 120);
        });
        const removeFinishListener = router.on('finish', () => {
            if (loadingTimer.current) {
                clearTimeout(loadingTimer.current);
                loadingTimer.current = null;
            }

            setIsLoading(false);
        });

        return () => {
            removeStartListener();
            removeFinishListener();

            if (loadingTimer.current) {
                clearTimeout(loadingTimer.current);
            }
        };
    }, []);

    if (!isLoading) {
        return null;
    }

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Loading storefront page"
            className="fixed inset-x-0 top-[7.15rem] bottom-0 z-40 overflow-hidden bg-[#f8f8f6] lg:top-[9.55rem] dark:bg-slate-950"
        >
            <span className="sr-only">Loading the next page</span>
            <div className="h-1 w-full overflow-hidden bg-orange-100 dark:bg-orange-500/10">
                <div className="h-full w-1/3 animate-[pulse_0.8s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-orange-500 to-rose-500 motion-reduce:animate-none" />
            </div>
            <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 motion-reduce:animate-none sm:px-6 lg:px-8">
                <div className="h-3 w-24 rounded-full bg-orange-200/80 dark:bg-orange-500/20" />
                <div className="mt-4 h-10 w-full max-w-md rounded-2xl bg-slate-200 dark:bg-white/10" />
                <div className="mt-3 h-4 w-full max-w-xl rounded-full bg-slate-200/80 dark:bg-white/[0.07]" />

                <div className="mt-9 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="min-h-60 rounded-[2.25rem] bg-gradient-to-br from-slate-200 to-slate-100 sm:min-h-72 dark:from-white/10 dark:to-white/5" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 h-24 rounded-[1.75rem] bg-slate-200 dark:bg-white/10" />
                        <div className="h-36 rounded-[1.75rem] bg-orange-100 dark:bg-orange-500/10" />
                        <div className="h-36 rounded-[1.75rem] bg-violet-100 dark:bg-violet-500/10" />
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {loadingCards.map((card) => (
                        <div
                            key={card}
                            className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5"
                        >
                            <div className="aspect-square rounded-[1.15rem] bg-slate-100 dark:bg-white/[0.07]" />
                            <div className="mt-3 h-3 w-3/4 rounded-full bg-slate-200 dark:bg-white/10" />
                            <div className="mt-2 h-3 w-1/2 rounded-full bg-slate-100 dark:bg-white/[0.07]" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
