import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeCheck,
    CalendarDays,
    Check,
    ClipboardList,
    LockKeyhole,
    Mail,
    Save,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import StorefrontLayout from '@/layouts/storefront-layout';
import { dashboard } from '@/routes';
import { edit, update } from '@/routes/customer/profile';
import { edit as security } from '@/routes/security';
import type { User } from '@/types';

export default function CustomerProfile({ joinedAt }: { joinedAt: string }) {
    const { auth } = usePage().props;
    const user = auth.user as User;
    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <StorefrontLayout>
            <Head title="My profile" />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <Link
                    href={dashboard()}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-600 dark:text-slate-400"
                >
                    <ArrowLeft className="size-4" /> Back to my account
                </Link>

                <section className="relative mt-6 overflow-hidden rounded-[2.25rem] bg-slate-950 px-6 py-8 text-white sm:px-9">
                    <div className="absolute -top-24 right-0 size-72 rounded-full bg-orange-500/30 blur-3xl" />
                    <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.16em] text-orange-300 uppercase">
                                <ShieldCheck className="size-4" /> Customer
                                profile
                            </span>
                            <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                                Your account, your way.
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                                Keep your details current for order updates and
                                a smoother checkout experience.
                            </p>
                        </div>
                        <span className="grid size-20 shrink-0 place-items-center rounded-[1.5rem] bg-white/10 text-2xl font-black ring-1 ring-white/15 backdrop-blur">
                            {initials}
                        </span>
                    </div>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <aside className="h-fit rounded-[1.75rem] border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
                        <p className="px-2 text-xs font-black tracking-[0.14em] text-slate-400 uppercase">
                            Account menu
                        </p>
                        <nav className="mt-3 grid gap-1">
                            <AccountLink
                                href={dashboard.url()}
                                icon={ClipboardList}
                                label="My orders"
                            />
                            <AccountLink
                                href={edit.url()}
                                icon={UserRound}
                                label="My profile"
                                active
                            />
                            <AccountLink
                                href={security.url()}
                                icon={LockKeyhole}
                                label="Login & security"
                            />
                        </nav>

                        <div className="mt-5 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
                            <span className="inline-flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-300">
                                <BadgeCheck className="size-4" /> Active
                                customer
                            </span>
                            <p className="mt-2 text-xs leading-5 text-emerald-700/70 dark:text-emerald-300/70">
                                Member since{' '}
                                {new Date(joinedAt).toLocaleDateString(
                                    'en-IN',
                                    {
                                        month: 'long',
                                        year: 'numeric',
                                    },
                                )}
                            </p>
                        </div>
                    </aside>

                    <main className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-sm sm:p-8 dark:border-white/10 dark:bg-white/[0.035]">
                        <div>
                            <p className="text-xs font-black tracking-[0.15em] text-orange-600 uppercase">
                                Personal information
                            </p>
                            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                                Profile details
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                We use these details for delivery communication
                                and account notifications.
                            </p>
                        </div>

                        <Form
                            {...update.form()}
                            options={{ preserveScroll: true }}
                            className="mt-7 grid gap-6"
                        >
                            {({ processing, errors, recentlySuccessful }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="name"
                                            className="font-bold"
                                        >
                                            Full name
                                        </Label>
                                        <div className="relative">
                                            <UserRound className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={user.name}
                                                required
                                                autoComplete="name"
                                                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 dark:border-white/10 dark:bg-white/5"
                                            />
                                        </div>
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="email"
                                            className="font-bold"
                                        >
                                            Email address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                defaultValue={user.email}
                                                required
                                                autoComplete="email"
                                                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 dark:border-white/10 dark:bg-white/5"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <InfoCard
                                            icon={CalendarDays}
                                            label="Member since"
                                            value={new Date(
                                                joinedAt,
                                            ).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        />
                                        <InfoCard
                                            icon={ShieldCheck}
                                            label="Account type"
                                            value="Velora customer"
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6 dark:border-white/10">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            data-test="customer-profile-save"
                                            className="h-12 rounded-xl bg-slate-950 px-6 font-black text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600"
                                        >
                                            {processing ? (
                                                <Spinner />
                                            ) : (
                                                <Save className="size-4" />
                                            )}
                                            Save changes
                                        </Button>
                                        {recentlySuccessful && (
                                            <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600">
                                                <Check className="size-4" />
                                                Profile updated
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </Form>
                    </main>
                </div>
            </div>
        </StorefrontLayout>
    );
}

function AccountLink({
    href,
    icon: Icon,
    label,
    active = false,
}: {
    href: string;
    icon: typeof UserRound;
    label: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${active ? 'bg-slate-950 text-white dark:bg-orange-500' : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700 dark:text-slate-300 dark:hover:bg-orange-500/10'}`}
        >
            <Icon className="size-4" /> {label}
        </Link>
    );
}

function InfoCard({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof CalendarDays;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-white/5 dark:bg-white/[0.025]">
            <Icon className="size-4 text-orange-600" />
            <p className="mt-3 text-xs font-bold text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-black">{value}</p>
        </div>
    );
}
