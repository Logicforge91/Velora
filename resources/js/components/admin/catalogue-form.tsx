import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import type { Brand, Category } from '@/types/admin';

type Item = Brand | Category;
type Props = {
    kind: 'brand' | 'category';
    item: Item;
    parentOptions?: Category[];
    submitUrl: string;
    method: 'post' | 'put';
    cancelUrl: string;
};
const input =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-white/5';

export default function CatalogueForm({
    kind,
    item,
    parentOptions = [],
    submitUrl,
    method,
    cancelUrl,
}: Props) {
    const isBrand = kind === 'brand';
    const brand = item as Brand;
    const category = item as Category;
    const form = useForm({
        name: item.name ?? '',
        slug: item.slug ?? '',
        description: item.description ?? '',
        sort_order: item.sort_order ?? 0,
        status: item.status ?? true,
        parent_id: isBrand ? '' : (category.parent_id?.toString() ?? ''),
        website_url: isBrand ? (brand.website_url ?? '') : '',
        is_featured: isBrand ? brand.is_featured : false,
        logo: null as File | null,
        image: null as File | null,
        remove_logo: false,
        remove_image: false,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            status: data.status ? 1 : 0,
            is_featured: data.is_featured ? 1 : 0,
            remove_logo: data.remove_logo ? 1 : 0,
            remove_image: data.remove_image ? 1 : 0,
            _method: method === 'put' ? 'PUT' : undefined,
        }));
        form.post(submitUrl, { forceFormData: true });
    };
    const imageUrl = isBrand ? brand.logo_url : category.image_url;

    return (
        <form
            onSubmit={submit}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
        >
            <div className="grid gap-5 p-6 md:grid-cols-2">
                <Field label="Name" error={form.errors.name}>
                    <input
                        className={input}
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        required
                        maxLength={150}
                    />
                </Field>
                <Field label="Slug" error={form.errors.slug}>
                    <input
                        className={input}
                        value={form.data.slug}
                        onChange={(e) => form.setData('slug', e.target.value)}
                        maxLength={180}
                        placeholder="Generated automatically when blank"
                    />
                </Field>
                {!isBrand && (
                    <Field
                        label="Parent category"
                        error={form.errors.parent_id}
                    >
                        <select
                            className={input}
                            value={form.data.parent_id}
                            onChange={(e) =>
                                form.setData('parent_id', e.target.value)
                            }
                        >
                            <option value="">Root category</option>
                            {parentOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                )}
                {isBrand && (
                    <Field label="Website URL" error={form.errors.website_url}>
                        <input
                            type="url"
                            className={input}
                            value={form.data.website_url}
                            onChange={(e) =>
                                form.setData('website_url', e.target.value)
                            }
                        />
                    </Field>
                )}
                <Field label="Sort order" error={form.errors.sort_order}>
                    <input
                        type="number"
                        min={0}
                        max={99999}
                        className={input}
                        value={form.data.sort_order}
                        onChange={(e) =>
                            form.setData('sort_order', Number(e.target.value))
                        }
                    />
                </Field>
                <div className="md:col-span-2">
                    <Field label="Description" error={form.errors.description}>
                        <textarea
                            rows={5}
                            className={input}
                            value={form.data.description}
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
                            maxLength={3000}
                        />
                    </Field>
                </div>
                <div className="md:col-span-2">
                    <Field
                        label={isBrand ? 'Brand logo' : 'Category image'}
                        error={isBrand ? form.errors.logo : form.errors.image}
                    >
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={item.name}
                                className="mb-3 size-24 rounded-xl border border-slate-200 object-cover dark:border-white/10"
                            />
                        )}
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            className={input}
                            onChange={(e) =>
                                isBrand
                                    ? form.setData(
                                          'logo',
                                          e.target.files?.[0] ?? null,
                                      )
                                    : form.setData(
                                          'image',
                                          e.target.files?.[0] ?? null,
                                      )
                            }
                        />
                        {imageUrl && (
                            <label className="mt-3 flex items-center gap-2 text-sm text-red-600">
                                <input
                                    type="checkbox"
                                    checked={
                                        isBrand
                                            ? form.data.remove_logo
                                            : form.data.remove_image
                                    }
                                    onChange={(e) =>
                                        isBrand
                                            ? form.setData(
                                                  'remove_logo',
                                                  e.target.checked,
                                              )
                                            : form.setData(
                                                  'remove_image',
                                                  e.target.checked,
                                              )
                                    }
                                />{' '}
                                Remove current image
                            </label>
                        )}
                    </Field>
                </div>
                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={form.data.status}
                        onChange={(e) =>
                            form.setData('status', e.target.checked)
                        }
                    />{' '}
                    Active {kind}
                </label>
                {isBrand && (
                    <label className="flex items-center gap-3 text-sm">
                        <input
                            type="checkbox"
                            checked={form.data.is_featured}
                            onChange={(e) =>
                                form.setData('is_featured', e.target.checked)
                            }
                        />{' '}
                        Featured brand
                    </label>
                )}
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-white/10">
                <a
                    href={cancelUrl}
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold dark:border-white/10"
                >
                    Cancel
                </a>
                <button
                    disabled={form.processing}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {form.processing
                        ? 'Saving...'
                        : `${method === 'put' ? 'Update' : 'Create'} ${isBrand ? 'Brand' : 'Category'}`}
                </button>
            </div>
        </form>
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
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {label}
            </span>
            {children}
            {error && (
                <span className="mt-1 block text-sm text-red-600">{error}</span>
            )}
        </label>
    );
}
