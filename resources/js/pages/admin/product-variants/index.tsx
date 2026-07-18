import { Link, router } from '@inertiajs/react';
import {
    Layers3,
    PackageCheck,
    PackageX,
    Pencil,
    Plus,
    Search,
    Trash2,
    TriangleAlert,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import variantRoutes from '@/routes/admin/product-variants';
import type { Counts, Paginated, ProductVariant } from '@/types/admin';

type ProductOption = { id: number; name: string; sku: string };
type Props = {
    variants: Paginated<ProductVariant>;
    counts: Counts;
    products: ProductOption[];
};

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

export default function ProductVariantsIndex({
    variants,
    counts,
    products,
}: Props) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const [productId, setProductId] = useState(params.get('product_id') ?? '');

    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            variantRoutes.index.url(),
            { search, status, product_id: productId },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout
            title="Product Variants"
            breadcrumb="Catalogue / Product variants"
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-black">Variant catalogue</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage purchasable combinations, pricing and stock for
                        every product.
                    </p>
                </div>
                <Link
                    href={variantRoutes.create.url()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white"
                >
                    <Plus className="size-4" />
                    New variant
                </Link>
            </div>

            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Variants',
                            value: counts.total,
                            icon: Layers3,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Active',
                            value: counts.active,
                            icon: PackageCheck,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                        {
                            label: 'Low stock',
                            value: counts.low_stock,
                            icon: TriangleAlert,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'Out of stock',
                            value: counts.out_of_stock,
                            icon: PackageX,
                            tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
                        },
                    ]}
                />
            </div>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[minmax(0,1fr)_14rem_11rem_auto] dark:border-white/10"
                >
                    <label className="relative">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search variant, SKU or product"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <select
                        value={productId}
                        onChange={(event) => setProductId(event.target.value)}
                        className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All products</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button className="h-10 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase dark:bg-white/5">
                            <tr>
                                <th className="px-5 py-3">Variant</th>
                                <th className="px-4 py-3">Options</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-5 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {variants.data.map((variant) => (
                                <tr key={variant.id}>
                                    <td className="px-5 py-4">
                                        <p className="font-bold">
                                            {variant.name}
                                            {variant.is_default && (
                                                <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                                                    Default
                                                </span>
                                            )}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {variant.product?.name} ·{' '}
                                            {variant.sku}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {variant.attributes.map(
                                                (attribute) => (
                                                    <span
                                                        key={attribute.name}
                                                        className="rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-white/10"
                                                    >
                                                        {attribute.name}:{' '}
                                                        <strong>
                                                            {attribute.value}
                                                        </strong>
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-bold">
                                        {money.format(Number(variant.price))}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={
                                                variant.stock === 0
                                                    ? 'font-bold text-rose-600'
                                                    : variant.stock <=
                                                        variant.low_stock_threshold
                                                      ? 'font-bold text-amber-600'
                                                      : 'font-bold text-emerald-600'
                                            }
                                        >
                                            {variant.stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-bold ${variant.status ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
                                        >
                                            {variant.status
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                href={variantRoutes.edit.url(
                                                    variant.id,
                                                )}
                                                className="p-2 text-indigo-600"
                                                aria-label={`Edit ${variant.name}`}
                                            >
                                                <Pencil className="size-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    confirm(
                                                        `Delete ${variant.name}?`,
                                                    ) &&
                                                    router.delete(
                                                        variantRoutes.destroy.url(
                                                            variant.id,
                                                        ),
                                                    )
                                                }
                                                className="p-2 text-rose-600"
                                                aria-label={`Delete ${variant.name}`}
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {variants.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-12 text-center text-slate-500"
                                    >
                                        No product variants found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={variants.links} />
            </section>
        </AdminLayout>
    );
}
