import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Camera,
    Check,
    PackageCheck,
    Upload,
    X,
} from 'lucide-react';
import { money } from '@/components/storefront/catalog';
import StorefrontLayout from '@/layouts/storefront-layout';
import { index as orders } from '@/routes/customer/orders';
import { cancel, store } from '@/routes/customer/returns';

type EligibleItem = {
    id: number;
    order_number: string;
    product_name: string;
    variant_name: string | null;
    return_eligible_until: string | null;
};

type Address = {
    id: number;
    recipient_name: string;
    line_1: string;
    city: string;
    state: string;
    postal_code: string;
};

type ReturnCase = {
    id: number;
    number: string;
    type: string;
    reason_code: string;
    status: string;
    refund_amount: string;
    reverse_carrier: string | null;
    tracking_number: string | null;
    pickup_slot_at: string | null;
    exchange_attributes: Record<string, string> | null;
    order: { number: string };
    order_item: {
        product_name: string;
        variant_name: string | null;
        total: string;
    };
    payment_refunds: Array<{
        id: number;
        number: string;
        amount: string;
        status: string;
    }>;
};

export default function CustomerReturns({
    returns,
    eligibleItems,
    addresses,
}: {
    returns: ReturnCase[];
    eligibleItems: EligibleItem[];
    addresses: Address[];
}) {
    return (
        <StorefrontLayout>
            <Head title="Returns, replacements and exchanges" />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <Link
                    href={orders()}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600"
                >
                    <ArrowLeft className="size-4" /> Order history
                </Link>

                <section className="mt-6 rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
                    <p className="text-xs font-black tracking-wider text-orange-300 uppercase">
                        After-sales care
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                        Returns, replacements & exchanges
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-300">
                        Submit evidence, choose pickup details, and track every
                        step from approval to refund or replacement.
                    </p>
                </section>

                <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <section className="grid content-start gap-4">
                        <h2 className="text-xl font-black">Request tracking</h2>
                        {returns.length ? (
                            returns.map((returnCase) => (
                                <ReturnCard
                                    key={returnCase.id}
                                    returnCase={returnCase}
                                />
                            ))
                        ) : (
                            <div className="rounded-[1.75rem] border border-dashed border-slate-300 p-10 text-center dark:border-white/10">
                                <PackageCheck className="mx-auto size-8 text-slate-300" />
                                <p className="mt-3 font-black">
                                    No active requests
                                </p>
                            </div>
                        )}
                    </section>

                    <RequestForm
                        eligibleItems={eligibleItems}
                        addresses={addresses}
                    />
                </div>
            </main>
        </StorefrontLayout>
    );
}

