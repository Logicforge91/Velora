import { Form, Head } from '@inertiajs/react';
import { Check, LockKeyhole, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="font-bold">
                                Account email
                            </Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-100/80 pl-11 text-slate-500 dark:border-white/10 dark:bg-white/5"
                                    readOnly
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="font-bold">
                                New password
                            </Label>
                            <div className="relative">
                                <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400" />
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    autoFocus
                                    placeholder="Create a new password"
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
                                Confirm new password
                            </Label>
                            <div className="relative">
                                <Check className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400" />
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Repeat your new password"
                                    passwordrules={passwordRules}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 dark:border-white/10 dark:bg-white/5"
                                />
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            data-test="reset-password-button"
                            className="mt-1 h-12 w-full rounded-xl bg-slate-950 font-black text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                            {processing && <Spinner />}
                            Set new password
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Choose a new password',
    description:
        'Create a strong new password to secure your shopping account.',
};
