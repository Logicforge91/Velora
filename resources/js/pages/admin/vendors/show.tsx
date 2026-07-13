import { Link, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Download,
    FileCheck2,
    ShieldCheck,
    Upload,
} from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import vendorsRoutes from '@/routes/admin/vendors';
import type { Vendor, VendorKycDocument } from '@/types/admin';

const control =
    'mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-white/5';

export default function VendorShow({
    vendor,
    documentTypes,
    requiredDocumentTypes,
}: {
    vendor: Vendor;
    documentTypes: string[];
    requiredDocumentTypes: string[];
}) {
    const reject = useForm({ rejection_reason: '' });
    const approve = useForm({});
    const upload = useForm<{
        type: string;
        document_number: string;
        expires_on: string;
        document: File | null;
    }>({ type: '', document_number: '', expires_on: '', document: null });
    const risk = useForm({
        risk_level:
            vendor.risk_level === 'unassessed' ? 'low' : vendor.risk_level,
        risk_score: vendor.risk_score,
        risk_flags: vendor.risk_flags ?? [],
        notes: '',
    });

    const submitUpload = (event: FormEvent) => {
        event.preventDefault();
        upload.post(vendorsRoutes.kycDocuments.store.url(vendor.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => upload.reset(),
        });
    };
    const submitRisk = (event: FormEvent) => {
        event.preventDefault();
        risk.patch(vendorsRoutes.risk.update.url(vendor.id), {
            preserveScroll: true,
        });
    };
    const approveVendor = () => {
        if (confirm(`Approve ${vendor.business_name}?`)) {
            approve.patch(vendorsRoutes.approve.url(vendor.id));
        }
    };
    const submitReject = (event: FormEvent) => {
        event.preventDefault();
        reject.patch(vendorsRoutes.reject.url(vendor.id));
    };
    const canApprove =
        vendor.kyc_status === 'verified' && vendor.risk_level !== 'high';

    return (
        <AdminLayout
            title="Seller Onboarding Review"
            breadcrumb="Vendors / KYC review"
        >
            <Link
                href={vendorsRoutes.index.url()}
                className="text-sm font-bold text-indigo-600"
            >
                ← Back to sellers
            </Link>
            <div className="mt-5 grid gap-6 xl:grid-cols-[1fr_21rem]">
                <main className="grid gap-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                        <div className="flex flex-wrap justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-black">
                                    {vendor.business_name}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Application #{vendor.id} ·{' '}
                                    {vendor.business_email}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Badge value={vendor.status} />
                                <Badge value={`KYC ${vendor.kyc_status}`} />
                            </div>
                        </div>
                        <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <Info label="Owner" value={vendor.user.name} />
                            <Info
                                label="Phone"
                                value={vendor.business_phone ?? 'Not provided'}
                            />
                            <Info
                                label="GST / tax number"
                                value={vendor.tax_number ?? 'Not provided'}
                            />
                            <Info
                                label="Onboarding stage"
                                value={vendor.onboarding_stage}
                            />
                            <Info
                                label="Risk"
                                value={`${vendor.risk_level} · ${vendor.risk_score}/100`}
                            />
                            <Info
                                label="Applied"
                                value={new Date(
                                    vendor.created_at,
                                ).toLocaleString()}
                            />
                            <div className="sm:col-span-2 lg:col-span-3">
                                <Info
                                    label="Business address"
                                    value={vendor.address ?? 'Not provided'}
                                />
                            </div>
                        </dl>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-black">
                                    KYC document checklist
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Required documents must be individually
                                    verified before seller approval.
                                </p>
                            </div>
                            <FileCheck2 className="size-6 text-indigo-600" />
                        </div>
                        <div className="mt-6 grid gap-4">
                            {documentTypes.map((type) => {
                                const document = vendor.kyc_documents?.find(
                                    (item) => item.type === type,
                                );

                                return (
                                    <DocumentRow
                                        key={type}
                                        vendorId={vendor.id}
                                        type={type}
                                        required={requiredDocumentTypes.includes(
                                            type,
                                        )}
                                        document={document}
                                    />
                                );
                            })}
                        </div>
                    </section>

                    <form
                        onSubmit={submitUpload}
                        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5"
                    >
                        <h2 className="text-xl font-black">
                            Upload or replace document
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Files are stored privately and are only accessible
                            to authorized administrators.
                        </p>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <Field
                                label="Document type"
                                error={upload.errors.type}
                            >
                                <select
                                    value={upload.data.type}
                                    onChange={(event) =>
                                        upload.setData(
                                            'type',
                                            event.target.value,
                                        )
                                    }
                                    className={control}
                                >
                                    <option value="">Select type</option>
                                    {documentTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {label(type)}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field
                                label="Document number"
                                error={upload.errors.document_number}
                            >
                                <input
                                    value={upload.data.document_number}
                                    onChange={(event) =>
                                        upload.setData(
                                            'document_number',
                                            event.target.value,
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="Expiry date"
                                error={upload.errors.expires_on}
                            >
                                <input
                                    type="date"
                                    value={upload.data.expires_on}
                                    onChange={(event) =>
                                        upload.setData(
                                            'expires_on',
                                            event.target.value,
                                        )
                                    }
                                    className={control}
                                />
                            </Field>
                            <Field
                                label="PDF or image · max 10 MB"
                                error={upload.errors.document}
                            >
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                                    onChange={(event) =>
                                        upload.setData(
                                            'document',
                                            event.target.files?.[0] ?? null,
                                        )
                                    }
                                    className={`${control} py-2`}
                                />
                            </Field>
                        </div>
                        <button
                            disabled={upload.processing}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                        >
                            <Upload className="size-4" /> Upload securely
                        </button>
                    </form>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                        <h2 className="text-xl font-black">Review timeline</h2>
                        <div className="mt-5 grid gap-4">
                            {vendor.review_events?.map((event) => (
                                <div
                                    key={event.id}
                                    className="border-l-2 border-indigo-200 pl-4"
                                >
                                    <div className="flex flex-wrap justify-between gap-2">
                                        <p className="font-bold capitalize">
                                            {label(event.action)}
                                        </p>
                                        <time className="text-xs text-slate-500">
                                            {new Date(
                                                event.created_at,
                                            ).toLocaleString()}
                                        </time>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {event.actor?.name ?? 'System'}
                                        {event.from_status || event.to_status
                                            ? ` · ${event.from_status ?? 'new'} → ${event.to_status ?? 'updated'}`
                                            : ''}
                                    </p>
                                    {event.notes && (
                                        <p className="mt-1 text-sm">
                                            {event.notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                            {!vendor.review_events?.length && (
                                <p className="text-sm text-slate-500">
                                    No review events recorded yet.
                                </p>
                            )}
                        </div>
                    </section>
                </main>

                <aside className="grid content-start gap-5">
                    <form
                        onSubmit={submitRisk}
                        className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-5 text-indigo-600" />
                            <h3 className="font-black">Risk assessment</h3>
                        </div>
                        <Field
                            label="Risk level"
                            error={risk.errors.risk_level}
                        >
                            <select
                                value={risk.data.risk_level}
                                onChange={(event) =>
                                    risk.setData(
                                        'risk_level',
                                        event.target.value as
                                            'low' | 'medium' | 'high',
                                    )
                                }
                                className={control}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </Field>
                        <Field
                            label="Score (0–100)"
                            error={risk.errors.risk_score}
                        >
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={risk.data.risk_score}
                                onChange={(event) =>
                                    risk.setData(
                                        'risk_score',
                                        Number(event.target.value),
                                    )
                                }
                                className={control}
                            />
                        </Field>
                        <Field
                            label="Flags, separated by commas"
                            error={risk.errors.risk_flags}
                        >
                            <input
                                value={risk.data.risk_flags.join(', ')}
                                onChange={(event) =>
                                    risk.setData(
                                        'risk_flags',
                                        event.target.value
                                            .split(',')
                                            .map((value) => value.trim())
                                            .filter(Boolean),
                                    )
                                }
                                className={control}
                                placeholder="GST mismatch, duplicate bank"
                            />
                        </Field>
                        <Field
                            label="Assessment notes"
                            error={risk.errors.notes}
                        >
                            <textarea
                                rows={3}
                                value={risk.data.notes}
                                onChange={(event) =>
                                    risk.setData('notes', event.target.value)
                                }
                                className={`${control} h-auto py-3`}
                            />
                        </Field>
                        <button
                            disabled={risk.processing}
                            className="mt-4 w-full rounded-xl bg-slate-950 py-3 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                        >
                            Save assessment
                        </button>
                    </form>

                    {vendor.status === 'pending' ? (
                        <>
                            <section
                                className={`rounded-2xl border p-5 ${canApprove ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10' : 'border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10'}`}
                            >
                                <div className="flex gap-2">
                                    {canApprove ? (
                                        <CheckCircle2 className="size-5 text-emerald-600" />
                                    ) : (
                                        <AlertTriangle className="size-5 text-amber-600" />
                                    )}
                                    <h3 className="font-black">
                                        Approval readiness
                                    </h3>
                                </div>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    {canApprove
                                        ? 'KYC and risk checks permit activation.'
                                        : 'Verify required KYC and resolve high-risk findings.'}
                                </p>
                                <button
                                    type="button"
                                    onClick={approveVendor}
                                    disabled={!canApprove || approve.processing}
                                    className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Approve seller
                                </button>
                            </section>
                            <form
                                onSubmit={submitReject}
                                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"
                            >
                                <h3 className="font-black">
                                    Reject application
                                </h3>
                                <textarea
                                    rows={4}
                                    value={reject.data.rejection_reason}
                                    onChange={(event) =>
                                        reject.setData(
                                            'rejection_reason',
                                            event.target.value,
                                        )
                                    }
                                    className={`${control} h-auto py-3`}
                                    placeholder="Explain the decision"
                                />
                                {reject.errors.rejection_reason && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {reject.errors.rejection_reason}
                                    </p>
                                )}
                                <button
                                    disabled={reject.processing}
                                    className="mt-4 w-full rounded-xl bg-rose-600 py-3 text-sm font-bold text-white"
                                >
                                    Reject seller
                                </button>
                            </form>
                        </>
                    ) : (
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                            <h3 className="font-black">Final decision</h3>
                            <div className="mt-4 grid gap-3">
                                <Info label="Status" value={vendor.status} />
                                <Info
                                    label="Reviewed by"
                                    value={
                                        vendor.approved_by?.name ?? 'Unknown'
                                    }
                                />
                                {vendor.approved_at && (
                                    <Info
                                        label="Reviewed at"
                                        value={new Date(
                                            vendor.approved_at,
                                        ).toLocaleString()}
                                    />
                                )}
                            </div>
                        </section>
                    )}
                </aside>
            </div>
        </AdminLayout>
    );
}

function DocumentRow({
    vendorId,
    type,
    required,
    document,
}: {
    vendorId: number;
    type: string;
    required: boolean;
    document?: VendorKycDocument;
}) {
    const review = useForm({ status: 'verified', rejection_reason: '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (document) {
            review.patch(
                vendorsRoutes.kycDocuments.update.url({
                    vendor: vendorId,
                    kycDocument: document.id,
                }),
                { preserveScroll: true },
            );
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-black">{label(type)}</p>
                        {required && (
                            <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-black text-indigo-600 uppercase">
                                Required
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                        {document
                            ? `${document.original_name} · ${(document.size / 1024).toFixed(1)} KB`
                            : 'Not uploaded'}
                    </p>
                    {document?.rejection_reason && (
                        <p className="mt-1 text-xs text-rose-600">
                            {document.rejection_reason}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {document && (
                        <>
                            <Badge value={document.status} />
                            <a
                                href={vendorsRoutes.kycDocuments.download.url({
                                    vendor: vendorId,
                                    kycDocument: document.id,
                                })}
                                className="rounded-lg border border-slate-200 p-2 dark:border-white/10"
                                title="Download"
                            >
                                <Download className="size-4" />
                            </a>
                        </>
                    )}
                </div>
            </div>
            {document && (
                <form
                    onSubmit={submit}
                    className="mt-4 grid gap-2 sm:grid-cols-[9rem_1fr_auto]"
                >
                    <select
                        value={review.data.status}
                        onChange={(event) =>
                            review.setData('status', event.target.value)
                        }
                        className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs dark:border-white/10 dark:bg-[#101722]"
                    >
                        <option value="verified">Verify</option>
                        <option value="rejected">Reject</option>
                    </select>
                    <input
                        value={review.data.rejection_reason}
                        onChange={(event) =>
                            review.setData(
                                'rejection_reason',
                                event.target.value,
                            )
                        }
                        placeholder="Reason required when rejected"
                        className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-white/10 dark:bg-white/5"
                    />
                    <button
                        disabled={review.processing}
                        className="rounded-lg bg-indigo-600 px-4 text-xs font-bold text-white"
                    >
                        Save
                    </button>
                    {review.errors.rejection_reason && (
                        <p className="text-xs text-rose-600 sm:col-span-3">
                            {review.errors.rejection_reason}
                        </p>
                    )}
                </form>
            )}
        </div>
    );
}

function Field({
    label: text,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="mt-4 block text-xs font-bold text-slate-600 dark:text-slate-300">
            {text}
            {children}
            {error && <span className="mt-1 block text-rose-600">{error}</span>}
        </label>
    );
}
function Info({ label: text, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-black tracking-wide text-slate-400 uppercase">
                {text}
            </dt>
            <dd className="mt-1 text-sm font-medium whitespace-pre-line capitalize">
                {value.replaceAll('_', ' ')}
            </dd>
        </div>
    );
}
function Badge({ value }: { value: string }) {
    return (
        <span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase dark:bg-white/10">
            {value.replaceAll('_', ' ')}
        </span>
    );
}
function label(value: string) {
    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}
