import { Link, usePoll } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/catalog-imports';
import type { CatalogImport } from '@/types/admin';

export default function CatalogImportShow({
    import: item,
}: {
    import: CatalogImport;
}) {
    const active = ['queued', 'processing'].includes(item.status);
    usePoll(3000, { only: ['import'] }, { autoStart: active });

    const progress =
        item.total_rows > 0
            ? Math.round((item.processed_rows / item.total_rows) * 100)
            : active
              ? 10
              : 100;

    return (
        <AdminLayout
            title="Catalogue Import"
            breadcrumb="Catalogue / Bulk imports / Details"
        >
            <Link
                href={routes.index.url()}
                className="text-sm font-bold text-indigo-600"
            >
                ← Back to imports
            </Link>
            <div className="mt-5 grid gap-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-wrap justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black">
                                {item.original_name}
                            </h2>
                            <p className="mt-1 font-mono text-xs text-slate-400">
                                {item.uuid}
                            </p>
                        </div>
                        <span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase dark:bg-white/10">
                            {item.status.replaceAll('_', ' ')}
                        </span>
                    </div>
                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        <div
                            className="h-full rounded-full bg-indigo-600 transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-5">
                        {[
                            ['Rows', item.processed_rows],
                            ['Create', item.created_rows],
                            ['Update', item.updated_rows],
                            ['Failed', item.failed_rows],
                            ['Mode', item.dry_run ? 'Dry run' : 'Live'],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-xl bg-slate-50 p-4 dark:bg-white/5"
                            >
                                <p className="text-xs font-bold text-slate-400 uppercase">
                                    {label}
                                </p>
                                <p className="mt-2 text-xl font-black">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                    <h3 className="border-b border-slate-200 p-5 font-black dark:border-white/10">
                        Row validation errors
                    </h3>
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {item.errors?.map((error, index) => (
                            <div
                                key={`${error.row}-${index}`}
                                className="grid gap-2 p-4 text-sm sm:grid-cols-[6rem_10rem_1fr]"
                            >
                                <b>Row {error.row ?? '—'}</b>
                                <span>{error.sku ?? 'No SKU'}</span>
                                <span className="text-rose-600">
                                    {error.message}
                                </span>
                            </div>
                        ))}
                        {!item.errors?.length && (
                            <p className="p-10 text-center text-sm text-slate-500">
                                No row errors reported.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
