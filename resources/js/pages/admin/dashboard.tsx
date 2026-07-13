import { Activity, CalendarDays, Check, Store, Users } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';

type Statistics = {
    total_users: number;
    total_admins: number;
    total_vendors: number;
    total_customers: number;
    total_delivery_agents: number;
    total_support_agents: number;
    active_users: number;
    inactive_users: number;
    new_users_30_days: number;
    active_rate: number;
};

type RecentUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: boolean;
    created_at: string;
};

export default function AdminDashboard({ statistics, recentUsers }: { statistics: Statistics; recentUsers: RecentUser[] }) {
    const cards = [
        { label: 'Total users', value: statistics.total_users, note: `+${statistics.new_users_30_days} joined in 30 days`, icon: Users, tone: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' },
        { label: 'Active accounts', value: statistics.active_users, note: `${statistics.active_rate}% activation rate`, icon: Check, tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
        { label: 'Marketplace vendors', value: statistics.total_vendors, note: 'Registered seller accounts', icon: Store, tone: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10' },
        { label: 'Needs attention', value: statistics.inactive_users, note: 'Currently disabled accounts', icon: Activity, tone: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' },
    ];
    const roleMix = [
        ['Customers', statistics.total_customers, 'bg-indigo-500'],
        ['Vendors', statistics.total_vendors, 'bg-violet-500'],
        ['Delivery agents', statistics.total_delivery_agents, 'bg-cyan-500'],
        ['Support agents', statistics.total_support_agents, 'bg-amber-500'],
        ['Administrators', statistics.total_admins, 'bg-emerald-500'],
    ] as const;
    const total = Math.max(statistics.total_users, 1);

    return (
        <AdminLayout title="Dashboard Overview" breadcrumb="Overview">
            <section className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
                <div className="absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-indigo-500/30 blur-3xl" />
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div><span className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100">Live marketplace overview</span><h2 className="mt-4 text-2xl font-bold sm:text-3xl">Your commerce workspace.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Monitor account growth, activation, vendors, and the newest members from one focused dashboard.</p></div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><CalendarDays className="size-5 text-cyan-300" /><div><p className="text-xs text-slate-400">Reporting period</p><p className="text-sm font-semibold">Last 30 days</p></div></div>
                </div>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map(({ label, value, note, icon: Icon, tone }) => <article key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold">{value.toLocaleString()}</p></div><span className={`grid size-11 place-items-center rounded-xl ${tone}`}><Icon className="size-5" /></span></div><p className="mt-4 text-xs text-slate-500">{note}</p></article>)}
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-3">
                <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 xl:col-span-2"><div className="border-b border-slate-200/80 px-6 py-5 dark:border-white/10"><h3 className="font-bold">Recent registrations</h3><p className="mt-1 text-sm text-slate-500">The newest people joining your marketplace</p></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-white/5"><tr><th className="px-6 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-6 py-3 text-right">Joined</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-white/5">{recentUsers.map((user) => <tr key={user.id}><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-slate-100 text-xs font-bold dark:bg-white/10">{user.name.charAt(0).toUpperCase()}</span><div><p className="text-sm font-semibold">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div></div></td><td className="px-5 py-4 text-sm capitalize">{user.role.replaceAll('_', ' ')}</td><td className="px-5 py-4 text-sm"><span className={user.status ? 'text-emerald-600' : 'text-red-600'}>{user.status ? 'Active' : 'Inactive'}</span></td><td className="px-6 py-4 text-right text-xs text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></article>
                <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"><h3 className="font-bold">User mix</h3><p className="mt-1 text-sm text-slate-500">Accounts by platform role</p><div className="mt-7 grid gap-5">{roleMix.map(([label, value, color]) => {
 const percentage = Math.round((value / total) * 100);

 return <div key={label}><div className="mb-2 flex justify-between text-sm"><span>{label}</span><strong>{value.toLocaleString()} <span className="text-xs text-slate-400">{percentage}%</span></strong></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} /></div></div>; 
})}</div></article>
            </section>
        </AdminLayout>
    );
}
