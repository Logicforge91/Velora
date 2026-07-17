import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Headphones,
    PackageCheck,
    ShieldCheck,
    Truck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { dashboard, login } from '@/routes';

export default function MembershipSection({
    isAuthenticated,
}: {
    isAuthenticated: boolean;
}) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid overflow-hidden rounded-[2rem] bg-slate-950 text-white lg:grid-cols-2">
                <div className="relative p-8 sm:p-12">
                    <div className="absolute top-0 right-0 size-56 rounded-full bg-orange-500/20 blur-3xl" />
                    <span className="relative text-xs font-black tracking-[0.2em] text-orange-300 uppercase">
                        Velora Plus
                    </span>
                    <h2 className="relative mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                        More value in every order.
                    </h2>
                    <p className="relative mt-4 max-w-md text-sm leading-6 text-slate-300">
                        Unlock priority delivery, members-only offers, and early
                        access to our biggest sale events.
                    </p>
                    <Link
                        href={isAuthenticated ? dashboard.url() : login.url()}
                        className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950"
                    >
                        {isAuthenticated ? 'View your account' : 'Join Velora'}{' '}
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-px bg-white/10">
                    <Benefit
                        icon={Truck}
                        title="Priority delivery"
                        copy="Faster dispatch on eligible orders"
                    />
                    <Benefit
                        icon={ShieldCheck}
                        title="Protected payments"
                        copy="Secure checkout every time"
                    />
                    <Benefit
                        icon={PackageCheck}
                        title="Easy returns"
                        copy="Clear, trackable return journeys"
                    />
                    <Benefit
                        icon={Headphones}
                        title="Helpful support"
                        copy="Assistance whenever you need it"
                    />
                </div>
            </div>
        </section>
    );
}

function Benefit({
    icon: Icon,
    title,
    copy,
}: {
    icon: LucideIcon;
    title: string;
    copy: string;
}) {
    return (
        <div className="bg-slate-950 p-6 sm:p-8">
            <Icon className="size-6 text-orange-400" />
            <h3 className="mt-4 text-sm font-black text-white">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-400">{copy}</p>
        </div>
    );
}
