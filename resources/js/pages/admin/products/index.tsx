import { Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Boxes,
    DollarSign,
    PackagePlus,
    Pencil,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
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
import productsRoutes from '@/routes/admin/products';
import type { Counts, Paginated, Product } from '@/types/admin';

type Option = { id: number; name: string };
type Props = {
    products: Paginated<Product>;
    counts: Counts;
    categories: Option[];
    statuses: string[];
};

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

export default function ProductsIndex({
    products,
    counts,
    categories,
    statuses,
}: Props) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const [stock, setStock] = useState(params.get('stock') ?? '');
    const [categoryId, setCategoryId] = useState(
        params.get('category_id') ?? '',
    );
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(
        null,
    );
    const [deleting, setDeleting] = useState(false);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            productsRoutes.index.url(),
            { search, status, stock, category_id: categoryId },
            { preserveState: true, replace: true },
        );
    };

    const cards = [
        {
            label: 'Total products',
            value: counts.total,
            icon: Boxes,
            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
        },
        {
            label: 'Published',
            value: counts.active,
            icon: PackagePlus,
            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
        },
        {
            label: 'Stock alerts',
            value: Number(counts.low_stock) + Number(counts.out_of_stock),
            icon: AlertTriangle,
            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
        },
        {
            label: 'Inventory value',
            value: money.format(counts.inventory_value),
            icon: DollarSign,
            tone: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10',
        },
    ];

    return (
        <AdminLayout
            title="Product Operations"
            breadcrumb="Catalogue / Products"
        >
            <AdminPageHeader
                title="Product catalogue"
                description="Control listings, pricing, visibility and inventory health."
                action={
                    <Link
                        href={productsRoutes.create.url()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
                    >
                        <PackagePlus className="size-4" />
                        Add product
                    </Link>
                }
            />

            <div className="mt-6">
                <StatCards cards={cards} />
            </div>

            <AdminPanel className="mt-6">
                <AdminFilterBar
                    onSubmit={submit}
                    className="lg:grid-cols-[minmax(15rem,1fr)_11rem_11rem_13rem_auto]"
                >
                    <label className="relative">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search product, SKU or slug"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All statuses</option>
                        {statuses.map((value) => (
                            <option key={value} value={value}>
                                {value[0].toUpperCase() + value.slice(1)}
                            </option>
                        ))}
                    </select>
                    <select
                        value={stock}
                        onChange={(event) => setStock(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All stock</option>
                        <option value="healthy">Healthy</option>
                        <option value="low">Low stock</option>
                        <option value="out">Out of stock</option>
                    </select>
                    <select
                        value={categoryId}
                        onChange={(event) => setCategoryId(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </AdminFilterBar>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-slate-50 text-[11px] tracking-wider text-slate-500 uppercase dark:bg-white/5">
                            <tr>
                                <th className="px-5 py-3">Product</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Inventory</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-5 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {products.data.map((product) => {
                                const low =
                                    product.stock <=
                                    product.low_stock_threshold;

                                return (
                                    <tr
                                        key={product.id}
                                        className="transition hover:bg-slate-50/70 dark:hover:bg-white/[0.03]"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 text-slate-400 dark:bg-white/10">
                                                    {product.primary_image ? (
                                                        <img
                                                            src={
                                                                product
                                                                    .primary_image
                                                                    .url
                                                            }
                                                            alt={product.name}
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <Boxes className="size-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold">
                                                        {product.name}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        SKU {product.sku}
                                                        {product.is_featured
                                                            ? ' · Featured'
                                                            : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            {product.category?.name ??
                                                'Uncategorised'}
                                            <span className="block text-xs text-slate-400">
                                                {product.brand?.name ??
                                                    'No brand'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-bold">
                                                {money.format(
                                                    Number(product.price),
                                                )}
                                            </p>
                                            {product.compare_at_price && (
                                                <p className="text-xs text-slate-400 line-through">
                                                    {money.format(
                                                        Number(
                                                            product.compare_at_price,
                                                        ),
                                                    )}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${low ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'}`}
                                            >
                                                {low && (
                                                    <AlertTriangle className="size-3" />
                                                )}
                                                {product.stock} units
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <AdminStatusBadge
                                                value={product.status}
                                            />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={productsRoutes.edit.url(
                                                        product.id,
                                                    )}
                                                    className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                                                    aria-label={`Edit ${product.name}`}
                                                >
                                                    <Pencil className="size-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeletingProduct(
                                                            product,
                                                        )
                                                    }
                                                    className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                                    aria-label={`Delete ${product.name}`}
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <AdminEmptyState
                                            icon={Boxes}
                                            title="No matching products"
                                            description="Adjust the catalogue filters or add a new product."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={products.links} />
            </AdminPanel>

            <AdminConfirmDialog
                open={deletingProduct !== null}
                title="Delete product?"
                description={`This will permanently remove ${deletingProduct?.name ?? 'this product'} from the catalogue. This action cannot be undone.`}
                confirmLabel="Delete product"
                processing={deleting}
                onOpenChange={(open) => {
                    if (!open && !deleting) {
                        setDeletingProduct(null);
                    }
                }}
                onConfirm={() => {
                    if (!deletingProduct) {
                        return;
                    }

                    setDeleting(true);
                    router.delete(
                        productsRoutes.destroy.url(deletingProduct.id),
                        {
                            preserveScroll: true,
                            onFinish: () => {
                                setDeleting(false);
                                setDeletingProduct(null);
                            },
                        },
                    );
                }}
            />
        </AdminLayout>
    );
}
