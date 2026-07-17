import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, LockKeyhole, ShieldCheck, ShoppingBag } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { home, login } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function AdminLogin({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Administrator sign in" />
            <div className="grid min-h-screen bg-slate-950 lg:grid-cols-[minmax(0,1.05fr)_minmax(30rem,0.95fr)]">
                <section className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgb(249_115_22/0.2),transparent_24rem),radial-gradient(circle_at_80%_80%,rgb(251_191_36/0.1),transparent_28rem)]" />
                    <Link
                        href={home.url()}
                        className="relative flex items-center gap-3 text-xl font-black"
                    >
                        <span className="grid size-11 place-items-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/25">
                            <ShoppingBag className="size-5" />
                        </span>
                        Velora Commerce
                    </Link>
                    <div className="relative max-w-xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs font-black tracking-wider text-orange-300 uppercase">
                            <ShieldCheck className="size-4" />
                            Protected workspace
                        </span>
                        <h1 className="mt-6 text-5xl leading-tight font-black tracking-[-0.05em]">
                            Operate your marketplace with confidence.
                        </h1>
                        <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
                            Secure access for authorised Velora administrators
                            managing catalogue, sellers, fulfilment, finance,
                            and customer operations.
                        </p>
                        <div className="mt-10 grid grid-cols-3 gap-3 text-xs font-bold text-slate-400">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <strong className="block text-2xl text-white">
                                    24/7
                                </strong>
                                <span className="mt-1 block">Operations</span>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <strong className="block text-2xl text-white">
                                    RBAC
                                </strong>
                                <span className="mt-1 block">Protected</span>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <strong className="block text-2xl text-white">
                                    Audit
                                </strong>
                                <span className="mt-1 block">Recorded</span>
                            </div>
                        </div>
                    </div>
                    <p className="relative text-xs text-slate-500">
                        Velora administrator command centre
                    </p>
                </section>

                <main className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-5 py-10 sm:px-10 dark:bg-slate-900">
                    <div className="w-full max-w-md">
                        <Link
                            href={home.url()}
                            className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-500 lg:hidden"
                        >
                            <ArrowLeft className="size-4" />
                            Back to storefront
                        </Link>
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-950/5 sm:p-9 dark:border-white/10 dark:bg-slate-950">
                            <span className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                <LockKeyhole className="size-5" />
                            </span>
                            <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                                Administrator sign in
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Use your authorised admin credentials to
                                continue.
                            </p>

                            {status && (
                                <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                                    {status}
                                </div>
                            )}

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="mt-7 grid gap-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <input
                                            type="hidden"
                                            name="portal"
                                            value="admin"
                                        />
                                        <div className="grid gap-2">
                                            <label
                                                htmlFor="admin-email"
                                                className="text-sm font-bold text-slate-700 dark:text-slate-200"
                                            >
                                                Admin email
                                            </label>
                                            <input
                                                id="admin-email"
                                                name="email"
                                                type="email"
                                                required
                                                autoFocus
                                                autoComplete="email"
                                                placeholder="admin@velora.test"
                                                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm transition outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-white/5 dark:focus:ring-orange-500/10"
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between">
                                                <label
                                                    htmlFor="admin-password"
                                                    className="text-sm font-bold text-slate-700 dark:text-slate-200"
                                                >
                                                    Password
                                                </label>
                                                {canResetPassword && (
                                                    <Link
                                                        href={request.url()}
                                                        className="text-xs font-bold text-orange-600 hover:text-orange-500"
                                                    >
                                                        Forgot password?
                                                    </Link>
                                                )}
                                            </div>
                                            <PasswordInput
                                                id="admin-password"
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                placeholder="Enter your password"
                                                className="h-12 rounded-xl bg-slate-50 dark:bg-white/5"
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>
                                        <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                            <Checkbox name="remember" />
                                            Keep me signed in on this device
                                        </label>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-black text-white shadow-lg transition hover:bg-orange-500 disabled:opacity-60 dark:bg-orange-500 dark:hover:bg-orange-600"
                                        >
                                            {processing && <Spinner />}Sign in
                                            securely
                                        </button>
                                    </>
                                )}
                            </Form>
                        </div>
                        <p className="mt-6 text-center text-sm text-slate-500">
                            Shopping on Velora?{' '}
                            <Link
                                href={login.url()}
                                className="font-bold text-orange-600 hover:text-orange-500"
                            >
                                Customer sign in
                            </Link>
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
