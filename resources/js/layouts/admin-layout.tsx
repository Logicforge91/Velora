import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BadgePercent,
    Banknote,
    Bell,
    Boxes,
    ChevronDown,
    ChevronRight,
    CircleHelp,
    FileSpreadsheet,
    Command,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquareText,
    Headphones,
    Moon,
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    ReceiptText,
    Search,
    ScrollText,
    ShoppingBag,
    Store,
    Sun,
    Tags,
    Truck,
    Undo2,
    Users,
    WalletCards,
    Warehouse,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/routes';
import admin from '@/routes/admin';

const navigationSections = [
    {
        label: 'Overview',
        icon: LayoutDashboard,
        items: [
            {
                label: 'Dashboard',
                href: admin.dashboard.url(),
                icon: LayoutDashboard,
            },
            {
                label: 'Analytics',
                href: admin.analytics.url(),
                icon: BarChart3,
            },
        ],
    },
    {
        label: 'Catalog',
        icon: Package,
        items: [
            {
                label: 'Products',
                href: admin.products.index.url(),
                icon: Package,
            },
            {
                label: 'Categories',
                href: admin.categories.index.url(),
                icon: Boxes,
            },
            { label: 'Brands', href: admin.brands.index.url(), icon: Tags },
            {
                label: 'Bulk Imports',
                href: admin.catalogImports.index.url(),
                icon: FileSpreadsheet,
            },
        ],
    },
    {
        label: 'Sales',
        icon: ShoppingBag,
        items: [
            {
                label: 'Orders',
                href: admin.orders.index.url(),
                icon: ShoppingBag,
            },
            {
                label: 'Promotions',
                href: admin.coupons.index.url(),
                icon: BadgePercent,
            },
            {
                label: 'Reviews',
                href: admin.reviews.index.url(),
                icon: MessageSquareText,
            },
        ],
    },
    {
        label: 'Operations',
        icon: Truck,
        items: [
            {
                label: 'Shipments',
                href: admin.shipments.index.url(),
                icon: Truck,
            },
            {
                label: 'Warehouses',
                href: admin.warehouses.index.url(),
                icon: Warehouse,
            },
            { label: 'Returns', href: admin.returns.index.url(), icon: Undo2 },
            {
                label: 'Support',
                href: admin.support.index.url(),
                icon: Headphones,
            },
        ],
    },
    {
        label: 'Finance',
        icon: WalletCards,
        items: [
            {
                label: 'Payments',
                href: admin.payments.index.url(),
                icon: WalletCards,
            },
            {
                label: 'GST Invoices',
                href: admin.taxInvoices.index.url(),
                icon: ReceiptText,
            },
            {
                label: 'Settlements',
                href: admin.settlements.index.url(),
                icon: Banknote,
            },
        ],
    },
    {
        label: 'Accounts',
        icon: Users,
        items: [
            { label: 'Vendors', href: admin.vendors.index.url(), icon: Store },
            { label: 'Customers', href: admin.users.index.url(), icon: Users },
            {
                label: 'Audit Logs',
                href: admin.auditLogs.index.url(),
                icon: ScrollText,
            },
        ],
    },
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
    const { url } = usePage();
    const currentPath = url.split('?')[0];
    const activeSectionLabel = navigationSections.find((section) =>
        section.items.some(
            (item) =>
                currentPath === item.href ||
                (item.href !== admin.dashboard.url() &&
                    currentPath.startsWith(item.href)),
        ),
    )?.label;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [openSection, setOpenSection] = useState<string | null>(
        activeSectionLabel ?? 'Overview',
    );
    const [dark, setDark] = useState(() =>
        typeof document === 'undefined'
            ? false
            : document.documentElement.classList.contains('dark'),
    );
    const pendingCount = Number(pendingVendorCount ?? 0);

    const toggleTheme = () => {
        const next = !dark;

        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('appearance', next ? 'dark' : 'light');
    };

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                document
                    .querySelector<HTMLInputElement>('input[type="search"]')
                    ?.focus();
            }

            if (event.key === 'Escape') {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-[#f6f7f9] text-slate-950 lg:flex dark:bg-[#090d14] dark:text-slate-100">
            <Head title={title} />

            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close navigation"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col border-r border-white/8 bg-[#111827] text-white shadow-2xl transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 lg:shadow-none dark:bg-[#0d121c] ${sidebarCollapsed ? 'lg:w-[5.5rem]' : 'lg:w-[17.5rem]'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div
                    className={`flex h-[4.5rem] items-center px-5 ${sidebarCollapsed ? 'lg:justify-center lg:px-3' : 'justify-between'}`}
                >
                    <Link
                        href={admin.dashboard.url()}
                        className="flex min-w-0 items-center gap-3"
                    >
                        <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#f97316] text-lg font-black text-white shadow-lg shadow-orange-950/30">
                            V
                            <span className="absolute -right-2 -bottom-2 size-5 rounded-full bg-amber-300/80" />
                        </span>
                        <span
                            className={`min-w-0 ${sidebarCollapsed ? 'lg:hidden' : ''}`}
                        >
                            <span className="block truncate text-[17px] font-bold tracking-tight">
                                Velora
                            </span>
                            <span className="block truncate text-[9px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                                Commerce OS
                            </span>
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
                        aria-label="Close navigation"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div
                    className={`px-4 pb-5 ${sidebarCollapsed ? 'lg:hidden' : ''}`}
                >
                    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.06] p-4">
                        <div className="absolute -top-8 -right-6 size-20 rounded-full bg-orange-500/15 blur-2xl" />
                        <div className="relative flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
                                    Store status
                                </p>
                                <p className="mt-1.5 text-sm font-semibold">
                                    Marketplace live
                                </p>
                            </div>
                            <span className="grid size-9 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">
                                <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.1)]" />
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto px-3 pb-5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="grid gap-1.5">
                        {navigationSections.map((section) => {
                            const sectionActive =
                                activeSectionLabel === section.label;
                            const SectionIcon = section.icon;

                            if (sidebarCollapsed) {
                                return (
                                    <button
                                        key={section.label}
                                        type="button"
                                        onClick={() => {
                                            setOpenSection(section.label);
                                            setSidebarCollapsed(false);
                                        }}
                                        title={section.label}
                                        aria-label={`Open ${section.label} menu`}
                                        className={`group relative flex items-center justify-center rounded-xl px-2 py-2.5 transition ${sectionActive ? 'bg-[#f97316] text-white shadow-lg shadow-orange-950/20' : 'text-slate-500 hover:bg-white/[0.06] hover:text-white'}`}
                                    >
                                        <span
                                            className={`grid size-8 place-items-center rounded-lg transition ${sectionActive ? 'bg-white/15' : 'group-hover:text-slate-200'}`}
                                        >
                                            <SectionIcon className="size-[18px]" />
                                        </span>
                                        {section.label === 'Accounts' &&
                                            pendingCount > 0 && (
                                                <span className="absolute top-2 right-2 size-2 rounded-full bg-amber-400 ring-2 ring-[#111827] dark:ring-[#0d121c]" />
                                            )}
                                    </button>
                                );
                            }

                            return (
                                <Collapsible
                                    key={section.label}
                                    open={openSection === section.label}
                                    onOpenChange={(open) =>
                                        setOpenSection(
                                            open ? section.label : null,
                                        )
                                    }
                                >
                                    <CollapsibleTrigger
                                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${sectionActive ? 'bg-white/[0.06] text-white' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'}`}
                                    >
                                        <span
                                            className={`grid size-8 place-items-center rounded-lg transition ${sectionActive ? 'bg-orange-500/15 text-orange-400' : 'text-slate-500 group-hover:text-slate-200'}`}
                                        >
                                            <SectionIcon className="size-[18px]" />
                                        </span>
                                        <span className="min-w-0 flex-1 truncate text-left">
                                            {section.label}
                                        </span>
                                        {section.label === 'Accounts' &&
                                            pendingCount > 0 && (
                                                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                                                    {pendingCount > 99
                                                        ? '99+'
                                                        : pendingCount}
                                                </span>
                                            )}
                                        <ChevronDown className="size-4 shrink-0 text-slate-500 transition-transform duration-200 group-hover:text-slate-300 group-data-[state=open]:rotate-180" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="overflow-hidden">
                                        <div className="mt-1 ml-7 grid gap-1 border-l border-white/8 pl-3">
                                            {section.items.map((item) => {
                                                const active =
                                                    currentPath === item.href ||
                                                    (item.href !==
                                                        admin.dashboard.url() &&
                                                        currentPath.startsWith(
                                                            item.href,
                                                        ));
                                                const Icon = item.icon;

                                                return (
                                                    <Link
                                                        key={item.label}
                                                        href={item.href}
                                                        prefetch
                                                        onClick={() =>
                                                            setSidebarOpen(
                                                                false,
                                                            )
                                                        }
                                                        className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition ${active ? 'bg-[#f97316] text-white shadow-md shadow-orange-950/20' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'}`}
                                                    >
                                                        <Icon
                                                            className={`size-4 shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-200'}`}
                                                        />
                                                        <span className="min-w-0 flex-1 truncate">
                                                            {item.label}
                                                        </span>
                                                        {item.label ===
                                                            'Vendors' &&
                                                        pendingCount > 0 ? (
                                                            <span
                                                                className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${active ? 'bg-white text-orange-600' : 'bg-amber-400 text-slate-950'}`}
                                                            >
                                                                {pendingCount >
                                                                99
                                                                    ? '99+'
                                                                    : pendingCount}
                                                            </span>
                                                        ) : (
                                                            active && (
                                                                <ChevronRight className="size-3.5 text-orange-100" />
                                                            )
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}
                    </div>
                </nav>

                <div
                    className={`flex items-center border-t border-white/6 px-4 py-3 text-[10px] text-slate-600 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}
                >
                    {!sidebarCollapsed && <span>Velora Admin v1.0</span>}
                    <button
                        type="button"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.06] hover:text-white lg:inline-flex"
                        aria-label={
                            sidebarCollapsed
                                ? 'Expand navigation'
                                : 'Collapse navigation'
                        }
                    >
                        {sidebarCollapsed ? (
                            <PanelLeftOpen className="size-4" />
                        ) : (
                            <PanelLeftClose className="size-4" />
                        )}
                    </button>
                    <CircleHelp className="size-3.5 lg:hidden" />
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-white/8 dark:bg-[#0c111a]/90">
                    <div className="flex h-[4.5rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                            aria-label="Open navigation"
                        >
                            <Menu className="size-5" />
                        </button>

                        <div className="min-w-0 lg:w-64 lg:flex-none">
                            <h1 className="truncate text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                                {title}
                            </h1>
                        </div>

                        <label className="relative mx-auto hidden max-w-xl flex-1 md:block">
                            <span className="sr-only">
                                Search admin workspace
                            </span>
                            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                placeholder="Search vendors, users, categories, brands..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-14 pl-10 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-white/8 dark:bg-white/[0.04] dark:text-slate-200 dark:focus:border-orange-500/40 dark:focus:bg-white/[0.06]"
                            />
                            <span className="pointer-events-none absolute top-1/2 right-2.5 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-sm dark:border-white/10 dark:bg-white/5">
                                <Command className="size-3" />K
                            </span>
                        </label>

                        <Link
                            href={admin.vendors.index.url()}
                            className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-orange-500/20 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
                            aria-label="View vendor notifications"
                        >
                            <Bell className="size-[18px]" />
                            {pendingCount > 0 && (
                                <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-orange-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-[#0c111a]">
                                    {pendingCount > 9 ? '9+' : pendingCount}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white"
                            aria-label="Toggle color theme"
                        >
                            {dark ? (
                                <Sun className="size-[18px]" />
                            ) : (
                                <Moon className="size-[18px]" />
                            )}
                        </button>

                        <div className="hidden h-8 w-px bg-slate-200 xl:block dark:bg-white/8" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center gap-2.5 rounded-xl p-1 transition outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-orange-500/30 xl:pr-2 dark:hover:bg-white/5"
                                    aria-label="Open administrator menu"
                                >
                                    <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 text-xs font-bold text-white shadow-sm">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="hidden max-w-28 min-w-0 text-left xl:block">
                                        <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                                            {auth.user.name}
                                        </span>
                                        <span className="block truncate text-[10px] text-slate-400">
                                            Administrator
                                        </span>
                                    </span>
                                    <ChevronDown className="hidden size-3.5 text-slate-400 xl:block" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                sideOffset={8}
                                className="w-64 rounded-xl border-slate-200 p-2 shadow-xl dark:border-white/10"
                            >
                                <DropdownMenuLabel className="px-2 py-2 font-normal">
                                    <p className="truncate text-sm font-semibold">
                                        {auth.user.name}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                        {auth.user.email}
                                    </p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Form {...logout.form()}>
                                    {({ processing }) => (
                                        <DropdownMenuItem
                                            asChild
                                            variant="destructive"
                                        >
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-left"
                                                data-test="admin-logout-button"
                                            >
                                                <LogOut className="size-4" />
                                                {processing
                                                    ? 'Signing out...'
                                                    : 'Logout'}
                                            </button>
                                        </DropdownMenuItem>
                                    )}
                                </Form>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <div className="border-b border-slate-200/70 bg-white/60 dark:border-white/6 dark:bg-white/[0.015]">
                    <nav
                        className="mx-auto flex h-10 w-full max-w-[1500px] items-center gap-1.5 px-4 text-[11px] font-medium sm:px-6 lg:px-8"
                        aria-label="Breadcrumb"
                    >
                        <Link
                            href={admin.dashboard.url()}
                            prefetch
                            className="text-slate-400 transition hover:text-orange-600 dark:hover:text-orange-400"
                        >
                            Admin
                        </Link>
                        <ChevronRight className="size-3 text-slate-300 dark:text-slate-600" />
                        <span className="truncate text-slate-600 dark:text-slate-300">
                            {breadcrumb}
                        </span>
                    </nav>
                </div>

                <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
                    {flash?.success && (
                        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                            {flash.error}
                        </div>
                    )}
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                            {Object.values(errors)[0]}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
