import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
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
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    ReceiptText,
    Search,
    Sparkles,
    ScrollText,
    ShieldCheck,
    ShoppingBag,
    Store,
    Tags,
    Truck,
    Undo2,
    Users,
    WalletCards,
    Warehouse,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
import type { AccountPermission } from '@/types/auth';

const navigationSections = [
    {
        label: 'Overview',
        icon: LayoutDashboard,
        items: [
            {
                label: 'Dashboard',
                href: admin.dashboard.url(),
                icon: LayoutDashboard,
                permission: 'admin.dashboard.view',
            },
            {
                label: 'Analytics',
                href: admin.analytics.url(),
                icon: BarChart3,
                permission: 'reports.view',
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
                permission: 'catalogue.manage',
            },
            {
                label: 'Categories',
                href: admin.categories.index.url(),
                icon: Boxes,
                permission: 'catalogue.manage',
            },
            {
                label: 'Brands',
                href: admin.brands.index.url(),
                icon: Tags,
                permission: 'catalogue.manage',
            },
            {
                label: 'Bulk Imports',
                href: admin.catalogImports.index.url(),
                icon: FileSpreadsheet,
                permission: 'catalogue.manage',
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
                permission: 'orders.manage',
            },
            {
                label: 'Promotions',
                href: admin.coupons.index.url(),
                icon: BadgePercent,
                permission: 'catalogue.manage',
            },
            {
                label: 'Reviews',
                href: admin.reviews.index.url(),
                icon: MessageSquareText,
                permission: 'catalogue.manage',
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
                permission: 'orders.manage',
            },
            {
                label: 'Warehouses',
                href: admin.warehouses.index.url(),
                icon: Warehouse,
                permission: 'catalogue.manage',
            },
            {
                label: 'Returns',
                href: admin.returns.index.url(),
                icon: Undo2,
                permission: 'orders.manage',
            },
            {
                label: 'Support',
                href: admin.support.index.url(),
                icon: Headphones,
                permission: 'support.requests.manage',
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
                permission: 'payments.manage',
            },
            {
                label: 'GST Invoices',
                href: admin.taxInvoices.index.url(),
                icon: ReceiptText,
                permission: 'payments.manage',
            },
            {
                label: 'Settlements',
                href: admin.settlements.index.url(),
                icon: Banknote,
                permission: 'payments.manage',
            },
        ],
    },
    {
        label: 'Accounts',
        icon: Users,
        items: [
            {
                label: 'Vendors',
                href: admin.vendors.index.url(),
                icon: Store,
                permission: 'vendors.manage',
            },
            {
                label: 'Users',
                href: admin.users.index.url(),
                icon: Users,
                permission: 'users.manage',
            },
            {
                label: 'Admin Roles',
                href: admin.adminRoles.index.url(),
                icon: ShieldCheck,
                permission: 'roles.manage',
            },
            {
                label: 'Audit Logs',
                href: admin.auditLogs.index.url(),
                icon: ScrollText,
                permission: 'reports.view',
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
    const grantedPermissions = new Set<AccountPermission>(auth.permissions);
    const permittedNavigationSections = navigationSections
        .map((section) => ({
            ...section,
            items: section.items.filter((item) =>
                grantedPermissions.has(item.permission as AccountPermission),
            ),
        }))
        .filter((section) => section.items.length > 0);
    const activeSectionLabel = permittedNavigationSections.find((section) =>
        section.items.some(
            (item) =>
                currentPath === item.href ||
                (item.href !== admin.dashboard.url() &&
                    currentPath.startsWith(item.href)),
        ),
    )?.label;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
        typeof window === 'undefined'
            ? false
            : window.localStorage.getItem('admin-sidebar-collapsed') === 'true',
    );
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearchIndex, setActiveSearchIndex] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [openSection, setOpenSection] = useState<string | null>(
        activeSectionLabel ?? 'Overview',
    );
    const pendingCount = Number(pendingVendorCount ?? 0);
    const searchableNavigation = permittedNavigationSections.flatMap(
        (section) =>
            section.items.map((item) => ({
                ...item,
                section: section.label,
            })),
    );
    const searchResults = (() => {
        const query = searchQuery.trim().toLowerCase();

        if (query === '') {
            return searchableNavigation.slice(0, 8);
        }

        return searchableNavigation
            .filter((item) =>
                `${item.label} ${item.section}`.toLowerCase().includes(query),
            )
            .slice(0, 8);
    })();

    const closeSearch = () => {
        setSearchOpen(false);
        setSearchQuery('');
        setActiveSearchIndex(0);
    };

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setSearchOpen(true);
            }

            if (event.key === 'Escape') {
                setSidebarOpen(false);
                setSearchOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const restoreDarkTheme = root.classList.contains('dark');

        root.classList.remove('dark');

        return () => {
            if (restoreDarkTheme) {
                root.classList.add('dark');
            }
        };
    }, []);

    useEffect(() => {
        window.localStorage.setItem(
            'admin-sidebar-collapsed',
            String(sidebarCollapsed),
        );
    }, [sidebarCollapsed]);

    useEffect(() => {
        if (searchOpen) {
            window.setTimeout(() => searchInputRef.current?.focus(), 0);
        }
    }, [searchOpen]);

    return (
        <div
            data-admin-shell
            className="min-h-screen bg-commerce-canvas font-sans text-commerce-ink antialiased lg:flex"
        >
            <Head title={title} />

            {searchOpen && (
                <div
                    className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/60 px-4 pt-[12vh] backdrop-blur-sm"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeSearch();
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-label="Search admin workspace"
                        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl shadow-slate-950/25 dark:border-white/10 dark:bg-[#111722]"
                    >
                        <div className="flex items-center gap-3 border-b border-slate-200 px-5 dark:border-white/8">
                            <Search className="size-5 shrink-0 text-orange-500" />
                            <input
                                ref={searchInputRef}
                                type="search"
                                value={searchQuery}
                                onChange={(event) => {
                                    setSearchQuery(event.target.value);
                                    setActiveSearchIndex(0);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'ArrowDown') {
                                        event.preventDefault();
                                        setActiveSearchIndex((index) =>
                                            Math.min(
                                                index + 1,
                                                Math.max(
                                                    searchResults.length - 1,
                                                    0,
                                                ),
                                            ),
                                        );
                                    }

                                    if (event.key === 'ArrowUp') {
                                        event.preventDefault();
                                        setActiveSearchIndex((index) =>
                                            Math.max(index - 1, 0),
                                        );
                                    }

                                    if (
                                        event.key === 'Enter' &&
                                        searchResults[activeSearchIndex]
                                    ) {
                                        event.preventDefault();
                                        router.visit(
                                            searchResults[activeSearchIndex]
                                                .href,
                                        );
                                        closeSearch();
                                    }
                                }}
                                placeholder="Search pages and operations..."
                                aria-controls="admin-search-results"
                                aria-activedescendant={
                                    searchResults[activeSearchIndex]
                                        ? `admin-search-result-${activeSearchIndex}`
                                        : undefined
                                }
                                className="h-16 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                onClick={closeSearch}
                                className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-400 dark:border-white/10"
                            >
                                ESC
                            </button>
                        </div>
                        <div className="max-h-[26rem] overflow-y-auto p-2">
                            <p className="px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                                {searchQuery
                                    ? 'Search results'
                                    : 'Quick access'}
                            </p>
                            <div
                                id="admin-search-results"
                                role="listbox"
                                className="grid gap-1"
                            >
                                {searchResults.map((item, index) => {
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            id={`admin-search-result-${index}`}
                                            role="option"
                                            aria-selected={
                                                activeSearchIndex === index
                                            }
                                            href={item.href}
                                            prefetch
                                            onClick={closeSearch}
                                            onMouseEnter={() =>
                                                setActiveSearchIndex(index)
                                            }
                                            className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition ${activeSearchIndex === index ? 'bg-orange-50 ring-1 ring-orange-100 dark:bg-orange-500/10 dark:ring-orange-500/20' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                        >
                                            <span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-orange-100 group-hover:text-orange-600 dark:bg-white/5 dark:text-slate-400 dark:group-hover:bg-orange-500/10 dark:group-hover:text-orange-300">
                                                <Icon className="size-[18px]" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-semibold">
                                                    {item.label}
                                                </span>
                                                <span className="block text-xs text-slate-400">
                                                    {item.section}
                                                </span>
                                            </span>
                                            <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-orange-500" />
                                        </Link>
                                    );
                                })}
                                {searchResults.length === 0 && (
                                    <div className="px-6 py-12 text-center">
                                        <Search className="mx-auto size-8 text-slate-300" />
                                        <p className="mt-3 text-sm font-semibold">
                                            No matching admin pages
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Try a page name such as orders,
                                            users, or products.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <footer className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-[10px] font-medium text-slate-400 dark:border-white/6 dark:bg-white/[0.025]">
                            <span>Only permitted destinations are shown</span>
                            <span className="flex items-center gap-1.5">
                                <Sparkles className="size-3 text-orange-500" />
                                Velora command centre
                            </span>
                        </footer>
                    </section>
                </div>
            )}

            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close navigation"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col border-r border-white/8 bg-commerce-navy text-white shadow-2xl transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 lg:shadow-none ${sidebarCollapsed ? 'lg:w-[5.5rem]' : 'lg:w-[17.5rem]'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -left-16 size-52 rounded-full bg-orange-500/10 blur-3xl" />
                    <div className="absolute right-0 bottom-20 size-40 rounded-full bg-commerce-gold/5 blur-3xl" />
                </div>
                <div
                    className={`relative flex h-[4.75rem] items-center px-5 ${sidebarCollapsed ? 'lg:justify-center lg:px-3' : 'justify-between'}`}
                >
                    <Link
                        href={admin.dashboard.url()}
                        className="flex min-w-0 items-center gap-3"
                    >
                        <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-commerce-brand to-orange-600 text-lg font-black text-white shadow-lg ring-1 shadow-orange-950/30 ring-white/20">
                            V
                            <span className="absolute -right-2 -bottom-2 size-5 rounded-full bg-commerce-gold/90" />
                        </span>
                        <span
                            className={`min-w-0 ${sidebarCollapsed ? 'lg:hidden' : ''}`}
                        >
                            <span className="block truncate text-[17px] font-bold tracking-tight">
                                Velora
                            </span>
                            <span className="block truncate text-[9px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                                Premium Commerce
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
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.065] p-4 shadow-inner shadow-white/[0.025]">
                        <div className="absolute -top-8 -right-6 size-20 rounded-full bg-commerce-gold/15 blur-2xl" />
                        <div className="relative flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
                                    Storefront status
                                </p>
                                <p className="mt-1.5 text-sm font-semibold">
                                    Online & accepting orders
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
                        {permittedNavigationSections.map((section) => {
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
                    {!sidebarCollapsed && <span>Velora Commerce Suite</span>}
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
                <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/88 shadow-[0_1px_0_rgb(255_255_255/0.8)] backdrop-blur-xl">
                    <div className="flex h-[4.75rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                            aria-label="Open navigation"
                        >
                            <Menu className="size-5" />
                        </button>

                        <div className="min-w-0 lg:w-64 lg:flex-none">
                            <p className="hidden text-[9px] font-bold tracking-[0.16em] text-orange-600 uppercase lg:block">
                                Commerce command center
                            </p>
                            <h1 className="truncate text-lg font-bold tracking-tight text-commerce-ink">
                                {title}
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            className="relative mx-auto hidden h-10 max-w-xl flex-1 items-center rounded-xl border border-slate-200/80 bg-slate-50/80 pr-14 pl-10 text-left text-sm text-slate-400 shadow-inner shadow-slate-950/[0.015] transition hover:border-orange-200 hover:bg-white hover:shadow-sm md:flex"
                        >
                            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                            Search pages and operations...
                            <span className="pointer-events-none absolute top-1/2 right-2.5 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-sm dark:border-white/10 dark:bg-white/5">
                                <Command className="size-3" />K
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 md:hidden dark:border-white/10 dark:bg-white/5 dark:hover:border-orange-500/20 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
                            aria-label="Search admin workspace"
                        >
                            <Search className="size-[18px]" />
                        </button>

                        {grantedPermissions.has('vendors.manage') && (
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
                        )}

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

                <div className="border-b border-slate-200/60 bg-white/55 backdrop-blur-sm">
                    <nav
                        className="mx-auto flex h-10 w-full max-w-[1560px] items-center gap-1.5 px-4 text-[11px] font-medium sm:px-6 lg:px-8"
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

                <main className="relative mx-auto w-full max-w-[1560px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
