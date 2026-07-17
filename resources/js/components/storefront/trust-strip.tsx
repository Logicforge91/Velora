import { Clock3, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const benefits = [
    {
        icon: Truck,
        title: 'Fast delivery',
        copy: 'Across thousands of pin codes',
    },
    {
        icon: ShieldCheck,
        title: 'Secure payments',
        copy: 'Protected checkout experience',
    },
    {
        icon: PackageCheck,
        title: 'Easy returns',
        copy: 'Simple and transparent process',
    },
    {
        icon: Clock3,
        title: 'Always available',
        copy: 'Shop whenever it suits you',
    },
];

export default function TrustStrip() {
    return (
        <section className="border-t border-slate-200 bg-white py-12 dark:border-white/10 dark:bg-white/[0.025]">
            <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                {benefits.map((benefit) => (
                    <TrustItem key={benefit.title} {...benefit} />
                ))}
            </div>
        </section>
    );
}

function TrustItem({
    icon: Icon,
    title,
    copy,
}: {
    icon: LucideIcon;
    title: string;
    copy: string;
}) {
    return (
        <div className="flex items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                <Icon className="size-5" />
            </span>
            <div>
                <p className="text-sm font-black">{title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{copy}</p>
            </div>
        </div>
    );
}
