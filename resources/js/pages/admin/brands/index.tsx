import { Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import Pagination from '@/components/admin/pagination';
import AdminLayout from '@/layouts/admin-layout';
import brandsRoutes from '@/routes/admin/brands';
import type { Brand, Counts, Paginated } from '@/types/admin';

export default function BrandsIndex({
    brands,
    counts,
}: {
    brands: Paginated<Brand>;
    counts: Counts;
}) {
    const [search, setSearch] = useState(
        new URLSearchParams(location.search).get('search') ?? '',
    );
    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            brandsRoutes.index.url(),
            { search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Brands" breadcrumb="Catalog / Brands">
            <div className="flex justify-end">
                <Link
                    href={brandsRoutes.create.url()}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                    <Plus className="size-4" />
                    Add brand
                </Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {Object.entries(counts)
                    .slice(0, 3)
                    .map(([label, value]) => (
                        <div
                            key={label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"
                        >
                            <p className="text-sm text-slate-500 capitalize">
                                {label.replace('_', ' ')}
                            </p>
                            <p className="mt-2 text-3xl font-bold">{value}</p>
                        </div>
                    ))}
            </div>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={submit}
                    className="flex gap-3 border-b border-slate-200 p-5 dark:border-white/10"
                >
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search brands"
                        className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm dark:border-white/10"
                    />
                    <button className="rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                        Search
                    </button>
                </form>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase dark:bg-white/5">
                            <tr>
                                <th className="px-6 py-3">Brand</th>
                                <th className="px-5 py-3">Featured</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-6 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {brands.data.map((brand) => (
                                <tr key={brand.id}>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold">
                                            {brand.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {brand.slug}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        {brand.is_featured
                                            ? 'Featured'
                                            : 'Standard'}
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        {brand.status ? 'Active' : 'Inactive'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={brandsRoutes.edit.url(
                                                    brand.id,
                                                )}
                                                className="rounded-lg p-2 text-indigo-600"
                                            >
                                                <Pencil className="size-4" />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    confirm(
                                                        `Delete ${brand.name}?`,
                                                    ) &&
                                                    router.delete(
                                                        brandsRoutes.destroy.url(
                                                            brand.id,
                                                        ),
                                                    )
                                                }
                                                className="rounded-lg p-2 text-red-600"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={brands.links} />
            </section>
        </AdminLayout>
    );
}
