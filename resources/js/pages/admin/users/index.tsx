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
import {
    AdminConfirmDialog,
    AdminEmptyState,
    AdminFilterBar,
    AdminPageHeader,
    AdminPanel,
    AdminStatusBadge,
} from '@/components/admin/primitives';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import usersRoutes from '@/routes/admin/users';
import type {
    AccountRoleOption,
    AdminRoleOption,
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
    adminRoles,
}: {
    users: Paginated<ManagedUser>;
    counts: Counts;
    roles: AccountRoleOption[];
    adminRoles: AdminRoleOption[];
}) {
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1] ?? '');
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [role, setRole] = useState(params.get('role') ?? '');
    const [adminRole, setAdminRole] = useState(params.get('admin_role') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);
    const [deleting, setDeleting] = useState(false);
    const hasFilters =
        search !== '' || role !== '' || adminRole !== '' || status !== '';

    const filterUsers = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            usersRoutes.index.url(),
            { search, role, admin_role: adminRole, status },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setRole('');
        setAdminRole('');
        setStatus('');
        router.get(
            usersRoutes.index.url(),
            {},
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Users" breadcrumb="Settings / Users">
            <AdminPageHeader
                title="People & access"
                description="Manage account access, roles, status, and administrative history from one workspace."
                action={
                    <Link
                        href={usersRoutes.create.url()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
                    >
                        <Plus className="size-4" /> Add user
                    </Link>
                }
            />

            <div className="mt-6">
                <StatCards
                    cards={countCards.map(({ key, label, icon, tone }) => ({
                        label,
                        value: counts[key] ?? 0,
                        icon,
                        tone,
                    }))}
                />
            </div>

            <AdminPanel className="mt-6">
                <AdminFilterBar
                    onSubmit={filterUsers}
                    className="sm:p-5 xl:grid-cols-[minmax(15rem,1fr)_12rem_13rem_11rem_auto]"
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
                        <option value="">All account types</option>
                        {roles.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={adminRole}
                        onChange={(event) => setAdminRole(event.target.value)}
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All admin roles</option>
                        {adminRoles.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
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
                </AdminFilterBar>

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
                                const accountTypeLabel =
                                    roles.find(
                                        (option) => option.value === user.role,
                                    )?.label ?? user.role;
                                const roleLabel =
                                    user.role === 'admin' &&
                                    user.admin_roles?.length
                                        ? user.admin_roles
                                              .map(
                                                  (adminRole) => adminRole.name,
                                              )
                                              .join(', ')
                                        : accountTypeLabel;

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
                                            <AdminStatusBadge
                                                value={
                                                    user.status
                                                        ? 'active'
                                                        : 'inactive'
                                                }
                                            />
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
                                                        setDeletingUser(user)
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
                    <AdminEmptyState
                        icon={UsersRound}
                        title="No users found"
                        description="Try changing the search or account filters."
                    />
                )}
                <Pagination links={users.links} />
            </AdminPanel>

            <AdminConfirmDialog
                open={deletingUser !== null}
                title="Delete user account?"
                description={`${deletingUser?.name ?? 'This user'} will lose access immediately. Their administrative history will remain available for audit purposes.`}
                confirmLabel="Delete user"
                processing={deleting}
                onOpenChange={(open) => {
                    if (!open && !deleting) {
                        setDeletingUser(null);
                    }
                }}
                onConfirm={() => {
                    if (!deletingUser) {
                        return;
                    }

                    setDeleting(true);
                    router.delete(usersRoutes.destroy.url(deletingUser.id), {
                        preserveScroll: true,
                        onFinish: () => {
                            setDeleting(false);
                            setDeletingUser(null);
                        },
                    });
                }}
            />
        </AdminLayout>
    );
}
