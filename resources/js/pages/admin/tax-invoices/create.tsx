import { Link, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/tax-invoices';

type OrderOption = {
    id: number;
    number: string;
    total: string;
    user: { name: string; email: string };
    items: { vendor_id: number | null }[];
};
type VendorOption = {
    id: number;
    business_name: string;
    tax_number: string | null;
    address: string | null;
};
type InvoiceOption = {
    id: number;
    order_id: number;
    vendor_id: number | null;
    number: string;
    total_amount: string;
};

const control =
    'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-white/5';

export default function CreateTaxInvoice({
    orders,
    vendors,
    issuedInvoices,
    defaults,
}: {
    orders: OrderOption[];
    vendors: VendorOption[];
    issuedInvoices: InvoiceOption[];
    defaults: { order_id: number | null; parent_invoice_id: number | null };
}) {
    const selectedParent = issuedInvoices.find(
        (invoice) => invoice.id === defaults.parent_invoice_id,
    );
    const initialVendor = vendors.find(
        (vendor) => vendor.id === selectedParent?.vendor_id,
    );
    const form = useForm({
        type: selectedParent ? 'credit_note' : 'invoice',
        order_id: String(defaults.order_id ?? selectedParent?.order_id ?? ''),
        vendor_id: String(selectedParent?.vendor_id ?? ''),
        parent_invoice_id: String(defaults.parent_invoice_id ?? ''),
        issued_on: new Date().toISOString().slice(0, 10),
        supplier_name: initialVendor?.business_name ?? 'Velora Marketplace',
        supplier_address: initialVendor?.address ?? '',
        supplier_gstin: initialVendor?.tax_number ?? '',
        supplier_state_code: '',
        recipient_gstin: '',
        place_of_supply_state: '',
        place_of_supply_code: '',
        reverse_charge: false,
        gst_rate: '18',
        cess_rate: '0',
        hsn_code: '',
        prices_include_tax: true,
        credit_amount: '',
        notes: '',
    });
    const orderId = Number(form.data.order_id);
    const relevantInvoices = issuedInvoices.filter(
        (invoice) => !orderId || invoice.order_id === orderId,
    );

    const selectVendor = (vendorId: string) => {
        form.setData('vendor_id', vendorId);

        const vendor = vendors.find((item) => item.id === Number(vendorId));

        if (vendor) {
            form.setData((data) => ({
                ...data,
                vendor_id: vendorId,
                supplier_name: vendor.business_name,
                supplier_address: vendor.address ?? '',
                supplier_gstin: vendor.tax_number ?? '',
            }));
        }
    };
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(routes.store.url());
    };

    return (
        <AdminLayout
            title="Generate GST Document"
            breadcrumb="Finance / GST invoices / Generate"
        >
            <form onSubmit={submit} className="mx-auto max-w-5xl space-y-6">
                <Panel
                    title="Document scope"
                    description="Choose the order, supplier and tax document type."
                >
                    <Field label="Document type" error={form.errors.type}>
                        <select
                            value={form.data.type}
                            onChange={(event) =>
                                form.setData('type', event.target.value)
                            }
                            className={control}
                        >
                            <option value="invoice">Tax invoice</option>
                            <option value="credit_note">Credit note</option>
                        </select>
                    </Field>
                    <Field label="Order" error={form.errors.order_id}>
                        <select
                            value={form.data.order_id}
                            onChange={(event) => {
                                form.setData('order_id', event.target.value);
                                form.setData('parent_invoice_id', '');
                            }}
                            className={control}
                        >
                            <option value="">Select order</option>
                            {orders.map((order) => (
                                <option key={order.id} value={order.id}>
                                    {order.number} · {order.user.name} · ₹
                                    {Number(order.total).toLocaleString(
                                        'en-IN',
                                    )}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field
                        label="Seller / supplier"
                        error={form.errors.vendor_id}
                    >
                        <select
                            value={form.data.vendor_id}
                            onChange={(event) =>
                                selectVendor(event.target.value)
                            }
                            className={control}
                        >
                            <option value="">Marketplace supplier</option>
                            {vendors.map((vendor) => (
                                <option key={vendor.id} value={vendor.id}>
                                    {vendor.business_name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Issue date" error={form.errors.issued_on}>
                        <input
                            type="date"
                            value={form.data.issued_on}
                            onChange={(event) =>
                                form.setData('issued_on', event.target.value)
                            }
                            className={control}
                        />
                    </Field>
                    {form.data.type === 'credit_note' && (
                        <>
                            <Field
                                label="Original invoice"
                                error={form.errors.parent_invoice_id}
                            >
                                <select
                                    value={form.data.parent_invoice_id}
                                    onChange={(event) =>
                                        form.setData(
                                            'parent_invoice_id',
                                            event.target.value,
                                        )
                                    }
                                    className={control}
                                >
                                    <option value="">
                                        Select issued invoice
                                    </option>
                                    {relevantInvoices.map((invoice) => (
                                        <option
                                            key={invoice.id}
                                            value={invoice.id}
                                        >
                                            {invoice.number} · ₹
                                            {Number(
                                                invoice.total_amount,
                                            ).toLocaleString('en-IN')}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field
                                label="Credit amount"
                                error={form.errors.credit_amount}
                            >
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={form.data.credit_amount}
                                    onChange={(event) =>
                                        form.setData(
                                            'credit_amount',
                                            event.target.value,
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                        </>
                    )}
                </Panel>

                <Panel
                    title="Supplier registration"
                    description="These values are snapshotted into the document."
                >
                    <Field
                        label="Legal supplier name"
                        error={form.errors.supplier_name}
                    >
                        <input
                            value={form.data.supplier_name}
                            onChange={(event) =>
                                form.setData(
                                    'supplier_name',
                                    event.target.value,
                                )
                            }
                            className={control}
                        />
                    </Field>
                    <Field
                        label="Supplier GSTIN"
                        error={form.errors.supplier_gstin}
                    >
                        <input
                            maxLength={15}
                            value={form.data.supplier_gstin}
                            onChange={(event) =>
                                form.setData(
                                    'supplier_gstin',
                                    event.target.value.toUpperCase(),
                                )
                            }
                            className={control}
                            placeholder="22AAAAA0000A1Z5"
                        />
                    </Field>
                    <Field
                        label="Supplier state code"
                        error={form.errors.supplier_state_code}
                    >
                        <input
                            maxLength={2}
                            value={form.data.supplier_state_code}
                            onChange={(event) =>
                                form.setData(
                                    'supplier_state_code',
                                    event.target.value,
                                )
                            }
                            className={control}
                            placeholder="29"
                        />
                    </Field>
                    <Field
                        label="Supplier address"
                        error={form.errors.supplier_address}
                        wide
                    >
                        <textarea
                            rows={3}
                            value={form.data.supplier_address}
                            onChange={(event) =>
                                form.setData(
                                    'supplier_address',
                                    event.target.value,
                                )
                            }
                            className={`${control} h-auto py-3`}
                        />
                    </Field>
                </Panel>

                <Panel
                    title="Supply and tax"
                    description="The state-code comparison determines CGST/SGST or IGST allocation."
                >
                    <Field
                        label="Place of supply"
                        error={form.errors.place_of_supply_state}
                    >
                        <input
                            value={form.data.place_of_supply_state}
                            onChange={(event) =>
                                form.setData(
                                    'place_of_supply_state',
                                    event.target.value,
                                )
                            }
                            className={control}
                            placeholder="Karnataka"
                        />
                    </Field>
                    <Field
                        label="Place state code"
                        error={form.errors.place_of_supply_code}
                    >
                        <input
                            maxLength={2}
                            value={form.data.place_of_supply_code}
                            onChange={(event) =>
                                form.setData(
                                    'place_of_supply_code',
                                    event.target.value,
                                )
                            }
                            className={control}
                            placeholder="29"
                        />
                    </Field>
                    <Field
                        label="Recipient GSTIN"
                        error={form.errors.recipient_gstin}
                    >
                        <input
                            maxLength={15}
                            value={form.data.recipient_gstin}
                            onChange={(event) =>
                                form.setData(
                                    'recipient_gstin',
                                    event.target.value.toUpperCase(),
                                )
                            }
                            className={control}
                        />
                    </Field>
                    <Field label="HSN / SAC" error={form.errors.hsn_code}>
                        <input
                            value={form.data.hsn_code}
                            onChange={(event) =>
                                form.setData('hsn_code', event.target.value)
                            }
                            className={control}
                        />
                    </Field>
                    <Field label="GST rate" error={form.errors.gst_rate}>
                        <select
                            value={form.data.gst_rate}
                            onChange={(event) =>
                                form.setData('gst_rate', event.target.value)
                            }
                            className={control}
                        >
                            {['0', '0.25', '3', '5', '12', '18', '28'].map(
                                (rate) => (
                                    <option key={rate} value={rate}>
                                        {rate}%
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>
                    <Field label="Cess rate" error={form.errors.cess_rate}>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={form.data.cess_rate}
                            onChange={(event) =>
                                form.setData('cess_rate', event.target.value)
                            }
                            className={control}
                        />
                    </Field>
                    <Field label="Options" wide>
                        <div className="mt-3 flex flex-wrap gap-6 text-sm">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.data.prices_include_tax}
                                    onChange={(event) =>
                                        form.setData(
                                            'prices_include_tax',
                                            event.target.checked,
                                        )
                                    }
                                />{' '}
                                Prices include tax
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.data.reverse_charge}
                                    onChange={(event) =>
                                        form.setData(
                                            'reverse_charge',
                                            event.target.checked,
                                        )
                                    }
                                />{' '}
                                Reverse charge
                            </label>
                        </div>
                    </Field>
                    <Field
                        label="Internal / document notes"
                        error={form.errors.notes}
                        wide
                    >
                        <textarea
                            rows={3}
                            value={form.data.notes}
                            onChange={(event) =>
                                form.setData('notes', event.target.value)
                            }
                            className={`${control} h-auto py-3`}
                        />
                    </Field>
                </Panel>

                <div className="flex justify-end gap-3">
                    <Link
                        href={routes.index.url()}
                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold dark:border-white/10"
                    >
                        Cancel
                    </Link>
                    <button
                        disabled={form.processing}
                        className="rounded-xl bg-orange-500 px-6 text-sm font-bold text-white disabled:opacity-50"
                    >
                        Generate draft
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

function Panel({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-xl font-black">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div>
        </section>
    );
}
function Field({
    label,
    error,
    wide = false,
    children,
}: {
    label: string;
    error?: string;
    wide?: boolean;
    children: ReactNode;
}) {
    return (
        <label
            className={`text-xs font-bold text-slate-600 dark:text-slate-300 ${wide ? 'md:col-span-2' : ''}`}
        >
            {label}
            {children}
            {error && <span className="mt-1 block text-rose-600">{error}</span>}
        </label>
    );
}
