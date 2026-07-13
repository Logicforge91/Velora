import { Link } from '@inertiajs/react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/audit-logs';
import type { AdminAuditLog } from '@/types/admin';

export default function AuditLogShow({
    log,
    isAuthentic,
}: {
    log: AdminAuditLog;
    isAuthentic: boolean;
}) {
    return (
        <AdminLayout
            title="Audit Event"
            breadcrumb="Security / Audit trail / Event"
        >
            <Link
                href={routes.index.url()}
                className="text-sm font-bold text-indigo-600"
            >
                ← Back to audit trail
            </Link>
            <div className="mt-5 grid gap-6 xl:grid-cols-[1fr_21rem]">
                <main className="grid gap-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                        <div className="flex flex-wrap justify-between gap-4">
                            <div>
                                <p className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                                    {log.category} · {log.action}
                                </p>
                                <h2 className="mt-2 text-2xl font-black">
                                    {log.description}
                                </h2>
                                <p className="mt-2 font-mono text-xs text-slate-400">
                                    {log.event_uuid}
                                </p>
                            </div>
                            <span
                                className={`h-fit rounded-full px-3 py-1 text-xs font-black uppercase ${log.succeeded ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                            >
                                {log.succeeded ? 'Succeeded' : 'Failed'}
                            </span>
                        </div>
                        <dl className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <Info
                                label="Actor"
                                value={
                                    log.actor
                                        ? `${log.actor.name} · ${log.actor.email}`
                                        : 'System'
                                }
                            />
                            <Info
                                label="Occurred"
                                value={new Date(
                                    log.occurred_at,
                                ).toLocaleString()}
                            />
                            <Info label="Severity" value={log.severity} />
                            <Info
                                label="Request"
                                value={`${log.method} /${log.path}`}
                            />
                            <Info
                                label="HTTP response"
                                value={String(log.response_status)}
                            />
                            <Info
                                label="Duration"
                                value={`${log.duration_ms} ms`}
                            />
                            <Info
                                label="IP address"
                                value={log.ip_address ?? 'Unknown'}
                            />
                            <Info
                                label="Route"
                                value={log.route_name ?? 'Unknown'}
                            />
                            <Info
                                label="Target"
                                value={
                                    log.auditable_type
                                        ? `${log.auditable_type} #${log.auditable_id}`
                                        : 'No bound model'
                                }
                            />
                        </dl>
                    </section>
                    <section className="grid gap-6 lg:grid-cols-2">
                        <JsonPanel
                            title="Before values"
                            value={log.before_values}
                        />
                        <JsonPanel
                            title="After values"
                            value={log.after_values}
                        />
                    </section>
                    <JsonPanel
                        title="Sanitized request metadata"
                        value={log.metadata}
                    />
                </main>
                <aside className="grid content-start gap-5">
                    <section
                        className={`rounded-2xl border p-5 ${isAuthentic ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10' : 'border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10'}`}
                    >
                        <div className="flex items-center gap-2">
                            {isAuthentic ? (
                                <CheckCircle2 className="size-5 text-emerald-600" />
                            ) : (
                                <ShieldAlert className="size-5 text-rose-600" />
                            )}
                            <h3 className="font-black">
                                Integrity verification
                            </h3>
                        </div>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            {isAuthentic
                                ? 'The event checksum matches its stored contents.'
                                : 'Checksum mismatch detected. This record may have been altered.'}
                        </p>
                    </section>
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs font-black text-slate-400 uppercase">
                            SHA-256 HMAC
                        </p>
                        <p className="mt-3 font-mono text-xs break-all">
                            {log.record_hash}
                        </p>
                        <p className="mt-5 text-xs font-black text-slate-400 uppercase">
                            User agent
                        </p>
                        <p className="mt-2 text-xs break-words text-slate-500">
                            {log.user_agent ?? 'Unknown'}
                        </p>
                    </section>
                </aside>
            </div>
        </AdminLayout>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-black tracking-wide text-slate-400 uppercase">
                {label}
            </dt>
            <dd className="mt-1 text-sm font-medium break-words capitalize">
                {value}
            </dd>
        </div>
    );
}
function JsonPanel({
    title,
    value,
}: {
    title: string;
    value: Record<string, unknown> | null;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
            <h3 className="border-b border-slate-200 px-5 py-4 font-black dark:border-white/10">
                {title}
            </h3>
            <pre className="max-h-[32rem] overflow-auto p-5 text-xs leading-6 text-slate-600 dark:text-slate-300">
                {value ? JSON.stringify(value, null, 2) : 'No values captured.'}
            </pre>
        </section>
    );
}
