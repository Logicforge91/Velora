import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import StorefrontLayout from '@/layouts/storefront-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { edit as editProfile } from '@/routes/customer/profile';
import { edit as editSecurity } from '@/routes/security';
import type { User } from '@/types';

const accountNavigation = [
    {
        title: 'Profile',
        description: 'Personal details',
        href: editProfile(),
        icon: UserRound,
    },
    {
        title: 'Security',
        description: 'Password and access',
        href: editSecurity(),
        icon: LockKeyhole,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props;
    const user = auth.user as User;
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <Link
                    href={dashboard()}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-600 dark:text-slate-400"
                >
                    <ArrowLeft className="size-4" /> Back to my account
                </Link>

                <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-7 text-white sm:px-8 sm:py-9">
                    <div className="absolute -top-24 right-0 size-64 rounded-full bg-orange-500/25 blur-3xl" />
                    <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.15em] text-orange-300 uppercase">
                                <ShieldCheck className="size-4" /> Customer
                                account
                            </span>
                            <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                                Account settings
                            </h1>
                            <p className="mt-2 text-sm text-slate-300">
                                Manage your profile, privacy and shopping
                                preferences.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur">
                            <p className="text-sm font-black">{user.name}</p>
                            <p className="mt-0.5 text-xs text-slate-400">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <aside className="h-fit rounded-[1.75rem] border border-slate-200/70 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
                        <p className="px-3 py-2 text-xs font-black tracking-[0.14em] text-slate-400 uppercase">
                            Settings menu
                        </p>
                        <nav
                            className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible"
                            aria-label="Account settings"
                        >
                            {accountNavigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = isCurrentOrParentUrl(
                                    item.href,
                                );

                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className={cn(
                                            'group flex min-w-44 items-center gap-3 rounded-2xl px-3 py-3 transition lg:min-w-0',
                                            isActive
                                                ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-orange-500'
                                                : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700 dark:text-slate-300 dark:hover:bg-orange-500/10 dark:hover:text-orange-300',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'grid size-10 shrink-0 place-items-center rounded-xl transition',
                                                isActive
                                                    ? 'bg-white/10 text-orange-300 dark:text-white'
                                                    : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-orange-600 dark:bg-white/5',
                                            )}
                                        >
                                            <Icon className="size-4.5" />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-sm font-black">
                                                {item.title}
                                            </span>
                                            <span
                                                className={cn(
                                                    'mt-0.5 block text-xs',
                                                    isActive
                                                        ? 'text-slate-300 dark:text-orange-100'
                                                        : 'text-slate-400',
                                                )}
                                            >
                                                {item.description}
                                            </span>
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <main className="min-w-0 rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-sm sm:p-8 dark:border-white/10 dark:bg-white/[0.035] [&_input]:h-12 [&_input]:rounded-xl">
                        <div className="max-w-2xl space-y-12">{children}</div>
                    </main>
                </div>
            </div>
        </StorefrontLayout>
    );
}
