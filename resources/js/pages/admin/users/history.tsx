import { Link } from '@inertiajs/react';
import { ArrowLeft, History as HistoryIcon } from 'lucide-react';
import Pagination from '@/components/admin/pagination';
import UserHistoryList from '@/components/admin/user-history-list';
import AdminLayout from '@/layouts/admin-layout';
import usersRoutes from '@/routes/admin/users';
import type {
    AccountRoleOption,
    ManagedUser,
    Paginated,
    UserHistory,
} from '@/types/admin';

export default function UserHistoryPage({
    managedUser,
    history,
    roles,
}: {
    managedUser: ManagedUser;
    history: Paginated<UserHistory>;
    roles: AccountRoleOption[];
}) {
    const backUrl = managedUser.deleted_at
        ? usersRoutes.index.url()
        : usersRoutes.show.url(managedUser.id);

    return (
        <AdminLayout
            title="User History"
            breadcrumb={`Settings / Users / ${managedUser.name} / History`}
        >
            <Link
                href={backUrl}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-orange-600 dark:hover:text-orange-400"
            >
                <ArrowLeft className="size-4" />
                Back to {managedUser.deleted_at ? 'users' : 'user'}
            </Link>
            <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <span className="grid size-11 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                            <HistoryIcon className="size-5" />
                        </span>
                        <div>
                            <h2 className="font-bold">{managedUser.name}</h2>
                            <p className="text-xs text-slate-500">
                                {managedUser.email}
                            </p>
                        </div>
                    </div>
                    {managedUser.deleted_at && (
                        <span className="w-fit rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                            Deleted account
                        </span>
                    )}
                </div>
                <UserHistoryList entries={history.data} roles={roles} />
                <Pagination links={history.links} />
            </section>
        </AdminLayout>
    );
}
