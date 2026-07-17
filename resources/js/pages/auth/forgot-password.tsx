import { Form, Head } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Mail, Send } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            <div className="flex flex-col gap-6">
                {status && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {status}
                    </div>
                )}

                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
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
                                        required
                                        autoFocus
                                        placeholder="you@example.com"
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 dark:border-white/10 dark:bg-white/5"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-6 h-12 w-full rounded-xl bg-slate-950 font-black text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && (
                                    <LoaderCircle className="size-4 animate-spin" />
                                )}
                                Send secure reset link
                                {!processing && <Send className="size-4" />}
                            </Button>
                        </>
                    )}
                </Form>

                <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                    <TextLink
                        href={login()}
                        className="inline-flex items-center gap-2 font-bold text-orange-600 no-underline"
                    >
                        <ArrowLeft className="size-4" /> Return to sign in
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Reset your password',
    description:
        'Enter your account email and we will send you a secure recovery link.',
};
