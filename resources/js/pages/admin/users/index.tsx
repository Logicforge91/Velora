import { Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock3,
    Eye,
    History,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    UserRoundX,
    UsersRound,
    X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import Pagination from '@/components/admin/pagination';
import AdminLayout from '@/layouts/admin-layout';
import usersRoutes from '@/routes/admin/users';
import type {
    AccountRoleOption,
    Counts,
    ManagedUser,
    Paginated,
} from '@/types/admin';

const countCards = [
    {
        key: 'all',
        label: 'Total users',
        icon: UsersRound,
        tone: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-300',
    },
    {
        key: 'active',
        label: 'Active users',
        icon: CheckCircle2,
        tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300',
    },
    {
        key: 'inactive',
        label: 'Inactive users',
        icon: UserRoundX,
        tone: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-300',
    },
    {
        key: 'administrators',
        label: 'Administrators',
        icon: ShieldCheck,
        tone: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-300',
    },
] as const;

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();
}

export default function UsersIndex({
    users,
    counts,
    roles,
}: {
    users: Paginated<ManagedUser>;
    counts: Counts;
    roles: AccountRoleOption[];
}) {
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1] ?? '');
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [role, setRole] = useState(params.get('role') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const hasFilters = search !== '' || role !== '' || status !== '';

    const filterUsers = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            usersRoutes.index.url(),
            { search, role, status },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setRole('');
        setStatus('');
        router.get(
            usersRoutes.index.url(),
            {},
            { preserveState: true, replace: true },
        );
    };

    const deleteUser = (user: ManagedUser) => {
        if (
            window.confirm(
                `Delete ${user.name}? Their history will remain available.`,
            )
        ) {
            router.delete(usersRoutes.destroy.url(user.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout title="User Management" breadcrumb="Settings / Users">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage access, roles, account status, and activity from
                        one place.
                    </p>
                </div>
                <Link
                    href={usersRoutes.create.url()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
                >
                    <Plus className="size-4" /> Add user
                </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {countCards.map(({ key, label, icon: Icon, tone }) => (
                    <div
                        key={key}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                    {label}
                                </p>
                                <p className="mt-2 text-3xl font-bold tracking-tight">
                                    {counts[key] ?? 0}
                                </p>
                            </div>
                            <span
                                className={`grid size-11 place-items-center rounded-xl ${tone}`}
                            >
                                <Icon className="size-5" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                <form
                    onSubmit={filterUsers}
                    className="grid gap-3 border-b border-slate-200 p-4 sm:p-5 lg:grid-cols-[minmax(16rem,1fr)_13rem_12rem_auto] dark:border-white/10"
                >
                    <label className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search name or email"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-10 text-sm transition outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:focus:border-orange-500/40"
                        />
                    </label>
                    <select
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All roles</option>
                        {roles.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="h-11 flex-1 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                        >
                            Filter
                        </button>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                aria-label="Clear filters"
                                className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-slate-50/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-white/[0.03] dark:text-slate-400">
                            <tr>
                                <th className="px-5 py-3.5 sm:px-6">User</th>
                                <th className="px-5 py-3.5">Role</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5">Joined</th>
                                <th className="px-5 py-3.5 text-right sm:px-6">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {users.data.map((user) => {
                                const roleLabel =
                                    roles.find(
                                        (option) => option.value === user.role,
                                    )?.label ?? user.role;

                                return (
                                    <tr
                                        key={user.id}
                                        className="transition hover:bg-slate-50/70 dark:hover:bg-white/[0.025]"
                                    >
                                        <td className="px-5 py-4 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 text-xs font-bold text-orange-700 dark:from-orange-500/20 dark:to-amber-500/10 dark:text-orange-300">
                                                    {initials(user.name)}
                                                </span>
                                                <div className="min-w-0">
                                                    <Link
                                                        href={usersRoutes.show.url(
                                                            user.id,
                                                        )}
                                                        className="block truncate text-sm font-semibold hover:text-orange-600 dark:hover:text-orange-400"
                                                    >
                                                        {user.name}
                                                    </Link>
                                                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/8 dark:text-slate-300">
                                                {roleLabel}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${user.status ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}
                                            >
                                                <span
                                                    className={`size-1.5 rounded-full ${user.status ? 'bg-emerald-500' : 'bg-slate-400'}`}
                                                />
                                                {user.status
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock3 className="size-3.5" />
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 sm:px-6">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={usersRoutes.show.url(
                                                        user.id,
                                                    )}
                                                    aria-label={`View ${user.name}`}
                                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                                                >
                                                    <Eye className="size-4" />
                                                </Link>
                                                <Link
                                                    href={usersRoutes.edit.url(
                                                        user.id,
                                                    )}
                                                    aria-label={`Edit ${user.name}`}
                                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
                                                >
                                                    <Pencil className="size-4" />
                                                </Link>
                                                <Link
                                                    href={usersRoutes.history.url(
                                                        user.id,
                                                    )}
                                                    aria-label={`History for ${user.name}`}
                                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
                                                >
                                                    <History className="size-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteUser(user)
                                                    }
                                                    aria-label={`Delete ${user.name}`}
                                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {users.data.length === 0 && (
                    <div className="grid place-items-center px-6 py-16 text-center">
                        <span className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5">
                            <UsersRound className="size-5" />
                        </span>
                        <p className="mt-3 text-sm font-semibold">
                            No users found
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Try changing your search or filters.
                        </p>
                    </div>
                )}
                <Pagination links={users.links} />
            </section>
        </AdminLayout>
    );
}
