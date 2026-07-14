import { Link, router } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    ShieldCheck,
    Trash2,
    UserCheck,
    Users,
} from 'lucide-react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import adminRoles from '@/routes/admin/admin-roles';
import type { AdminRole, Counts, Paginated } from '@/types/admin';

export default function AdminRolesIndex({
    roles,
    counts,
}: {
    roles: Paginated<AdminRole>;
    counts: Counts;
}) {
    const remove = (role: AdminRole) => {
        if (confirm(`Delete the ${role.name} role?`)) {
            router.delete(adminRoles.destroy.url(role.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout title="Roles & Permissions" breadcrumb="Admin Roles">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Control access to every marketplace operation from one
                        place.
                    </p>
                </div>
                <Link
                    href={adminRoles.create.url()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
                >
                    <Plus className="size-4" /> Create role
                </Link>
            </div>

            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Configured roles',
                            value: counts.roles,
                            icon: ShieldCheck,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300',
                        },
                        {
                            label: 'Restricted admins',
                            value: counts.assigned_admins,
                            icon: UserCheck,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
                        },
                        {
                            label: 'Unassigned admins',
                            value: counts.unassigned_admins,
                            icon: Users,
                            tone: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300',
                        },
                    ]}
                />
            </div>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase dark:bg-white/5">
                            <tr>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-5 py-4">Permissions</th>
                                <th className="px-5 py-4">Administrators</th>
                                <th className="px-6 py-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {roles.data.map((role) => (
                                <tr
                                    key={role.id}
                                    className="hover:bg-slate-50/70 dark:hover:bg-white/[0.025]"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                                                <ShieldCheck className="size-5" />
                                            </span>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold">
                                                        {role.name}
                                                    </p>
                                                    {role.is_system && (
                                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase dark:bg-white/10">
                                                            System
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {role.slug}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex max-w-md flex-wrap gap-1.5">
                                            {role.permissions
                                                .slice(0, 3)
                                                .map((permission) => (
                                                    <span
                                                        key={permission}
                                                        className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-white/8 dark:text-slate-300"
                                                    >
                                                        {permission}
                                                    </span>
                                                ))}
                                            {role.permissions.length > 3 && (
                                                <span className="px-1 py-1 text-xs font-semibold text-slate-400">
                                                    +
                                                    {role.permissions.length -
                                                        3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-semibold">
                                        {role.users_count ?? 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={adminRoles.edit.url(
                                                    role.id,
                                                )}
                                                className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                                                aria-label={`Edit ${role.name}`}
                                            >
                                                <Pencil className="size-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => remove(role)}
                                                disabled={
                                                    role.is_system ||
                                                    Boolean(role.users_count)
                                                }
                                                className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-rose-500/10"
                                                aria-label={`Delete ${role.name}`}
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {roles.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-14 text-center text-sm text-slate-500"
                                    >
                                        No admin roles have been configured.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={roles.links} />
            </section>
        </AdminLayout>
    );
}
