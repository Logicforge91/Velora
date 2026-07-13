import { Link, useForm } from '@inertiajs/react';
import { ImagePlus, PackageCheck, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import productsRoutes from '@/routes/admin/products';
import type { Product } from '@/types/admin';

type Option = { id: number; name: string };
type Props = {
    product: Partial<Product>;
    categories: Option[];
    brands: Option[];
    statuses: string[];
};
const input =
    'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/[0.07]';

export default function ProductForm({
    product,
    categories,
    brands,
    statuses,
}: Props) {
    const exists = Boolean(product.id);
    const form = useForm({
        name: product.name ?? '',
        slug: product.slug ?? '',
        sku: product.sku ?? '',
        category_id: product.category_id?.toString() ?? '',
        brand_id: product.brand_id?.toString() ?? '',
        short_description: product.short_description ?? '',
        description: product.description ?? '',
        price: product.price ?? '',
        compare_at_price: product.compare_at_price ?? '',
        stock: product.stock ?? 0,
        low_stock_threshold: product.low_stock_threshold ?? 5,
        status: product.status ?? 'draft',
        is_featured: product.is_featured ?? false,
        primary_image: null as File | null,
        remove_primary_image: false,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            is_featured: data.is_featured ? 1 : 0,
            remove_primary_image: data.remove_primary_image ? 1 : 0,
            _method: exists ? 'PUT' : undefined,
        }));
        form.post(
            exists
                ? productsRoutes.update.url(product.id!)
                : productsRoutes.store.url(),
            { forceFormData: true, preserveScroll: true },
        );
    };

    return (
        <AdminLayout
            title={exists ? 'Edit Product' : 'Create Product'}
            breadcrumb={`Catalogue / Products / ${exists ? 'Edit' : 'Create'}`}
        >
            <form
                onSubmit={submit}
                className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
            >
                <div className="grid gap-6">
                    <Section
                        title="Product information"
                        description="The customer-facing identity and catalogue placement."
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label="Product name"
                                error={form.errors.name}
                            >
                                <input
                                    className={input}
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData('name', event.target.value)
                                    }
                                    required
                                    maxLength={180}
                                />
                            </Field>
                            <Field label="SKU" error={form.errors.sku}>
                                <input
                                    className={input}
                                    value={form.data.sku}
                                    onChange={(event) =>
                                        form.setData(
                                            'sku',
                                            event.target.value.toUpperCase(),
                                        )
                                    }
                                    required
                                    maxLength={80}
                                    placeholder="VEL-0001"
                                />
                            </Field>
                            <Field label="URL slug" error={form.errors.slug}>
                                <input
                                    className={input}
                                    value={form.data.slug}
                                    onChange={(event) =>
                                        form.setData('slug', event.target.value)
                                    }
                                    maxLength={200}
                                    placeholder="Generated from the name"
                                />
                            </Field>
                            <Field
                                label="Category"
                                error={form.errors.category_id}
                            >
                                <select
                                    className={input}
                                    value={form.data.category_id}
                                    onChange={(event) =>
                                        form.setData(
                                            'category_id',
                                            event.target.value,
                                        )
                                    }
                                >
                                    <option value="">Uncategorised</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Brand" error={form.errors.brand_id}>
                                <select
                                    className={input}
                                    value={form.data.brand_id}
                                    onChange={(event) =>
                                        form.setData(
                                            'brand_id',
                                            event.target.value,
                                        )
                                    }
                                >
                                    <option value="">No brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <div className="md:col-span-2">
                                <Field
                                    label="Short description"
                                    error={form.errors.short_description}
                                >
                                    <textarea
                                        rows={3}
                                        className={`${input} h-auto py-3`}
                                        value={form.data.short_description}
                                        onChange={(event) =>
                                            form.setData(
                                                'short_description',
                                                event.target.value,
                                            )
                                        }
                                        maxLength={500}
                                    />
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field
                                    label="Full description"
                                    error={form.errors.description}
                                >
                                    <textarea
                                        rows={8}
                                        className={`${input} h-auto py-3`}
                                        value={form.data.description}
                                        onChange={(event) =>
                                            form.setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        maxLength={10000}
                                    />
                                </Field>
                            </div>
                        </div>
                    </Section>

                    <Section
                        title="Pricing & inventory"
                        description="Pricing integrity and stock-alert thresholds."
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field
                                label="Selling price (₹)"
                                error={form.errors.price}
                            >
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={input}
                                    value={form.data.price}
                                    onChange={(event) =>
                                        form.setData(
                                            'price',
                                            event.target.value,
                                        )
                                    }
                                    required
                                />
                            </Field>
                            <Field
                                label="MRP / compare price (₹)"
                                error={form.errors.compare_at_price}
                            >
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={input}
                                    value={form.data.compare_at_price}
                                    onChange={(event) =>
                                        form.setData(
                                            'compare_at_price',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Available stock"
                                error={form.errors.stock}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    className={input}
                                    value={form.data.stock}
                                    onChange={(event) =>
                                        form.setData(
                                            'stock',
                                            Number(event.target.value),
                                        )
                                    }
                                    required
                                />
                            </Field>
                            <Field
                                label="Low stock alert at"
                                error={form.errors.low_stock_threshold}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    className={input}
                                    value={form.data.low_stock_threshold}
                                    onChange={(event) =>
                                        form.setData(
                                            'low_stock_threshold',
                                            Number(event.target.value),
                                        )
                                    }
                                    required
                                />
                            </Field>
                        </div>
                    </Section>
                </div>

                <aside className="grid content-start gap-6">
                    <Section
                        title="Publishing"
                        description="Control marketplace visibility."
                    >
                        <Field
                            label="Listing status"
                            error={form.errors.status}
                        >
                            <select
                                className={input}
                                value={form.data.status}
                                onChange={(event) =>
                                    form.setData(
                                        'status',
                                        event.target.value as Product['status'],
                                    )
                                }
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status[0].toUpperCase() +
                                            status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <label className="mt-5 flex items-start gap-3 rounded-xl bg-orange-50 p-3 text-sm dark:bg-orange-500/10">
                            <input
                                type="checkbox"
                                checked={form.data.is_featured}
                                onChange={(event) =>
                                    form.setData(
                                        'is_featured',
                                        event.target.checked,
                                    )
                                }
                                className="mt-0.5"
                            />
                            <span>
                                <strong className="block">
                                    Featured placement
                                </strong>
                                <span className="text-slate-500">
                                    Prioritise this item in merchandising
                                    surfaces.
                                </span>
                            </span>
                        </label>
                    </Section>
                    <Section
                        title="Primary image"
                        description="JPG, PNG or WebP up to 4 MB."
                    >
                        {product.primary_image && (
                            <img
                                src={product.primary_image.url}
                                alt={product.name}
                                className="mb-4 aspect-square w-full rounded-xl border border-slate-200 object-cover dark:border-white/10"
                            />
                        )}
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-sm font-bold text-slate-600 hover:border-orange-400 hover:text-orange-600 dark:border-white/15 dark:text-slate-300">
                            <ImagePlus className="size-5" />
                            {form.data.primary_image?.name ??
                                'Choose product image'}
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                className="sr-only"
                                onChange={(event) =>
                                    form.setData(
                                        'primary_image',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                            />
                        </label>
                        {form.errors.primary_image && (
                            <p className="mt-2 text-sm text-rose-600">
                                {form.errors.primary_image}
                            </p>
                        )}
                        {product.primary_image && (
                            <label className="mt-3 flex items-center gap-2 text-sm text-rose-600">
                                <input
                                    type="checkbox"
                                    checked={form.data.remove_primary_image}
                                    onChange={(event) =>
                                        form.setData(
                                            'remove_primary_image',
                                            event.target.checked,
                                        )
                                    }
                                />
                                Remove current image
                            </label>
                        )}
                    </Section>
                    <div className="flex gap-3">
                        <Link
                            href={productsRoutes.index.url()}
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold dark:border-white/10"
                        >
                            Cancel
                        </Link>
                        <button
                            disabled={form.processing}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                        >
                            {exists ? (
                                <Save className="size-4" />
                            ) : (
                                <PackageCheck className="size-4" />
                            )}
                            {form.processing ? 'Saving...' : 'Save product'}
                        </button>
                    </div>
                </aside>
            </form>
        </AdminLayout>
    );
}

function Section({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-bold">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
            <div className="mt-5">{children}</div>
        </section>
    );
}
function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {label}
            </span>
            {children}
            {error && (
                <span className="mt-1 block text-sm text-rose-600">
                    {error}
                </span>
            )}
        </label>
    );
}
