import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowDownUp,
    BarChart3,
    BadgePercent,
    Banknote,
    Bell,
    Boxes,
    ChevronDown,
    ChevronRight,
    CircleHelp,
    CircleDollarSign,
    FileSpreadsheet,
    Command,
    LayoutDashboard,
    Layers3,
    LogOut,
    Menu,
    MapPinned,
    MessageSquareText,
    Headphones,
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    Plug,
    ReceiptText,
    Search,
    Sparkles,
    ScrollText,
    ShieldCheck,
    Settings2,
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

const dashboardSection = (section: string) =>
    `${admin.dashboard.url()}#${section}`;

const navigationSections = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        items: [
            {
                label: 'Business Overview',
                href: admin.dashboard.url(),
                icon: LayoutDashboard,
                permission: 'admin.dashboard.view',
                searchText:
                    'dashboard today orders gmv revenue active sellers pending approvals returns low stock fulfilment performance activities',
            },
            {
                label: 'Today’s Orders',
                href: dashboardSection('todays-orders'),
                icon: ShoppingBag,
                permission: 'admin.dashboard.view',
            },
            {
                label: 'GMV and Net Revenue',
                href: dashboardSection('gross-merchandise-value'),
                icon: CircleDollarSign,
                permission: 'admin.dashboard.view',
                searchText:
                    'gross merchandise value gmv net revenue sales finance',
            },
            {
                label: 'Active Sellers',
                href: dashboardSection('active-sellers'),
                icon: Store,
                permission: 'admin.dashboard.view',
            },
            {
                label: 'Pending Approvals',
                href: dashboardSection('pending-approvals'),
                icon: ShieldCheck,
                permission: 'admin.dashboard.view',
            },
            {
                label: 'Returns Summary',
                href: dashboardSection('returns-summary'),
                icon: Undo2,
                permission: 'admin.dashboard.view',
            },
            {
                label: 'Low-stock Alerts',
                href: dashboardSection('low-stock-alerts'),
                icon: Boxes,
                permission: 'admin.dashboard.view',
            },
            {
                label: 'Fulfilment Performance',
                href: dashboardSection('fulfilment-performance'),
                icon: Truck,
                permission: 'admin.dashboard.view',
            },
            {
                label: 'Recent Activities',
                href: dashboardSection('recent-activities'),
                icon: ScrollText,
                permission: 'admin.dashboard.view',
            },
        ],
    },
    {
        label: 'Seller Management',
        icon: Store,
        items: [
            {
                label: 'All Sellers',
                href: admin.vendors.index.url(),
                icon: Store,
                permission: 'vendors.manage',
                searchText:
                    'seller management vendors merchants directory all sellers',
            },
            {
                label: 'Add Seller',
                href: admin.vendors.create.url(),
                icon: Users,
                permission: 'vendors.manage',
                searchText: 'create invite onboard new seller',
            },
            {
                label: 'Seller Applications',
                href: admin.vendors.index.url({
                    query: { status: 'pending', view: 'applications' },
                }),
                icon: FileSpreadsheet,
                permission: 'vendors.manage',
                searchText: 'onboarding applications review queue',
            },
            {
                label: 'KYC Verification',
                href: admin.vendors.index.url({
                    query: { kyc_status: 'in_review' },
                }),
                icon: ShieldCheck,
                permission: 'vendors.manage',
                badge: 'Review',
                searchText:
                    'documents identity gst pan bank proof verification',
            },
            {
                label: 'Approved / Rejected / Suspended Sellers',
                href: admin.vendors.index.url({
                    query: { view: 'status' },
                }),
                icon: Store,
                permission: 'vendors.manage',
                searchText:
                    'approved rejected suspended sellers status moderation',
            },
            {
                label: 'Seller Documents',
                href: admin.vendors.index.url({
                    query: { kyc_status: 'in_review', view: 'documents' },
                }),
                icon: ScrollText,
                permission: 'vendors.manage',
                searchText: 'kyc document checklist files',
            },
            {
                label: 'Bank Accounts',
                href: admin.vendors.index.url({
                    query: { view: 'bank-accounts' },
                }),
                icon: WalletCards,
                permission: 'payments.manage',
                searchText: 'beneficiary ifsc payout account banking',
            },
            {
                label: 'Warehouses',
                href: admin.warehouses.index.url({
                    query: { view: 'sellers' },
                }),
                icon: Warehouse,
                permission: 'catalogue.manage',
            },
            {
                label: 'Performance Score',
                href: admin.growthCentre.url({
                    query: { view: 'seller-performance' },
                }),
                icon: BarChart3,
                permission: 'reports.view',
                searchText:
                    'seller sales returns activity quality performance score',
            },
            {
                label: 'Violations',
                href: admin.vendors.index.url({
                    query: { risk_level: 'high', view: 'violations' },
                }),
                icon: ShieldCheck,
                permission: 'vendors.manage',
                searchText: 'risk fraud policy penalties violations',
            },
            {
                label: 'Agreements',
                href: admin.vendors.index.url({
                    query: { view: 'agreements' },
                }),
                icon: ReceiptText,
                permission: 'vendors.manage',
            },
            {
                label: 'Subscriptions',
                href: admin.vendors.index.url({
                    query: { view: 'subscriptions' },
                }),
                icon: BadgePercent,
                permission: 'vendors.manage',
            },
        ],
    },
    {
        label: 'Catalogue Management',
        icon: Package,
        items: [
            {
                label: 'All Products',
                href: admin.products.index.url(),
                icon: Package,
                permission: 'catalogue.manage',
                searchText: 'catalog products sku listing content',
            },
            {
                label: 'Add Product',
                href: admin.products.create.url(),
                icon: Package,
                permission: 'catalogue.manage',
                searchText: 'create new product catalogue item sku',
            },
            {
                label: 'Listing Requests',
                href: admin.sellerListings.index.url({
                    query: { view: 'requests' },
                }),
                icon: FileSpreadsheet,
                permission: 'catalogue.manage',
                searchText: 'seller listing applications review requests',
            },
            {
                label: 'Pending / Approved / Rejected Listings',
                href: admin.sellerListings.index.url({
                    query: { view: 'status' },
                }),
                icon: Layers3,
                permission: 'catalogue.manage',
                searchText: 'listing status pending approved rejected',
            },
            {
                label: 'Quality Check',
                href: admin.sellerListings.index.url({
                    query: { view: 'quality-check' },
                }),
                icon: ShieldCheck,
                permission: 'catalogue.manage',
                searchText: 'listing content image data quality validation',
            },
            {
                label: 'Product Moderation',
                href: admin.sellerListings.index.url({
                    query: { view: 'moderation' },
                }),
                icon: ShieldCheck,
                permission: 'catalogue.manage',
                searchText: 'approve block restrict product listing moderation',
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
                label: 'Attributes',
                href: admin.productVariants.index.url({
                    query: { view: 'attributes' },
                }),
                icon: Tags,
                permission: 'catalogue.manage',
                searchText: 'product attributes options size colour material',
            },
            {
                label: 'Variants',
                href: admin.productVariants.index.url(),
                icon: Layers3,
                permission: 'catalogue.manage',
                searchText: 'product options size color variant sku',
            },
            {
                label: 'Specifications',
                href: admin.products.index.url({
                    query: { view: 'specifications' },
                }),
                icon: ScrollText,
                permission: 'catalogue.manage',
                searchText: 'product technical details specifications',
            },
            {
                label: 'Media',
                href: admin.products.index.url({
                    query: { view: 'media' },
                }),
                icon: FileSpreadsheet,
                permission: 'catalogue.manage',
                searchText: 'product images video gallery media',
            },
            {
                label: 'Bundles',
                href: admin.products.index.url({
                    query: { view: 'bundles' },
                }),
                icon: Boxes,
                permission: 'catalogue.manage',
                searchText: 'product bundle combo kit grouped products',
            },
            {
                label: 'Bulk Upload',
                href: admin.catalogImports.index.url({
                    query: { view: 'upload' },
                }),
                icon: FileSpreadsheet,
                permission: 'catalogue.manage',
                searchText: 'csv excel bulk product upload catalogue import',
            },
            {
                label: 'Import / Export',
                href: admin.catalogImports.index.url({
                    query: { view: 'import-export' },
                }),
                icon: ArrowDownUp,
                permission: 'catalogue.manage',
                searchText: 'csv excel catalogue data import export download',
            },
            {
                label: 'Duplicate Detection',
                href: admin.products.index.url({
                    query: { view: 'duplicates' },
                }),
                icon: Search,
                permission: 'catalogue.manage',
                searchText:
                    'duplicate similar matching product detection merge',
            },
        ],
    },
    {
        label: 'Pricing & Offers',
        icon: BadgePercent,
        items: [
            {
                label: 'Pricing Intelligence',
                href: admin.growthCentre.url(),
                icon: BarChart3,
                permission: 'reports.view',
                badge: 'AI',
                searchText:
                    'growth pricing recommendations intelligence price approvals dynamic pricing mrp special scheduled prices deal zone flash festival sales',
            },
        ],
    },
    {
        label: 'Orders',
        icon: ShoppingBag,
        items: [
            {
                label: 'Order Management',
                href: admin.orders.index.url(),
                icon: ShoppingBag,
                permission: 'orders.manage',
                badge: 'Live',
                searchText:
                    'all new confirmed ready pack packed dispatch shipped delivery delivered cancelled failed hold fraud bulk processing timeline exceptions sales purchases',
            },
        ],
    },
    {
        label: 'Inventory',
        icon: ArrowDownUp,
        items: [
            {
                label: 'Inventory Control',
                href: admin.inventoryOperations.index.url(),
                icon: ArrowDownUp,
                permission: 'catalogue.manage',
                badge: 'Live',
                searchText:
                    'inventory overview seller warehouse available reserved damaged low stock out of stock adjustments transfers reconciliation history import export alerts stock ledger movements',
            },
        ],
    },
    {
        label: 'Warehouses & Fulfilment',
        icon: Warehouse,
        items: [
            {
                label: 'Warehouses',
                href: admin.warehouses.index.url(),
                icon: Warehouse,
                permission: 'catalogue.manage',
                searchText:
                    'all seller warehouses fulfilment centres pickup locations picklists packing lists dispatch batches shipping labels manifest handover sla delays exceptions',
            },
        ],
    },
    {
        label: 'Logistics',
        icon: Truck,
        items: [
            {
                label: 'Shipments',
                href: admin.shipments.index.url(),
                icon: Truck,
                permission: 'orders.manage',
                searchText:
                    'all shipments courier partners shipping methods zones rates hubs pickup tracking delivery attempts undelivered lost damaged sla reverse logistics fulfilment dispatch carrier',
            },
            {
                label: 'Delivery Coverage',
                href: admin.serviceAreas.index.url(),
                icon: MapPinned,
                permission: 'catalogue.manage',
                badge: 'Pincode',
                searchText:
                    'pincode serviceable serviceability zones shipping rates cod express delivery',
            },
        ],
    },
    {
        label: 'Returns, RTO & Refunds',
        icon: Undo2,
        items: [
            {
                label: 'Returns & Claims',
                href: admin.returns.index.url(),
                icon: Undo2,
                permission: 'orders.manage',
                searchText:
                    'return requests pending approved rejected pickup returned replacements return origin rto reasons disputes policies analytics claims rma reverse logistics',
            },
            {
                label: 'Refund Operations',
                href: admin.paymentRefunds.index.url(),
                icon: CircleDollarSign,
                permission: 'payments.manage',
                badge: 'Live',
                searchText:
                    'refund requests pending processed partial refunds approval reconciliation payment gateway',
            },
        ],
    },
    {
        label: 'Payments & Settlements',
        icon: WalletCards,
        items: [
            {
                label: 'Payment Transactions',
                href: admin.payments.index.url(),
                icon: WalletCards,
                permission: 'payments.manage',
                searchText:
                    'payments transactions gateways reconciliation payout collection charges',
            },
            {
                label: 'Seller Settlements',
                href: admin.settlements.index.url(),
                icon: Banknote,
                permission: 'payments.manage',
                searchText:
                    'upcoming completed held settlements payouts commission marketplace fees penalties reconciliation',
            },
            {
                label: 'GST Invoices',
                href: admin.taxInvoices.index.url(),
                icon: ReceiptText,
                permission: 'payments.manage',
                searchText:
                    'invoices credit debit notes tds gst reports tax documents',
            },
        ],
    },
    {
        label: 'Customers',
        icon: Users,
        items: [
            {
                label: 'Customers & Staff',
                href: admin.users.index.url(),
                icon: Users,
                permission: 'users.manage',
                searchText:
                    'all active new blocked customers addresses groups segments orders returns wishlist carts wallet loyalty login history complaints risk profile users staff agents accounts',
            },
        ],
    },
    {
        label: 'Marketing & Advertising',
        icon: Sparkles,
        items: [
            {
                label: 'Promotions & Coupons',
                href: admin.coupons.index.url(),
                icon: BadgePercent,
                permission: 'catalogue.manage',
                searchText:
                    'marketing advertising dashboard campaigns sponsored banner seller ads coupons promotions festival email sms push abandoned carts referral affiliate segments performance offers discounts',
            },
        ],
    },
    {
        label: 'Reviews & Questions',
        icon: MessageSquareText,
        items: [
            {
                label: 'Ratings & Reviews',
                href: admin.reviews.index.url(),
                icon: MessageSquareText,
                permission: 'catalogue.manage',
                searchText:
                    'product seller reviews pending approved rejected reported questions answers moderation analytics quality customer feedback',
            },
        ],
    },
    {
        label: 'Customer Support',
        icon: Headphones,
        items: [
            {
                label: 'Support & Disputes',
                href: admin.support.index.url(),
                icon: Headphones,
                permission: 'support.requests.manage',
                searchText:
                    'support dashboard customer seller tickets order payment delivery return complaints escalated priorities agents canned responses sla dispute resolution cases messages',
            },
        ],
    },
    {
        label: 'Reports & Analytics',
        icon: BarChart3,
        items: [
            {
                label: 'Marketplace Analytics',
                href: admin.analytics.url(),
                icon: BarChart3,
                permission: 'reports.view',
                searchText:
                    'sales orders revenue products categories brands sellers customers inventory fulfilment logistics returns rto refunds settlements commission tax campaigns conversion profitability custom report builder',
            },
        ],
    },
    {
        label: 'Administration',
        icon: ShieldCheck,
        items: [
            {
                label: 'Notifications',
                href: admin.notifications.index.url(),
                icon: Bell,
                permission: 'roles.manage',
                searchText:
                    'admin seller customer notifications email sms push whatsapp templates rules history failed notifications',
            },
            {
                label: 'Administration Overview',
                href: admin.administration.url(),
                icon: ShieldCheck,
                permission: 'roles.manage',
                searchText:
                    'admin users teams departments roles permissions approval workflows activity logs login history audit logs api users access tokens two factor authentication ip restrictions governance',
            },
            {
                label: 'Integrations',
                href: admin.integrations.index.url(),
                icon: Plug,
                permission: 'roles.manage',
                searchText:
                    'payment gateways shipping partners sms email whatsapp gst erp crm analytics social login oauth api credentials webhooks integration logs',
            },
            {
                label: 'System Settings',
                href: admin.systemSettings.index.url(),
                icon: Settings2,
                permission: 'roles.manage',
                searchText:
                    'general marketplace seller product order inventory return commission payment shipping tax currency language country seo cache queue scheduled jobs database backup maintenance mode system logs',
            },
            {
                label: 'Roles & Permissions',
                href: admin.adminRoles.index.url(),
                icon: ShieldCheck,
                permission: 'roles.manage',
                searchText:
                    'admin users teams departments roles permissions approval workflows access control 2fa ip restrictions',
            },
            {
                label: 'Audit Logs',
                href: admin.auditLogs.index.url(),
                icon: ScrollText,
                permission: 'reports.view',
                searchText:
                    'activity logs login history audit logs api users access tokens administration governance',
            },
        ],
    },
];

