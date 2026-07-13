import { Link, router } from '@inertiajs/react';
import {
    FileCheck2,
    FileMinus2,
    Plus,
    ReceiptText,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/tax-invoices';
import type { Counts, Paginated, TaxInvoice } from '@/types/admin';

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});

export default function TaxInvoicesIndex({
    invoices,
    counts,
    statuses,
}: {
    invoices: Paginated<TaxInvoice>;
    counts: Counts;
    statuses: string[];
}) {
    const query = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(query.get('search') ?? '');
    const [status, setStatus] = useState(query.get('status') ?? '');
    const [type, setType] = useState(query.get('type') ?? '');

    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            routes.index.url(),
            { search, status, type },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="GST Invoices" breadcrumb="Finance / Tax documents">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                    <h2 className="text-2xl font-black">
                        GST document control
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Issue supplier invoices, track tax allocation and link
                        credit notes.
                    </p>
                </div>
                <Link
                    href={routes.create.url()}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white"
                >
                    <Plus className="size-4" /> Generate document
                </Link>
            </div>

            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Documents',
                            value: counts.total,
                            icon: ReceiptText,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Issued invoices',
                            value: counts.issued,
                            icon: FileCheck2,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                        {
                            label: 'Credit notes',
                            value: counts.credit_notes,
                            icon: FileMinus2,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'Issued tax',
                            value: money.format(counts.tax_value),
                            icon: ReceiptText,
                            tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
                        },
                    ]}
                />
            </div>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[1fr_11rem_11rem_auto] dark:border-white/10"
                >
                    <label className="relative">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Invoice, order or GSTIN"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 text-sm dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <select
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All document types</option>
                        <option value="invoice">Tax invoices</option>
                        <option value="credit_note">Credit notes</option>
                    </select>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="">All statuses</option>
                        {statuses.map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                    <button className="rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>

                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {invoices.data.map((invoice) => (
                        <Link
                            key={invoice.id}
                            href={routes.show.url(invoice.id)}
                            className="grid gap-3 p-5 transition hover:bg-slate-50 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center dark:hover:bg-white/5"
                        >
                            <div>
                                <p className="font-black">{invoice.number}</p>
                                <p className="text-xs text-slate-500">
                                    {invoice.type.replace('_', ' ')} · FY{' '}
                                    {invoice.financial_year}
                                </p>
                            </div>
                            <div>
                                <p className="font-bold">
                                    Order {invoice.order.number}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {invoice.vendor?.business_name ??
                                        invoice.supplier_name}
                                </p>
                            </div>
                            <div>
                                <p className="font-black">
                                    {money.format(Number(invoice.total_amount))}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Tax{' '}
                                    {money.format(
                                        Number(invoice.cgst_amount) +
                                            Number(invoice.sgst_amount) +
                                            Number(invoice.igst_amount) +
                                            Number(invoice.cess_amount),
                                    )}
                                </p>
                            </div>
                            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase dark:bg-white/10">
                                {invoice.status}
                            </span>
                        </Link>
                    ))}
                    {invoices.data.length === 0 && (
                        <p className="p-14 text-center text-sm text-slate-500">
                            No GST documents match these filters.
                        </p>
                    )}
                </div>
                <Pagination links={invoices.links} />
            </section>
        </AdminLayout>
    );
}
