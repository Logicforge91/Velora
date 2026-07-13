import { Link, useForm } from '@inertiajs/react';
import { Download, FileSpreadsheet, Upload } from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/catalog-imports';

export default function CreateCatalogImport() {
    const form = useForm<{ file: File | null; dry_run: boolean }>({
        file: null,
        dry_run: true,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();

        form.post(routes.store.url(), { forceFormData: true });
    };

    return (
        <AdminLayout
            title="New Catalogue Import"
            breadcrumb="Catalogue / Bulk imports / Upload"
        >
            <div className="mx-auto max-w-3xl">
                <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black">
                                Upload product CSV
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Maximum 10,000 rows and 20 MB per import.
                            </p>
                        </div>
                        <FileSpreadsheet className="size-8 text-indigo-600" />
                    </div>
                    <a
                        href={routes.template.url()}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-600"
                    >
                        <Download className="size-4" /> Download CSV template
                    </a>
                    <form onSubmit={submit} className="mt-7 grid gap-5">
                        <label className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                            <Upload className="mx-auto size-8 text-slate-400" />
                            <input
                                type="file"
                                accept=".csv,.txt"
                                onChange={(event) =>
                                    form.setData(
                                        'file',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                                className="mt-4 block w-full text-sm"
                            />
                            {form.errors.file && (
                                <span className="mt-2 block text-xs text-rose-600">
                                    {form.errors.file}
                                </span>
                            )}
                        </label>
                        <label className="flex items-start gap-3 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-500/10">
                            <input
                                type="checkbox"
                                checked={form.data.dry_run}
                                onChange={(event) =>
                                    form.setData(
                                        'dry_run',
                                        event.target.checked,
                                    )
                                }
                                className="mt-1"
                            />
                            <span>
                                <b className="block text-sm">
                                    Validation-only dry run
                                </b>
                                <span className="text-xs text-slate-500">
                                    Calculate changes and errors without
                                    modifying products.
                                </span>
                            </span>
                        </label>
                        <div className="flex justify-end gap-3">
                            <Link
                                href={routes.index.url()}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold dark:border-white/10"
                            >
                                Cancel
                            </Link>
                            <button
                                disabled={form.processing || !form.data.file}
                                className="rounded-xl bg-orange-500 px-6 text-sm font-bold text-white disabled:opacity-40"
                            >
                                Queue import
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AdminLayout>
    );
}