const navigationSectionOrder = [
    'Dashboard',
    'Marketplace / Sellers',
    'Catalogue',
    'Listings',
    'Pricing & Offers',
    'Orders',
    'Inventory',
    'Warehouses & Fulfilment',
    'Logistics',
    'Returns, RTO & Refunds',
    'Payments & Settlements',
    'Customers',
    'Marketing & Advertising',
    'Reviews & Questions',
    'Customer Support',
    'Reports & Analytics',
    'Administration',
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
    const currentPath = url.split(/[?#]/)[0];
    const grantedPermissions = new Set<AccountPermission>(auth.permissions);
    const permittedNavigationSections = navigationSections
        .map((section) => ({
            ...section,
            items: section.items.filter((item) =>
                grantedPermissions.has(item.permission as AccountPermission),
            ),
        }))
        .filter((section) => section.items.length > 0)
        .sort(
            (first, second) =>
                navigationSectionOrder.indexOf(first.label) -
                navigationSectionOrder.indexOf(second.label),
        );
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
        typeof window === 'undefined'
            ? false
            : window.localStorage.getItem('admin-sidebar-collapsed') === 'true',
    );
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarQuery, setSidebarQuery] = useState('');
    const [activeSearchIndex, setActiveSearchIndex] = useState(0);
    const [activeHash, setActiveHash] = useState(() =>
        typeof window === 'undefined' ? '' : window.location.hash,
    );
    const [isDesktop, setIsDesktop] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const isNavigationItemActive = (item: { href: string }) => {
        const [itemUrl, itemHash = ''] = item.href.split('#');
        const [itemPath, itemQuery = ''] = itemUrl.split('?');
        const [currentUrl] = url.split('#');

        if (itemHash !== '') {
            return currentPath === itemPath && activeHash === `#${itemHash}`;
        }

        if (itemQuery !== '') {
            return currentUrl === itemUrl;
        }

        return (
            (currentPath === itemPath &&
                currentUrl === itemPath &&
                activeHash === '') ||
            (itemPath !== admin.dashboard.url() &&
                currentPath.startsWith(`${itemPath}/`))
        );
    };
    const activeSectionLabel = permittedNavigationSections.find((section) =>
        section.items.some(isNavigationItemActive),
    )?.label;
    const [openSection, setOpenSection] = useState<string | null>(
        activeSectionLabel ?? 'Dashboard',
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
            .filter((item) => {
                const searchText = 'searchText' in item ? item.searchText : '';

                return `${item.label} ${item.section} ${searchText}`
                    .toLowerCase()
                    .includes(query);
            })
            .slice(0, 8);
    })();
    const normalizedSidebarQuery = sidebarQuery.trim().toLowerCase();
    const visibleNavigationSections = permittedNavigationSections
        .map((section) => {
            if (normalizedSidebarQuery === '') {
                return section;
            }

            const sectionMatches = section.label
                .toLowerCase()
                .includes(normalizedSidebarQuery);

            return {
                ...section,
                items: sectionMatches
                    ? section.items
                    : section.items.filter((item) => {
                          const searchText =
                              'searchText' in item ? item.searchText : '';

                          return `${item.label} ${searchText}`
                              .toLowerCase()
                              .includes(normalizedSidebarQuery);
                      }),
            };
        })
        .filter((section) => section.items.length > 0);

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
        const desktopMedia = window.matchMedia('(min-width: 1024px)');
        const updateDesktopState = () => setIsDesktop(desktopMedia.matches);
        const updateHash = () => setActiveHash(window.location.hash);

        updateDesktopState();
        updateHash();
        desktopMedia.addEventListener('change', updateDesktopState);
        window.addEventListener('hashchange', updateHash);

        return () => {
            desktopMedia.removeEventListener('change', updateDesktopState);
            window.removeEventListener('hashchange', updateHash);
        };
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
                    className={`px-3 pb-3 ${sidebarCollapsed ? 'lg:hidden' : ''}`}
                >
                    <label className="relative block">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
                        <input
                            type="search"
                            value={sidebarQuery}
                            onChange={(event) =>
                                setSidebarQuery(event.target.value)
                            }
                            placeholder="Filter navigation..."
                            aria-label="Filter admin navigation"
                            className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.055] pr-9 pl-9 text-xs text-white transition outline-none placeholder:text-slate-500 focus:border-orange-400/30 focus:bg-white/[0.08] focus:ring-2 focus:ring-orange-400/10"
                        />
                        {sidebarQuery && (
                            <button
                                type="button"
                                onClick={() => setSidebarQuery('')}
                                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
                                aria-label="Clear navigation filter"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </label>
                    <div className="mt-2 flex items-center justify-between gap-3 px-1 text-[10px] font-semibold text-slate-500">
                        <span className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.1)]" />
                            Storefront online
                        </span>
                        {pendingCount > 0 && (
                            <span className="text-amber-300">
                                {pendingCount} seller pending
                            </span>
                        )}
                    </div>
                </div>

                <nav className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto px-3 pb-5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="grid gap-1.5">
                        {visibleNavigationSections.map((section) => {
                            const sectionActive =
                                activeSectionLabel === section.label;
                            const SectionIcon = section.icon;
                            const compactSidebar =
                                isDesktop && sidebarCollapsed;

                            if (compactSidebar) {
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
                                        {section.label ===
                                            'Marketplace / Sellers' &&
                                            pendingCount > 0 && (
                                                <span className="absolute top-2 right-2 size-2 rounded-full bg-amber-400 ring-2 ring-[#111827] dark:ring-[#0d121c]" />
                                            )}
                                    </button>
                                );
                            }

                            if (section.items.length === 1) {
                                const item = section.items[0];
                                const active = isNavigationItemActive(item);

                                return (
                                    <Link
                                        key={section.label}
                                        href={item.href}
                                        prefetch
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? 'bg-[#f97316] text-white shadow-lg shadow-orange-950/20' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'}`}
                                    >
                                        <span
                                            className={`grid size-8 place-items-center rounded-lg transition ${active ? 'bg-white/15 text-white' : 'text-slate-500 group-hover:text-slate-200'}`}
                                        >
                                            <SectionIcon className="size-[18px]" />
                                        </span>
                                        <span className="min-w-0 flex-1 truncate text-left">
                                            {normalizedSidebarQuery
                                                ? item.label
                                                : section.label}
                                        </span>
                                        {'badge' in item && (
                                            <span
                                                className={`rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-wide uppercase ${active ? 'bg-white/20 text-white' : 'bg-orange-400/10 text-orange-300'}`}
                                            >
                                                {String(item.badge)}
                                            </span>
                                        )}
                                        {active && (
                                            <ChevronRight className="size-3.5 text-orange-100" />
                                        )}
                                    </Link>
                                );
                            }

                            return (
                                <Collapsible
                                    key={section.label}
                                    open={
                                        normalizedSidebarQuery !== '' ||
                                        openSection === section.label
                                    }
                                    onOpenChange={(open) => {
                                        if (normalizedSidebarQuery === '') {
                                            setOpenSection(
                                                open ? section.label : null,
                                            );
                                        }
                                    }}
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
                                        {section.label ===
                                            'Marketplace / Sellers' &&
                                            pendingCount > 0 && (
                                                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                                                    {pendingCount > 99
                                                        ? '99+'
                                                        : pendingCount}
                                                </span>
                                            )}
                                        {section.label !==
                                            'Marketplace / Sellers' && (
                                            <span className="rounded-full bg-white/[0.055] px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                                                {section.items.length}
                                            </span>
                                        )}
                                        <ChevronDown className="size-4 shrink-0 text-slate-500 transition-transform duration-200 group-hover:text-slate-300 group-data-[state=open]:rotate-180" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="overflow-hidden">
                                        <div className="mt-1 ml-7 grid gap-1 border-l border-white/8 pl-3">
                                            {section.items.map((item) => {
                                                const active =
                                                    isNavigationItemActive(
                                                        item,
                                                    );
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
                                                        className={`group flex items-center gap-2.5 rounded-lg px-2.5 font-medium transition ${section.items.length > 8 ? 'py-1.5 text-xs' : 'py-2 text-[13px]'} ${active ? 'bg-[#f97316] text-white shadow-md shadow-orange-950/20' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'}`}
                                                    >
                                                        <Icon
                                                            className={`size-4 shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-200'}`}
                                                        />
                                                        <span className="min-w-0 flex-1 truncate">
                                                            {item.label}
                                                        </span>
                                                        {item.label ===
                                                            'Pending Approvals' &&
                                                        pendingCount > 0 ? (
                                                            <span
                                                                className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${active ? 'bg-white text-orange-600' : 'bg-amber-400 text-slate-950'}`}
                                                            >
                                                                {pendingCount >
                                                                99
                                                                    ? '99+'
                                                                    : pendingCount}
                                                            </span>
                                                        ) : 'badge' in item ? (
                                                            <span
                                                                className={`rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-wide uppercase ${active ? 'bg-white/20 text-white' : 'bg-orange-400/10 text-orange-300'}`}
                                                            >
                                                                {String(
                                                                    item.badge,
                                                                )}
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
                        {visibleNavigationSections.length === 0 && (
                            <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
                                <Search className="mx-auto size-5 text-slate-600" />
                                <p className="mt-2 text-xs font-semibold text-slate-400">
                                    No navigation matches
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSidebarQuery('')}
                                    className="mt-2 text-[10px] font-bold text-orange-400"
                                >
                                    Clear filter
                                </button>
                            </div>
                        )}
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