function RequestForm({
    eligibleItems,
    addresses,
}: {
    eligibleItems: EligibleItem[];
    addresses: Address[];
}) {
    return (
        <aside className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-5 lg:sticky lg:top-28 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-xl font-black">Start a request</h2>
            <Form
                {...store.form()}
                encType="multipart/form-data"
                options={{ preserveScroll: true }}
                className="mt-5 grid gap-4"
                resetOnSuccess
            >
                {({ errors, processing, progress }) => (
                    <>
                        <Field
                            label="Delivered item"
                            error={errors.order_item_id}
                        >
                            <select name="order_item_id" required>
                                <option value="">Choose an item</option>
                                {eligibleItems.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.order_number} ·{' '}
                                        {item.product_name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Request type" error={errors.type}>
                            <select name="type" required>
                                <option value="return">
                                    Return for refund
                                </option>
                                <option value="replacement">Replacement</option>
                                <option value="size_exchange">
                                    Size exchange
                                </option>
                                <option value="color_exchange">
                                    Color exchange
                                </option>
                            </select>
                        </Field>
                        <Field
                            label="Requested size or color"
                            error={errors.exchange_value}
                        >
                            <input
                                name="exchange_value"
                                placeholder="Example: XL or Midnight blue"
                            />
                        </Field>
                        <Field label="Return reason" error={errors.reason_code}>
                            <select name="reason_code" required>
                                <option value="damaged">Damaged</option>
                                <option value="defective">Defective</option>
                                <option value="wrong_item">Wrong item</option>
                                <option value="not_as_described">
                                    Not as described
                                </option>
                                <option value="size_issue">Size issue</option>
                                <option value="color_issue">Color issue</option>
                                <option value="changed_mind">
                                    Changed my mind
                                </option>
                                <option value="other">Other</option>
                            </select>
                        </Field>
                        <Field
                            label="Additional details"
                            error={errors.reason_details}
                        >
                            <textarea name="reason_details" rows={3} />
                        </Field>
                        <Field
                            label="Pickup address"
                            error={errors.pickup_address_id}
                        >
                            <select name="pickup_address_id" required>
                                <option value="">Choose an address</option>
                                {addresses.map((address) => (
                                    <option key={address.id} value={address.id}>
                                        {address.line_1}, {address.city}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field
                            label="Pickup slot"
                            error={errors.pickup_slot_at}
                        >
                            <input
                                type="datetime-local"
                                name="pickup_slot_at"
                                required
                            />
                        </Field>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="rounded-xl border border-dashed border-slate-300 p-3 text-xs font-black dark:border-white/10">
                                <Camera className="mb-2 size-4 text-orange-500" />
                                Product images
                                <input
                                    type="file"
                                    name="images[]"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp"
                                    className="mt-2 block w-full text-[10px]"
                                />
                            </label>
                            <label className="rounded-xl border border-dashed border-slate-300 p-3 text-xs font-black dark:border-white/10">
                                <Upload className="mb-2 size-4 text-orange-500" />
                                Product video
                                <input
                                    type="file"
                                    name="video"
                                    accept="video/mp4,video/quicktime,video/webm"
                                    className="mt-2 block w-full text-[10px]"
                                />
                            </label>
                        </div>
                        {(errors.images || errors.video) && (
                            <p className="text-xs text-rose-500">
                                {errors.images ?? errors.video}
                            </p>
                        )}
                        {progress && (
                            <progress
                                value={progress.percentage}
                                max="100"
                                className="w-full"
                            />
                        )}
                        <button
                            type="submit"
                            disabled={processing || eligibleItems.length === 0}
                            className="rounded-full bg-orange-500 px-5 py-3.5 text-sm font-black text-white disabled:opacity-40"
                        >
                            {processing
                                ? 'Uploading request…'
                                : 'Submit request'}
                        </button>
                    </>
                )}
            </Form>
        </aside>
    );
}

function ReturnCard({ returnCase }: { returnCase: ReturnCase }) {
    const stages = [
        'requested',
        'approved',
        'pickup_scheduled',
        'in_transit',
        'received',
        returnCase.type === 'return' ? 'refunded' : 'completed',
    ];
    const statusIndex = stages.indexOf(returnCase.status);

    return (
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase">
                        {returnCase.number} ·{' '}
                        {returnCase.type.replaceAll('_', ' ')}
                    </p>
                    <h3 className="mt-1 font-black">
                        {returnCase.order_item.product_name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Order {returnCase.order.number}
                    </p>
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-black text-orange-600 uppercase dark:bg-orange-500/10">
                    {returnCase.status.replaceAll('_', ' ')}
                </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {stages.map((stage, index) => (
                    <div key={stage}>
                        <span
                            className={`mx-auto grid size-7 place-items-center rounded-full text-xs ${statusIndex >= index ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-white/5'}`}
                        >
                            {statusIndex >= index ? (
                                <Check className="size-3.5" />
                            ) : (
                                index + 1
                            )}
                        </span>
                        <p className="mt-1.5 text-center text-[8px] font-bold text-slate-500 capitalize">
                            {stage.replaceAll('_', ' ')}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs dark:border-white/10">
                <div>
                    <p className="font-bold text-slate-500">
                        {returnCase.reverse_carrier ?? 'Pickup partner pending'}
                        {' · '}
                        {returnCase.tracking_number ?? 'Tracking pending'}
                    </p>
                    {returnCase.payment_refunds[0] && (
                        <p className="mt-1 font-black text-emerald-600">
                            Refund{' '}
                            {money.format(
                                Number(returnCase.payment_refunds[0].amount),
                            )}{' '}
                            · {returnCase.payment_refunds[0].status}
                        </p>
                    )}
                </div>
                {['requested', 'approved'].includes(returnCase.status) && (
                    <Form {...cancel.form(returnCase.id)}>
                        {({ processing }) => (
                            <>
                                <input
                                    type="hidden"
                                    name="confirmed"
                                    value="1"
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-1 font-black text-rose-500"
                                >
                                    <X className="size-3.5" /> Cancel request
                                </button>
                            </>
                        )}
                    </Form>
                )}
            </div>
        </article>
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
        <label className="grid gap-1.5 text-xs font-black [&_input]:h-11 [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-200 [&_input]:bg-transparent [&_input]:px-3 dark:[&_input]:border-white/10 [&_select]:h-11 [&_select]:rounded-xl [&_select]:border [&_select]:border-slate-200 [&_select]:bg-transparent [&_select]:px-3 dark:[&_select]:border-white/10 [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-slate-200 [&_textarea]:bg-transparent [&_textarea]:p-3 dark:[&_textarea]:border-white/10">
            {label}
            {children}
            {error && <span className="text-rose-500">{error}</span>}
        </label>
    );
}
