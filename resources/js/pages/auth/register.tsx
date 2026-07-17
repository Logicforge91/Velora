import { Form, Head, Link } from '@inertiajs/react';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register({ passwordRules }: { passwordRules: string }) {
    return (
        <>
            <Head title="Create account" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="font-bold">
                                Full name
                            </Label>
                            <div className="relative">
                                <UserRound className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    placeholder="Your full name"
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 dark:border-white/10 dark:bg-white/5"
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

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
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 dark:border-white/10 dark:bg-white/5"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="font-bold">
                                    Password
                                </Label>
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400" />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        autoComplete="new-password"
                                        placeholder="New password"
                                        passwordrules={passwordRules}
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 dark:border-white/10 dark:bg-white/5"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="font-bold"
                                >
                                    Confirm
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Repeat password"
                                    passwordrules={passwordRules}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-white/5"
                                />
                            </div>
                        </div>

                        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                            By creating an account, you agree to Velora's terms
                            and acknowledge the privacy policy.
                        </p>

                        <Button
                            type="submit"
                            disabled={processing}
                            data-test="register-button"
                            className="h-12 w-full rounded-xl bg-slate-950 font-black text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                            {processing && <Spinner />}
                            Create my account
                            {!processing && <ArrowRight className="size-4" />}
                        </Button>
                    </>
                )}
            </Form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link
                    href={login()}
                    className="font-black text-orange-600 hover:text-orange-700"
                >
                    Sign in
                </Link>
            </p>
        </>
    );
}

Register.layout = {
    title: 'Create your account',
    description:
        'Join Velora for faster checkout, saved favourites and tailored deals.',
};
