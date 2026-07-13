import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Boxes,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Package,
    Search,
    ShoppingBag,
    Store,
    Sun,
    Tags,
    Users,
    X,
} from 'lucide-react';
import {  useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import { logout } from '@/routes';
import admin from '@/routes/admin';

const navigation = [
    { label: 'Dashboard', href: admin.dashboard.url(), icon: LayoutDashboard },
    { label: 'Vendors', href: admin.vendors.index.url(), icon: Store },
    { label: 'Categories', href: admin.categories.index.url(), icon: Boxes },
    { label: 'Brands', href: admin.brands.index.url(), icon: Tags },
];

const upcoming = [
    { label: 'Users', icon: Users },
    { label: 'Products', icon: Package },
    { label: 'Orders', icon: ShoppingBag },
    { label: 'Analytics', icon: BarChart3 },
];

type Props = PropsWithChildren<{
    title?: string;
    breadcrumb?: string;
}>;

export default function AdminLayout({
    children,
    title = 'Dashboard',
    breadcrumb = 'Overview',
}: Props) {
    const { auth, errors, flash, pendingVendorCount } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dark, setDark] = useState(() =>
        document.documentElement.classList.contains('dark'),
    );
    const currentPath = window.location.pathname;

    const toggleTheme = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('appearance', next ? 'dark' : 'light');
    };

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
            }

            if (event.key === 'Escape') {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
            <Head title={title} />
            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close navigation"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-white/10 dark:bg-slate-950 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex h-20 items-center justify-between px-5">
                    <Link href={admin.dashboard.url()} className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-base font-black text-white shadow-lg dark:bg-white dark:text-slate-950">V</span>
                        <span>
                            <span className="block text-base font-bold tracking-tight">Velora</span>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Admin console</span>
                        </span>
                    </Link>
                    <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden" aria-label="Close navigation"><X className="size-5" /></button>
                </div>

                <div className="px-4">
                    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-transparent">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200"><span className="size-2 rounded-full bg-emerald-500" />Store is operational</div>
                        <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">All commerce services are running normally.</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
                    <div className="mt-3 grid gap-1.5">
                        {navigation.map((item) => {
                            const active = currentPath === item.href || (item.href !== admin.dashboard.url() && currentPath.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link key={item.label} href={item.href} prefetch className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? 'bg-slate-950 text-white shadow-md dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'}`}>
                                    <span className={`grid size-9 place-items-center rounded-lg ${active ? 'bg-white/10 dark:bg-slate-950/10' : 'bg-slate-100 dark:bg-white/5'}`}><Icon className="size-[1.1rem]" /></span>
                                    <span className="flex-1">{item.label}</span>
                                    {item.label === 'Vendors' && Number(pendingVendorCount) > 0 ? <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">{Number(pendingVendorCount) > 99 ? '99+' : pendingVendorCount}</span> : active && <span className="size-1.5 rounded-full bg-indigo-400" />}
                                </Link>
                            );
                        })}
                    </div>
                    <p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Operations</p>
                    <div className="mt-3 grid gap-1.5">
                        {upcoming.map(({ label, icon: Icon }) => (
                            <div key={label} className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400" title="Coming soon">
                                <span className="grid size-9 place-items-center rounded-lg bg-slate-100 dark:bg-white/5"><Icon className="size-[1.1rem]" /></span>
                                <span className="flex-1">{label}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase dark:bg-white/5">Soon</span>
                            </div>
                        ))}
                    </div>
                </nav>

                <div className="border-t border-slate-200 p-4 dark:border-white/10">
                    <div className="flex items-center gap-3 rounded-xl p-2">
                        <span className="grid size-10 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">{auth.user.name.charAt(0).toUpperCase()}</span>
                        <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{auth.user.name}</p><p className="truncate text-xs text-slate-500">{auth.user.email}</p></div>
                        <Link href={logout.url()} method="post" as="button" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10" aria-label="Sign out"><LogOut className="size-5" /></Link>
                    </div>
                </div>
            </aside>

            <div className="min-w-0">
                <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85">
                    <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
                        <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300 lg:hidden" aria-label="Open navigation"><Menu className="size-5" /></button>
                        <div className="min-w-0 flex-1"><div className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><span>Admin</span><ChevronRight className="size-3" /><span>{breadcrumb}</span></div><h1 className="mt-0.5 truncate text-xl font-bold tracking-tight">{title}</h1></div>
                        {currentPath !== admin.dashboard.url() && <button type="button" onClick={() => document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()} className="hidden min-w-56 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 dark:border-white/10 dark:bg-white/5 md:flex"><Search className="size-4" /><span className="flex-1 text-left">Search records</span><kbd className="text-[10px] font-bold">Ctrl K</kbd></button>}
                        <button type="button" onClick={toggleTheme} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300" aria-label="Toggle color theme">{dark ? <Sun className="size-5" /> : <Moon className="size-5" />}</button>
                    </div>
                </header>
                <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    {flash?.success && <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">{flash.success}</div>}
                    {flash?.error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{flash.error}</div>}
                    {Object.keys(errors).length > 0 && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{Object.values(errors)[0]}</div>}
                    {children}
                </main>
            </div>
        </div>
    );
}
