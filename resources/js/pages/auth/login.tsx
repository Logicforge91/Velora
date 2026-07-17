import { Form, Head, Link } from '@inertiajs/react';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TeamInvitationAlert from '@/components/team-invitation-alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import type { TeamInvitationContext } from '@/types';

type Props = {
    status?: string;
    canResetPassword: boolean;
    teamInvitation?: TeamInvitationContext | null;
};

export default function Login({
    status,
    canResetPassword,
    teamInvitation,
}: Props) {
    return (
        <>
            <Head title="Sign in" />

            <div className="flex flex-col gap-6">
                {teamInvitation && (
                    <TeamInvitationAlert
                        invitation={teamInvitation}
                        action="Log in"
                    />
                )}

                {status && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {status}
                    </div>
                )}

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="hidden"
                                name="portal"
                                value="customer"
                            />

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-bold">
                                    Email address
                                </Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 dark:border-white/10 dark:bg-white/5"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center gap-3">
                                    <Label
                                        htmlFor="password"
                                        className="font-bold"
                                    >
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <Link
                                            href={request()}
                                            className="ml-auto text-sm font-bold text-orange-600 hover:text-orange-700"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400" />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 dark:border-white/10 dark:bg-white/5"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm text-slate-600 dark:text-slate-300"
                                >
                                    Keep me signed in
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                className="h-12 w-full rounded-xl bg-slate-950 font-black text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600"
                            >
                                {processing && <Spinner />}
                                Sign in securely
                                {!processing && (
                                    <ArrowRight className="size-4" />
                                )}
                            </Button>
                        </>
                    )}
                </Form>

                <div className="relative flex items-center gap-4 py-1">
                    <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    <span className="text-xs font-bold text-slate-400 uppercase">
                        New to Velora?
                    </span>
                    <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                </div>

                <Link
                    href={register()}
                    className="grid h-12 place-items-center rounded-xl border border-slate-200 text-sm font-black transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 dark:border-white/10 dark:hover:bg-orange-500/10"
                >
                    Create a free account
                </Link>
            </div>
        </>
    );
}

Login.layout = {
    title: 'Welcome back',
    description:
        'Sign in to access your orders, saved items and personal offers.',
};
