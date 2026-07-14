import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    History,
    Mail,
    Pencil,
    ShieldCheck,
    Trash2,
    UserRound,
} from 'lucide-react';
import UserHistoryList from '@/components/admin/user-history-list';
import AdminLayout from '@/layouts/admin-layout';
import { formatDateTime } from '@/lib/utils';
import usersRoutes from '@/routes/admin/users';
import type {
    AccountRoleOption,
    ManagedUser,
    UserHistory,
} from '@/types/admin';

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();
}

export default function UserShow({
    managedUser,
    recentHistory,
    roles,
}: {
    managedUser: ManagedUser;
    recentHistory: UserHistory[];
    roles: AccountRoleOption[];
}) {
    const accountTypeLabel =
        roles.find((role) => role.value === managedUser.role)?.label ??
        managedUser.role;
    const roleLabel =
        managedUser.role === 'admin' && managedUser.admin_roles?.length
            ? managedUser.admin_roles.map((role) => role.name).join(', ')
            : accountTypeLabel;
    const deleteUser = () => {
        if (
            window.confirm(
                `Delete ${managedUser.name}? Their history will remain available.`,
            )
        ) {
            router.delete(usersRoutes.destroy.url(managedUser.id));
        }
    };

    return (
        <AdminLayout
            title="User Details"
            breadcrumb={`Settings / Users / ${managedUser.name}`}
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <Link
                    href={usersRoutes.index.url()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-orange-600 dark:hover:text-orange-400"
                >
                    <ArrowLeft className="size-4" />
                    Back to users
                </Link>
                <div className="flex gap-2">
                    <Link
                        href={usersRoutes.edit.url(managedUser.id)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                    >
                        <Pencil className="size-4" />
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={deleteUser}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
                    >
                        <Trash2 className="size-4" />
                        Delete
                    </button>
                </div>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
                <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-7 text-center text-white dark:from-slate-800 dark:to-slate-900">
                        <span className="mx-auto grid size-20 place-items-center rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 text-2xl font-bold shadow-lg shadow-slate-950/30">
                            {initials(managedUser.name)}
                        </span>
                        <h2 className="mt-4 text-xl font-bold">
                            {managedUser.name}
                        </h2>
                        <p className="mt-1 truncate text-sm text-slate-300">
                            {managedUser.email}
                        </p>
                        <span
                            className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${managedUser.status ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/10 text-slate-300'}`}
                        >
                            <span
                                className={`size-1.5 rounded-full ${managedUser.status ? 'bg-emerald-400' : 'bg-slate-400'}`}
                            />
                            {managedUser.status
                                ? 'Active account'
                                : 'Inactive account'}
                        </span>
                    </div>
                    <dl className="divide-y divide-slate-100 px-5 dark:divide-white/5">
                        <div className="flex gap-3 py-4">
                            <ShieldCheck className="mt-0.5 size-4 text-slate-400" />
                            <div>
                                <dt className="text-xs text-slate-500">
                                    {managedUser.role === 'admin'
                                        ? 'Admin role'
                                        : 'Account type'}
                                </dt>
                                <dd className="mt-0.5 text-sm font-semibold">
                                    {roleLabel}
                                </dd>
                            </div>
                        </div>
                        <div className="flex gap-3 py-4">
                            <CalendarDays className="mt-0.5 size-4 text-slate-400" />
                            <div>
                                <dt className="text-xs text-slate-500">
                                    Joined
                                </dt>
                                <dd className="mt-0.5 text-sm font-semibold">
                                    {formatDateTime(managedUser.created_at)}
                                </dd>
                            </div>
                        </div>
                        <div className="flex gap-3 py-4">
                            <CheckCircle2 className="mt-0.5 size-4 text-slate-400" />
                            <div>
                                <dt className="text-xs text-slate-500">
                                    Email verification
                                </dt>
                                <dd className="mt-0.5 text-sm font-semibold">
                                    {managedUser.email_verified_at
                                        ? 'Verified'
                                        : 'Not verified'}
                                </dd>
                            </div>
                        </div>
                    </dl>
                </aside>

                <div className="grid gap-6">
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                        <div className="border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-white/10">
                            <h3 className="font-bold">Account details</h3>
                        </div>
                        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                            <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.035]">
                                <UserRound className="size-4 text-slate-400" />
                                <p className="mt-3 text-xs text-slate-500">
                                    Full name
                                </p>
                                <p className="mt-1 text-sm font-semibold">
                                    {managedUser.name}
                                </p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.035]">
                                <Mail className="size-4 text-slate-400" />
                                <p className="mt-3 text-xs text-slate-500">
                                    Email address
                                </p>
                                <p className="mt-1 truncate text-sm font-semibold">
                                    {managedUser.email}
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-white/10">
                            <div>
                                <h3 className="font-bold">Recent history</h3>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Latest account management activity
                                </p>
                            </div>
                            <Link
                                href={usersRoutes.history.url(managedUser.id)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                            >
                                <History className="size-3.5" />
                                View all
                            </Link>
                        </div>
                        <UserHistoryList
                            entries={recentHistory}
                            roles={roles}
                        />
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
