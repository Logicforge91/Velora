import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Building2,
    GitPullRequestArrow,
    KeyRound,
    ListChecks,
    LockKeyhole,
    ScrollText,
    ShieldCheck,
    ShieldEllipsis,
    ShieldQuestion,
    UserCog,
    Users,
    Workflow,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import admin from '@/routes/admin';

type MetricKey =
    | 'admin_users'
    | 'teams'
    | 'departments'
    | 'roles'
    | 'permissions'
    | 'approval_workflows'
    | 'activity_logs'
    | 'login_history'
    | 'audit_logs'
    | 'api_users'
    | 'access_tokens'
    | 'two_factor_authentication'
    | 'ip_restrictions';

type Item = {
    key: MetricKey;
    label: string;
    description: string;
    icon: LucideIcon;
    href: string;
};

const items: Item[] = [
    {
        key: 'admin_users',
        label: 'Admin Users',
        description: 'Administrator accounts and access status.',
        icon: UserCog,
        href: admin.users.index.url({ query: { role: 'admin' } }),
    },
    {
        key: 'teams',
        label: 'Teams',
        description: 'Account teams and collaborative ownership.',
        icon: Users,
        href: admin.administration.url({ query: { section: 'teams' } }),
    },
    {
        key: 'departments',
        label: 'Departments',
        description: 'Operational groups and responsibility boundaries.',
        icon: Building2,
        href: admin.administration.url({ query: { section: 'departments' } }),
    },
    {
        key: 'roles',
        label: 'Roles',
        description: 'Reusable administrative access profiles.',
        icon: ShieldCheck,
        href: admin.adminRoles.index.url(),
    },
    {
        key: 'permissions',
        label: 'Permissions',
        description: 'Fine-grained marketplace capabilities.',
        icon: ListChecks,
        href: admin.adminRoles.index.url(),
    },
    {
        key: 'approval_workflows',
        label: 'Approval Workflows',
        description: 'Seller, listing and return requests awaiting action.',
        icon: GitPullRequestArrow,
        href: admin.vendors.index.url({ query: { status: 'pending' } }),
    },
    {
        key: 'activity_logs',
        label: 'Activity Logs',
        description: 'Recent administrative changes and operations.',
        icon: Activity,
        href: admin.auditLogs.index.url(),
    },
    {
        key: 'login_history',
        label: 'Login History',
        description: 'Authentication and administrative login events.',
        icon: LockKeyhole,
        href: admin.auditLogs.index.url({
            query: { category: 'authentication' },
        }),
    },
    {
        key: 'audit_logs',
        label: 'Audit Logs',
        description: 'Immutable governance and security records.',
        icon: ScrollText,
        href: admin.auditLogs.index.url(),
    },
    {
        key: 'api_users',
        label: 'API Users',
        description: 'Accounts currently holding API access tokens.',
        icon: Workflow,
        href: admin.users.index.url({ query: { view: 'api-users' } }),
    },
    {
        key: 'access_tokens',
        label: 'Access Tokens',
        description: 'Issued personal access credentials.',
        icon: KeyRound,
        href: admin.administration.url({ query: { section: 'tokens' } }),
    },
    {
        key: 'two_factor_authentication',
        label: 'Two-factor Authentication',
        description: 'Accounts protected with an additional factor.',
        icon: ShieldEllipsis,
        href: admin.users.index.url({ query: { view: 'two-factor' } }),
    },
    {
        key: 'ip_restrictions',
        label: 'IP Restrictions',
        description: 'Network allow-lists for privileged access.',
        icon: ShieldQuestion,
        href: admin.administration.url({
            query: { section: 'ip-restrictions' },
        }),
    },
];

export default function AdministrationIndex({
    metrics,
}: {
    metrics: Record<MetricKey, number>;
}) {
    return (
        <AdminLayout
            title="Administration"
            breadcrumb="Administration / Overview"
        >
            <Head title="Administration" />
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black tracking-tight">
                    Administration
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Manage identity, governance, approvals and privileged access
                    from one workspace.
                </p>
            </div>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map(({ key, label, description, icon: Icon, href }) => (
                    <Link
                        key={key}
                        href={href}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/40 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-orange-500/20 dark:hover:shadow-none"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <span className="grid size-11 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                                <Icon className="size-5" />
                            </span>
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700 dark:bg-white/8 dark:text-slate-200">
                                {metrics[key].toLocaleString()}
                            </span>
                        </div>
                        <h3 className="mt-5 text-sm font-black">{label}</h3>
                        <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">
                            {description}
                        </p>
                        <span className="mt-4 flex items-center gap-1 text-[11px] font-bold text-orange-600">
                            Manage
                            <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                        </span>
                    </Link>
                ))}
            </section>
        </AdminLayout>
    );
}
