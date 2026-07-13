import { Link, useForm } from '@inertiajs/react';
import { FileMinus2, Printer } from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/tax-invoices';
import type { TaxInvoice } from '@/types/admin';

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});

export default function ShowTaxInvoice({
    invoice,
    statuses,
}: {
    invoice: TaxInvoice;
    statuses: string[];
}) {
    const form = useForm({
        status: invoice.status,
        notes: invoice.notes ?? '',
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(routes.update.url(invoice.id), { preserveScroll: true });
    };
    const taxTotal =
        Number(invoice.cgst_amount) +
        Number(invoice.sgst_amount) +
        Number(invoice.igst_amount) +
        Number(invoice.cess_amount);

    return (
        <AdminLayout
            title={invoice.number}
            breadcrumb="Finance / GST invoices / Document"
        >
            <div className="mb-5 flex flex-wrap justify-between gap-3 print:hidden">
                <Link
                    href={routes.index.url()}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold dark:border-white/10"
                >
                    Back to documents
                </Link>
                <div className="flex gap-2">
                    {invoice.type === 'invoice' &&
                        invoice.status === 'issued' && (
                            <Link
                                href={routes.create.url({
                                    query: {
                                        order_id: invoice.order_id,
                                        parent_invoice_id: invoice.id,
                                    },
                                })}
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white"
                            >
                                <FileMinus2 className="size-4" /> Create credit
                                note
                            </Link>
                        )}
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                    >
                        <Printer className="size-4" /> Print
                    </button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 md:p-9 dark:border-white/10">
                    <header className="flex flex-wrap justify-between gap-5 border-b border-slate-200 pb-6">
                        <div>
                            <p className="text-xs font-black tracking-[0.2em] text-orange-600 uppercase">
                                {invoice.type.replace('_', ' ')}
                            </p>
                            <h2 className="mt-2 text-2xl font-black">
                                {invoice.number}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Financial year {invoice.financial_year}
                            </p>
                        </div>
                        <div className="text-right text-sm">
                            <p>
                                <b>Issue date:</b>{' '}
                                {invoice.issued_on.slice(0, 10)}
                            </p>
                            <p>
                                <b>Order:</b> {invoice.order.number}
                            </p>
                            <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase">
                                {invoice.status}
                            </span>
                        </div>
                    </header>
                    <section className="grid gap-6 border-b border-slate-200 py-6 md:grid-cols-2">
                        <Address
                            title="Supplier"
                            name={invoice.supplier_name}
                            address={invoice.supplier_address}
                            gstin={invoice.supplier_gstin}
                        />
                        <Address
                            title="Recipient"
                            name={invoice.recipient_name}
                            address={invoice.recipient_address}
                            gstin={invoice.recipient_gstin}
                        />
                        <div className="text-sm">
                            <p className="text-xs font-black tracking-wider text-slate-400 uppercase">
                                Place of supply
                            </p>
                            <p className="mt-2 font-bold">
                                {invoice.place_of_supply_state} (
                                {invoice.place_of_supply_code})
                            </p>
                            <p className="text-slate-500">
                                Reverse charge:{' '}
                                {invoice.reverse_charge ? 'Yes' : 'No'}
                            </p>
                        </div>
                        {invoice.parent_invoice && (
                            <div className="text-sm">
                                <p className="text-xs font-black tracking-wider text-slate-400 uppercase">
                                    Original invoice
                                </p>
                                <Link
                                    href={routes.show.url(
                                        invoice.parent_invoice.id,
                                    )}
                                    className="mt-2 block font-bold text-orange-600"
                                >
                                    {invoice.parent_invoice.number}
                                </Link>
                            </div>
                        )}
                    </section>

                    <div className="overflow-x-auto py-6">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                                    <th className="py-3">Description</th>
                                    <th>HSN</th>
                                    <th className="text-right">Qty</th>
                                    <th className="text-right">Taxable</th>
                                    <th className="text-right">GST</th>
                                    <th className="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items?.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-slate-100"
                                    >
                                        <td className="py-4 font-bold">
                                            {item.description}
                                        </td>
                                        <td>{item.hsn_code ?? '—'}</td>
                                        <td className="text-right">
                                            {item.quantity} {item.unit}
                                        </td>
                                        <td className="text-right">
                                            {money.format(
                                                Number(item.taxable_value),
                                            )}
                                        </td>
                                        <td className="text-right">
                                            {item.gst_rate}%
                                        </td>
                                        <td className="text-right font-bold">
                                            {money.format(
                                                Number(item.total_amount),
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <section className="ml-auto grid max-w-sm grid-cols-2 gap-y-2 border-t border-slate-200 pt-5 text-sm">
                        <span>Taxable value</span>
                        <b className="text-right">
                            {money.format(Number(invoice.taxable_value))}
                        </b>
                        <span>CGST</span>
                        <b className="text-right">
                            {money.format(Number(invoice.cgst_amount))}
                        </b>
                        <span>SGST</span>
                        <b className="text-right">
                            {money.format(Number(invoice.sgst_amount))}
                        </b>
                        <span>IGST</span>
                        <b className="text-right">
                            {money.format(Number(invoice.igst_amount))}
                        </b>
                        <span>Cess</span>
                        <b className="text-right">
                            {money.format(Number(invoice.cess_amount))}
                        </b>
                        <span className="border-t pt-3 text-base font-black">
                            Document total
                        </span>
                        <b className="border-t pt-3 text-right text-base">
                            {money.format(Number(invoice.total_amount))}
                        </b>
                    </section>
                    <p className="mt-8 text-xs text-slate-500">
                        Total tax: {money.format(taxTotal)}.{' '}
                        {invoice.notes && `Notes: ${invoice.notes}`}
                    </p>
                </article>

                <aside className="print:hidden">
                    <form
                        onSubmit={submit}
                        className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"
                    >
                        <h3 className="font-black">Document workflow</h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Issued documents can only be retained or cancelled.
                        </p>
                        <label className="mt-5 block text-xs font-bold">
                            Status
                            <select
                                value={form.data.status}
                                onChange={(event) =>
                                    form.setData(
                                        'status',
                                        event.target
                                            .value as typeof form.data.status,
                                    )
                                }
                                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="mt-4 block text-xs font-bold">
                            Notes
                            <textarea
                                rows={5}
                                value={form.data.notes}
                                onChange={(event) =>
                                    form.setData('notes', event.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-white/10 dark:bg-white/5"
                            />
                        </label>
                        <button
                            disabled={form.processing}
                            className="mt-4 w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white disabled:opacity-50"
                        >
                            Update workflow
                        </button>
                    </form>
                </aside>
            </div>
        </AdminLayout>
    );
}

function Address({
    title,
    name,
    address,
    gstin,
}: {
    title: string;
    name: string;
    address: string;
    gstin: string | null;
}) {
    return (
        <div className="text-sm">
            <p className="text-xs font-black tracking-wider text-slate-400 uppercase">
                {title}
            </p>
            <p className="mt-2 font-black">{name}</p>
            <p className="mt-1 whitespace-pre-line text-slate-500">{address}</p>
            <p className="mt-1">
                <b>GSTIN:</b> {gstin ?? 'Unregistered'}
            </p>
        </div>
    );
}
