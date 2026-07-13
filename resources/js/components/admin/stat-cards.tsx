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
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                    <div
                        className={`grid size-10 place-items-center rounded-xl ${tone}`}
                    >
                        <Icon className="size-5" />
                    </div>
                    <p className="mt-4 text-2xl font-black">{value}</p>
                    <p className="mt-1 text-sm font-semibold">{label}</p>
                    {note && (
                        <p className="mt-1 text-xs text-slate-500">{note}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
