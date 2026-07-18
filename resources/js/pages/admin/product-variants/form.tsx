import { Link, useForm } from '@inertiajs/react';
import { Layers3, Plus, Save, Trash2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import variantRoutes from '@/routes/admin/product-variants';
import type { ProductVariant, ProductVariantAttribute } from '@/types/admin';

type ProductOption = { id: number; name: string; sku: string };
type Props = {
    variant: Partial<ProductVariant>;
    products: ProductOption[];
};

const input =
    'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/[0.07]';

export default function ProductVariantForm({ variant, products }: Props) {
    const exists = Boolean(variant.id);
    const form = useForm({
        product_id: variant.product_id?.toString() ?? '',
        name: variant.name ?? '',
        sku: variant.sku ?? '',
        attributes:
            variant.attributes?.length && variant.attributes.length > 0
                ? variant.attributes
                : ([{ name: '', value: '' }] as ProductVariantAttribute[]),
        price: variant.price ?? '',
        compare_at_price: variant.compare_at_price ?? '',
        stock: variant.stock ?? 0,
        low_stock_threshold: variant.low_stock_threshold ?? 5,
        status: variant.status ?? true,
        is_default: variant.is_default ?? false,
    });

    const updateAttribute = (
        index: number,
        key: keyof ProductVariantAttribute,
        value: string,
    ) => {
        form.setData(
            'attributes',
            form.data.attributes.map((attribute, attributeIndex) =>
                attributeIndex === index
                    ? { ...attribute, [key]: value }
                    : attribute,
            ),
        );
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const options = { preserveScroll: true };

        if (exists) {
            form.put(variantRoutes.update.url(variant.id!), options);

            return;
        }

        form.post(variantRoutes.store.url(), options);
    };

    return (
        <AdminLayout
            title={exists ? 'Edit Product Variant' : 'Create Product Variant'}
            breadcrumb={`Catalogue / Variants / ${exists ? 'Edit' : 'Create'}`}
        >
            <form
                onSubmit={submit}
                className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
            >
                <div className="grid gap-6">
                    <Section
                        title="Variant identity"
                        description="Connect this purchasable combination to a product."
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label="Product"
                                error={form.errors.product_id}
                            >
                                <select
                                    className={input}
                                    value={form.data.product_id}
                                    onChange={(event) =>
                                        form.setData(
                                            'product_id',
                                            event.target.value,
                                        )
                                    }
                                    required
                                >
                                    <option value="">Select a product</option>
                                    {products.map((product) => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.name} ({product.sku})
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field
                                label="Variant name"
                                error={form.errors.name}
                            >
                                <input
                                    className={input}
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData('name', event.target.value)
                                    }
                                    placeholder="Ocean Blue / 256 GB"
                                    required
                                    maxLength={150}
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
                                    placeholder="PHONE-BLUE-256"
                                    required
                                    maxLength={80}
                                />
                            </Field>
                        </div>
                    </Section>

                    <Section
                        title="Option attributes"
                        description="Add customer-facing choices such as color, size or storage."
                    >
                        <div className="grid gap-3">
                            {form.data.attributes.map((attribute, index) => (
                                <div
                                    key={index}
                                    className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[1fr_1fr_auto] dark:border-white/10"
                                >
                                    <Field
                                        label="Option name"
                                        error={
                                            form.errors[
                                                `attributes.${index}.name`
                                            ]
                                        }
                                    >
                                        <input
                                            className={input}
                                            value={attribute.name}
                                            onChange={(event) =>
                                                updateAttribute(
                                                    index,
                                                    'name',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Color"
                                            required
                                        />
                                    </Field>
                                    <Field
                                        label="Option value"
                                        error={
                                            form.errors[
                                                `attributes.${index}.value`
                                            ]
                                        }
                                    >
                                        <input
                                            className={input}
                                            value={attribute.value}
                                            onChange={(event) =>
                                                updateAttribute(
                                                    index,
                                                    'value',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Ocean Blue"
                                            required
                                        />
                                    </Field>
                                    <button
                                        type="button"
                                        disabled={
                                            form.data.attributes.length === 1
                                        }
                                        onClick={() =>
                                            form.setData(
                                                'attributes',
                                                form.data.attributes.filter(
                                                    (_, attributeIndex) =>
                                                        attributeIndex !==
                                                        index,
                                                ),
                                            )
                                        }
                                        className="mt-7 grid size-11 place-items-center rounded-xl text-rose-600 transition hover:bg-rose-50 disabled:opacity-30"
                                        aria-label="Remove option"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            disabled={form.data.attributes.length >= 6}
                            onClick={() =>
                                form.setData('attributes', [
                                    ...form.data.attributes,
                                    { name: '', value: '' },
                                ])
                            }
                            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-40 dark:border-white/10 dark:text-slate-200"
                        >
                            <Plus className="size-4" /> Add option
                        </button>
                    </Section>

                    <Section
                        title="Pricing and inventory"
                        description="Track sell price and stock at the variant level."
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Price" error={form.errors.price}>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
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
                                label="Compare-at price"
                                error={form.errors.compare_at_price}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
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
                            <Field label="Stock" error={form.errors.stock}>
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
                                label="Low-stock threshold"
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
                        title="Availability"
                        description="Control sale status and the product's initial selection."
                    >
                        <label className="flex items-start gap-3 rounded-xl bg-emerald-50 p-3 text-sm dark:bg-emerald-500/10">
                            <input
                                type="checkbox"
                                checked={form.data.status}
                                onChange={(event) =>
                                    form.setData('status', event.target.checked)
                                }
                                className="mt-0.5"
                            />
                            <span>
                                <strong className="block">Active</strong>
                                <span className="text-slate-500">
                                    Customers can select this variant.
                                </span>
                            </span>
                        </label>
                        <label className="mt-3 flex items-start gap-3 rounded-xl bg-orange-50 p-3 text-sm dark:bg-orange-500/10">
                            <input
                                type="checkbox"
                                checked={form.data.is_default}
                                onChange={(event) =>
                                    form.setData(
                                        'is_default',
                                        event.target.checked,
                                    )
                                }
                                className="mt-0.5"
                            />
                            <span>
                                <strong className="block">
                                    Default selection
                                </strong>
                                <span className="text-slate-500">
                                    Replaces the current default for this
                                    product.
                                </span>
                            </span>
                        </label>
                    </Section>
                    <div className="flex gap-3">
                        <Link
                            href={variantRoutes.index.url()}
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
                                <Layers3 className="size-4" />
                            )}
                            {form.processing ? 'Saving...' : 'Save variant'}
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
    children: ReactNode;
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
    children: ReactNode;
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
