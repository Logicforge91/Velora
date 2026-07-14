import type { LucideIcon } from 'lucide-react';

export type StatCard = {
    label: string;
    value: string | number;
    note?: string;
    icon: LucideIcon;
    tone: string;
};

export default function StatCards({ cards }: { cards: StatCard[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ label, value, note, icon: Icon, tone }) => (
                <div
                    key={label}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-slate-900/5 dark:border-white/8 dark:bg-white/[0.04] dark:hover:border-orange-500/20"
                >
                    <span className="absolute -top-10 -right-10 size-24 rounded-full bg-orange-500/0 blur-2xl transition group-hover:bg-orange-500/10" />
                    <div
                        className={`relative grid size-10 place-items-center rounded-xl ring-1 ring-black/[0.03] ${tone}`}
                    >
                        <Icon className="size-5" />
                    </div>
                    <p className="relative mt-4 text-2xl font-black tracking-tight">
                        {value}
                    </p>
                    <p className="relative mt-1 text-sm font-semibold">
                        {label}
                    </p>
                    {note && (
                        <p className="relative mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {note}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
