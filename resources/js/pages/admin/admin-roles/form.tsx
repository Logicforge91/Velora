import { Link, useForm } from '@inertiajs/react';
import { LockKeyhole, Save, ShieldCheck, UserRoundCog } from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import adminRoles from '@/routes/admin/admin-roles';
import type { AdminRole } from '@/types/admin';

type PermissionOption = { value: string; label: string };
type AdminOption = {
    id: number;
    name: string;
    email: string;
};

export default function AdminRoleForm({
    adminRole,
    permissions,
    admins,
}: {
    adminRole: AdminRole;
    permissions: PermissionOption[];
    admins: AdminOption[];
}) {
    const exists = Boolean(adminRole.id);
    const form = useForm({
        name: adminRole.name ?? '',
        slug: adminRole.slug ?? '',
        description: adminRole.description ?? '',
        permissions: adminRole.permissions ?? [],
        user_ids: adminRole.users?.map((user) => user.id) ?? [],
    });

    const togglePermission = (permission: string) => {
        form.setData(
            'permissions',
            form.data.permissions.includes(permission)
                ? form.data.permissions.filter((value) => value !== permission)
                : [...form.data.permissions, permission],
        );
    };

    const toggleUser = (userId: number) => {
        form.setData(
            'user_ids',
            form.data.user_ids.includes(userId)
                ? form.data.user_ids.filter((value) => value !== userId)
                : [...form.data.user_ids, userId],
        );
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (exists) {
            form.put(adminRoles.update.url(adminRole.id), {
                preserveScroll: true,
            });
        } else {
            form.post(adminRoles.store.url(), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout
            title={exists ? 'Edit Admin Role' : 'Create Admin Role'}
            breadcrumb={`Admin Roles / ${exists ? 'Edit' : 'Create'}`}
        >
            <form
                onSubmit={submit}
                className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]"
            >
                <div className="grid gap-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-start gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                                <ShieldCheck className="size-5" />
                            </span>
                            <div>
                                <h2 className="font-bold">Role details</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Use a clear operational name for this access
                                    profile.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm font-semibold">
                                Role name
                                <input
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData('name', event.target.value)
                                    }
                                    className="h-11 rounded-xl border border-slate-300 bg-transparent px-3.5 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10"
                                    placeholder="Catalogue Manager"
                                />
                                {form.errors.name && (
                                    <span className="text-xs text-rose-600">
                                        {form.errors.name}
                                    </span>
                                )}
                            </label>
                            <label className="grid gap-2 text-sm font-semibold">
                                Slug
                                <input
                                    value={form.data.slug}
                                    onChange={(event) =>
                                        form.setData('slug', event.target.value)
                                    }
                                    className="h-11 rounded-xl border border-slate-300 bg-transparent px-3.5 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10"
                                    placeholder="catalogue-manager"
                                />
                                {form.errors.slug && (
                                    <span className="text-xs text-rose-600">
                                        {form.errors.slug}
                                    </span>
                                )}
                            </label>
                            <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
                                Description
                                <textarea
                                    value={form.data.description}
                                    onChange={(event) =>
                                        form.setData(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    rows={3}
                                    className="rounded-xl border border-slate-300 bg-transparent px-3.5 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10"
                                    placeholder="Manages products, categories, brands, and inventory."
                                />
                                {form.errors.description && (
                                    <span className="text-xs text-rose-600">
                                        {form.errors.description}
                                    </span>
                                )}
                            </label>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-start gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                                <LockKeyhole className="size-5" />
                            </span>
                            <div>
                                <h2 className="font-bold">
                                    Module permissions
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Select only the operations this role needs.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {permissions.map((permission) => (
                                <label
                                    key={permission.value}
                                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-orange-300 hover:bg-orange-50/50 dark:border-white/10 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/5"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.data.permissions.includes(
                                            permission.value,
                                        )}
                                        onChange={() =>
                                            togglePermission(permission.value)
                                        }
                                        className="mt-0.5 size-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                                    />
                                    <span>
                                        <span className="block text-sm font-bold">
                                            {permission.label}
                                        </span>
                                        <span className="mt-1 block text-xs text-slate-500">
                                            {permission.value}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                        {form.errors.permissions && (
                            <p className="mt-3 text-xs text-rose-600">
                                {form.errors.permissions}
                            </p>
                        )}
                    </section>
                </div>

                <div className="grid content-start gap-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-start gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                                <UserRoundCog className="size-5" />
                            </span>
                            <div>
                                <h2 className="font-bold">
                                    Assign administrators
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Your own account is intentionally excluded.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 grid max-h-[30rem] gap-2 overflow-y-auto pr-1">
                            {admins.map((admin) => (
                                <label
                                    key={admin.id}
                                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3.5 dark:border-white/10"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.data.user_ids.includes(
                                            admin.id,
                                        )}
                                        onChange={() => toggleUser(admin.id)}
                                        className="size-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-black dark:bg-white/10">
                                        {admin.name.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-bold">
                                            {admin.name}
                                        </span>
                                        <span className="block truncate text-xs text-slate-500">
                                            {admin.email}
                                        </span>
                                    </span>
                                </label>
                            ))}
                            {admins.length === 0 && (
                                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5">
                                    No other administrator accounts are
                                    available.
                                </p>
                            )}
                        </div>
                        {form.errors.user_ids && (
                            <p className="mt-3 text-xs text-rose-600">
                                {form.errors.user_ids}
                            </p>
                        )}
                    </section>

                    <div className="flex gap-3">
                        <Link
                            href={adminRoles.index.url()}
                            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-bold transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
                        >
                            <Save className="size-4" />
                            {form.processing ? 'Saving...' : 'Save role'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
