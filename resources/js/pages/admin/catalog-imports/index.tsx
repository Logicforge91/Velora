import { Link } from '@inertiajs/react';
import {
    CheckCircle2,
    FileSpreadsheet,
    Plus,
    Rows3,
    TriangleAlert,
} from 'lucide-react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/catalog-imports';
import type { CatalogImport, Counts, Paginated } from '@/types/admin';

export default function CatalogImportsIndex({
    imports,
    counts,
}: {
    imports: Paginated<CatalogImport>;
    counts: Counts;
}) {
    return (
        <AdminLayout
            title="Catalog Imports"
            breadcrumb="Catalogue / Bulk operations"
        >
            <div className="flex flex-wrap justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black">
                        Catalogue import center
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Validate and process large product catalogues
                        asynchronously.
                    </p>
                </div>
                <Link
                    href={routes.create.url()}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white"
                >
                    <Plus className="size-4" /> New import
                </Link>
            </div>
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Import jobs',
                            value: counts.total,
                            icon: FileSpreadsheet,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'In queue',
                            value: counts.queued,
                            icon: Rows3,
                            tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
                        },
                        {
                            label: 'Completed',
                            value: counts.completed,
                            icon: CheckCircle2,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                        {
                            label: 'Rejected rows',
                            value: counts.failed_rows,
                            icon: TriangleAlert,
                            tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
                        },
                    ]}
                />
            </div>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {imports.data.map((item) => (
                        <Link
                            key={item.id}
                            href={routes.show.url(item.id)}
                            className="grid gap-3 p-5 hover:bg-slate-50 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-center dark:hover:bg-white/5"
                        >
                            <div>
                                <p className="font-black">
                                    {item.original_name}
                                </p>
                                <p className="font-mono text-[10px] text-slate-400">
                                    {item.uuid}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-bold">
                                    {item.uploader?.name ?? 'Unknown'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {item.dry_run ? 'Dry run' : 'Live import'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-black">
                                    {item.processed_rows} rows
                                </p>
                                <p className="text-xs text-slate-500">
                                    {item.created_rows} create ·{' '}
                                    {item.updated_rows} update ·{' '}
                                    {item.failed_rows} failed
                                </p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase dark:bg-white/10">
                                {item.status.replaceAll('_', ' ')}
                            </span>
                        </Link>
                    ))}
                    {imports.data.length === 0 && (
                        <p className="p-14 text-center text-sm text-slate-500">
                            No catalogue imports have been submitted.
                        </p>
                    )}
                </div>
                <Pagination links={imports.links} />
            </section>
        </AdminLayout>
    );
}
