import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    KeyRound,
    Mail,
    Shield,
    UserRound,
} from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import usersRoutes from '@/routes/admin/users';
import type { AdminRoleOption, ManagedUser } from '@/types/admin';

export default function UserForm({
    managedUser,
    adminRoles,
}: {
    managedUser: Partial<ManagedUser>;
    adminRoles: AdminRoleOption[];
}) {
    const exists = Boolean(managedUser.id);
    const form = useForm({
        name: managedUser.name ?? '',
        email: managedUser.email ?? '',
        role: 'admin',
        admin_role_id:
            managedUser.admin_roles?.[0]?.id ?? adminRoles[0]?.id ?? null,
        status: managedUser.status ?? true,
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (exists && managedUser.id) {
            form.put(usersRoutes.update.url(managedUser.id), {
                preserveScroll: true,
            });

            return;
        }

        form.post(usersRoutes.store.url(), { preserveScroll: true });
    };

    const inputClass =
        'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:focus:border-orange-500/40';

    return (
        <AdminLayout
            title={exists ? 'Edit User' : 'Add User'}
            breadcrumb={`Settings / Users / ${exists ? 'Edit' : 'Add'}`}
        >
            <div className="mx-auto max-w-4xl">
                <Link
                    href={
                        exists && managedUser.id
                            ? usersRoutes.show.url(managedUser.id)
                            : usersRoutes.index.url()
                    }
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-orange-600 dark:hover:text-orange-400"
                >
                    <ArrowLeft className="size-4" />
                    Back to {exists ? 'user' : 'users'}
                </Link>
                <form
                    onSubmit={submit}
                    className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
                >
                    <div className="border-b border-slate-200 px-5 py-5 sm:px-7 dark:border-white/10">
                        <h2 className="text-lg font-bold">
                            Account information
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {exists
                                ? 'Update account details, access level, or credentials.'
                                : 'Create an account and assign the appropriate access level.'}
                        </p>
                    </div>
                    <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <span className="flex items-center gap-2">
                                <UserRound className="size-4 text-slate-400" />
                                Full name
                            </span>
                            <input
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                className={inputClass}
                                autoComplete="name"
                                placeholder="Enter full name"
                                required
                            />
                            {form.errors.name && (
                                <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                    {form.errors.name}
                                </span>
                            )}
                        </label>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <span className="flex items-center gap-2">
                                <Mail className="size-4 text-slate-400" />
                                Email address
                            </span>
                            <input
                                type="email"
                                value={form.data.email}
                                onChange={(event) =>
                                    form.setData('email', event.target.value)
                                }
                                className={inputClass}
                                autoComplete="email"
                                placeholder="name@example.com"
                                required
                            />
                            {form.errors.email && (
                                <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                    {form.errors.email}
                                </span>
                            )}
                        </label>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <span className="flex items-center gap-2">
                                <Shield className="size-4 text-slate-400" />
                                Role
                            </span>
                            <select
                                value={form.data.admin_role_id ?? ''}
                                onChange={(event) =>
                                    form.setData(
                                        'admin_role_id',
                                        Number(event.target.value),
                                    )
                                }
                                className={`${inputClass} dark:bg-[#101722]`}
                                required
                            >
                                {adminRoles.length === 0 && (
                                    <option value="" disabled>
                                        Create an admin role first
                                    </option>
                                )}
                                {adminRoles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            {form.errors.role && (
                                <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                    {form.errors.role}
                                </span>
                            )}
                            {form.errors.admin_role_id && (
                                <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                    {form.errors.admin_role_id}
                                </span>
                            )}
                            <span className="mt-1.5 block text-xs font-normal text-slate-500">
                                Administrator options are managed from the Admin
                                Roles menu.
                            </span>
                        </label>
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <span className="flex items-center gap-2">
                                <Check className="size-4 text-slate-400" />
                                Account status
                            </span>
                            <div className="mt-2 flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 dark:border-white/10 dark:bg-white/[0.04]">
                                <span className="text-sm font-medium">
                                    {form.data.status ? 'Active' : 'Inactive'}
                                </span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={form.data.status}
                                    onClick={() =>
                                        form.setData(
                                            'status',
                                            !form.data.status,
                                        )
                                    }
                                    className={`relative h-6 w-11 rounded-full transition ${form.data.status ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <span
                                        className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition ${form.data.status ? 'left-5.5' : 'left-0.5'}`}
                                    />
                                </button>
                            </div>
                            {form.errors.status && (
                                <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                    {form.errors.status}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-slate-200 px-5 pt-5 sm:px-7 dark:border-white/10">
                        <div className="flex items-center gap-2">
                            <KeyRound className="size-4 text-slate-400" />
                            <h3 className="text-sm font-bold">
                                {exists ? 'Change password' : 'Password'}
                            </h3>
                        </div>
                        {exists && (
                            <p className="mt-1 text-xs text-slate-500">
                                Leave both fields empty to keep the current
                                password.
                            </p>
                        )}
                    </div>
                    <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            New password
                            <input
                                type="password"
                                value={form.data.password}
                                onChange={(event) =>
                                    form.setData('password', event.target.value)
                                }
                                className={inputClass}
                                autoComplete="new-password"
                                required={!exists}
                            />
                            {form.errors.password && (
                                <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                    {form.errors.password}
                                </span>
                            )}
                        </label>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Confirm password
                            <input
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(event) =>
                                    form.setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                                autoComplete="new-password"
                                required={!exists || form.data.password !== ''}
                            />
                        </label>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7 dark:border-white/10 dark:bg-white/[0.02]">
                        <Link
                            href={usersRoutes.index.url()}
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={
                                form.processing || adminRoles.length === 0
                            }
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {form.processing
                                ? 'Saving…'
                                : exists
                                  ? 'Save changes'
                                  : 'Create user'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
