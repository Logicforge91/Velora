import { Head, Link, useForm } from '@inertiajs/react';
import {
    Activity,
    CheckCircle2,
    ChevronRight,
    CircleOff,
    Eye,
    EyeOff,
    KeyRound,
    Plug,
    Save,
    ScrollText,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/integrations';

type Field = {
    label: string;
    type: 'text' | 'password';
    secret: boolean;
    placeholder?: string;
};
type Definition = {
    label: string;
    description: string;
    providers: Record<string, string>;
    fields: Record<string, Field>;
};
type IntegrationState = {
    provider: string;
    enabled: boolean;
    status: string;
    configuration: Record<string, string>;
    credentials_configured: Record<string, boolean>;
    updated_at: string | null;
};
type IntegrationLog = {
    id: number;
    category: string;
    action: string;
    status: string;
    message: string;
    occurred_at: string;
    actor?: { id: number; name: string } | null;
    integration?: { id: number; category: string; provider: string } | null;
};

export default function IntegrationsIndex({
    definitions,
    integrations,
    logs,
}: {
    definitions: Record<string, Definition>;
    integrations: Record<string, IntegrationState>;
    logs: IntegrationLog[];
}) {
    const requestedSection =
        typeof window === 'undefined'
            ? Object.keys(definitions)[0]
            : (new URLSearchParams(window.location.search).get('section') ??
              Object.keys(definitions)[0]);
    const activeKey =
        requestedSection === 'logs' || requestedSection in definitions
            ? requestedSection
            : Object.keys(definitions)[0];

    return (
        <AdminLayout
            title="Integrations"
            breadcrumb="Administration / Integrations"
        >
            <Head title="Integrations" />
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black tracking-tight">
                    Integrations
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Connect trusted providers without exposing credentials to
                    the browser or application logs.
                </p>
            </div>

            <section className="mt-5 grid gap-3 sm:grid-cols-3">
                <Metric
                    label="Configured"
                    value={
                        Object.values(integrations).filter(
                            ({ status }) => status === 'configured',
                        ).length
                    }
                    tone="emerald"
                />
                <Metric
                    label="Enabled"
                    value={
                        Object.values(integrations).filter(
                            ({ enabled }) => enabled,
                        ).length
                    }
                    tone="orange"
                />
                <Metric label="Log events" value={logs.length} tone="slate" />
            </section>

            <div className="mt-5 grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
                <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
                    <div className="border-b border-slate-100 px-4 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:border-white/8">
                        Providers
                    </div>
                    <nav className="max-h-[38rem] overflow-y-auto p-2">
                        {Object.entries(definitions).map(
                            ([key, definition]) => (
                                <IntegrationLink
                                    key={key}
                                    section={key}
                                    label={definition.label}
                                    active={activeKey === key}
                                    configured={
                                        integrations[key]?.status ===
                                        'configured'
                                    }
                                />
                            ),
                        )}
                        <IntegrationLink
                            section="logs"
                            label="Integration Logs"
                            active={activeKey === 'logs'}
                            configured={logs.length > 0}
                        />
                    </nav>
                </aside>

                {activeKey === 'logs' ? (
                    <LogsPanel logs={logs} />
                ) : (
                    <IntegrationForm
                        key={activeKey}
                        category={activeKey}
                        definition={definitions[activeKey]}
                        integration={integrations[activeKey]}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

function Metric({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone: 'emerald' | 'orange' | 'slate';
}) {
    const styles = {
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10',
        slate: 'bg-slate-100 text-slate-600 dark:bg-white/10',
    };

    return (
        <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
            <span
                className={`grid size-10 place-items-center rounded-xl ${styles[tone]}`}
            >
                <Plug className="size-4" />
            </span>
            <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {label}
                </p>
                <p className="text-xl font-black">{value}</p>
            </div>
        </article>
    );
}

function IntegrationLink({
    section,
    label,
    active,
    configured,
}: {
    section: string;
    label: string;
    active: boolean;
    configured: boolean;
}) {
    return (
        <Link
            href={routes.index.url({ query: { section } })}
            preserveScroll
            className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                active
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
            }`}
        >
            <span className="flex min-w-0 items-center gap-2.5">
                {section === 'logs' ? (
                    <ScrollText className="size-3.5 shrink-0" />
                ) : (
                    <Plug className="size-3.5 shrink-0" />
                )}
                <span className="truncate">{label}</span>
            </span>
            <span className="flex items-center gap-1.5">
                <span
                    className={`size-1.5 rounded-full ${configured ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                />
                <ChevronRight className="size-3.5 opacity-50" />
            </span>
        </Link>
    );
}

function IntegrationForm({
    category,
    definition,
    integration,
}: {
    category: string;
    definition: Definition;
    integration: IntegrationState;
}) {
    const configuration: Record<string, string> = {};
    const credentials: Record<string, string> = {};

    Object.entries(definition.fields).forEach(([key, field]) => {
        if (field.secret) {
            credentials[key] = '';
        } else {
            configuration[key] = integration.configuration[key] ?? '';
        }
    });

    const form = useForm({
        provider: integration.provider,
        enabled: integration.enabled,
        configuration,
        credentials,
    });
    const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(
        new Set(),
    );
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.patch(routes.update.url(category), { preserveScroll: true });
    };

    return (
        <form
            onSubmit={submit}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.035]"
        >
            <header className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6 dark:border-white/8">
                <div className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                        <Plug className="size-5" />
                    </span>
                    <div>
                        <h3 className="font-black">{definition.label}</h3>
                        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                            {definition.description}
                        </p>
                    </div>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold">
                    <input
                        type="checkbox"
                        checked={form.data.enabled}
                        onChange={(event) =>
                            form.setData('enabled', event.target.checked)
                        }
                        className="size-4 accent-orange-500"
                    />
                    Enabled
                </label>
            </header>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Provider
                    <select
                        value={form.data.provider}
                        onChange={(event) =>
                            form.setData('provider', event.target.value)
                        }
                        className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                    >
                        {Object.entries(definition.providers).map(
                            ([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ),
                        )}
                    </select>
                </label>
                <div className="flex items-end">
                    <div className="flex h-10 w-full items-center gap-2 rounded-xl bg-slate-50 px-3 text-xs font-semibold dark:bg-white/5">
                        {integration.status === 'configured' ? (
                            <CheckCircle2 className="size-4 text-emerald-500" />
                        ) : (
                            <CircleOff className="size-4 text-slate-400" />
                        )}
                        <span className="capitalize">
                            {integration.status.replaceAll('_', ' ')}
                        </span>
                    </div>
                </div>

                {Object.entries(definition.fields).map(([key, field]) => {
                    const configured =
                        integration.credentials_configured[key] ?? false;
                    const visible = visibleSecrets.has(key);

                    return (
                        <label
                            key={key}
                            className="text-xs font-bold text-slate-600 dark:text-slate-300"
                        >
                            <span className="flex items-center justify-between gap-2">
                                {field.label}
                                {field.secret && configured && (
                                    <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                                        <ShieldCheck className="size-3" />{' '}
                                        Stored
                                    </span>
                                )}
                            </span>
                            <span className="relative mt-2 block">
                                <input
                                    type={
                                        field.secret && !visible
                                            ? 'password'
                                            : 'text'
                                    }
                                    value={
                                        field.secret
                                            ? form.data.credentials[key]
                                            : form.data.configuration[key]
                                    }
                                    onChange={(event) =>
                                        field.secret
                                            ? form.setData('credentials', {
                                                  ...form.data.credentials,
                                                  [key]: event.target.value,
                                              })
                                            : form.setData('configuration', {
                                                  ...form.data.configuration,
                                                  [key]: event.target.value,
                                              })
                                    }
                                    placeholder={
                                        field.secret && configured
                                            ? 'Leave blank to keep stored value'
                                            : field.placeholder
                                    }
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pr-10 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-[#101722]"
                                />
                                {field.secret && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const next = new Set(
                                                visibleSecrets,
                                            );
                                            if (visible) {
                                                next.delete(key);
                                            } else {
                                                next.add(key);
                                            }

                                            setVisibleSecrets(next);
                                        }}
                                        className="absolute top-0 right-0 grid size-10 place-items-center text-slate-400"
                                        aria-label={`${visible ? 'Hide' : 'Show'} ${field.label}`}
                                    >
                                        {visible ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                )}
                            </span>
                            {form.errors[
                                `${field.secret ? 'credentials' : 'configuration'}.${key}`
                            ] && (
                                <span className="mt-1 block text-[10px] text-rose-600">
                                    {
                                        form.errors[
                                            `${field.secret ? 'credentials' : 'configuration'}.${key}`
                                        ]
                                    }
                                </span>
                            )}
                        </label>
                    );
                })}
            </div>

            <footer className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-white/8 dark:bg-white/[0.02]">
                <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <KeyRound className="size-3.5" /> Secrets are encrypted at
                    rest and never returned.
                </p>
                <button
                    disabled={form.processing || !form.isDirty}
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-5 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                >
                    <Save className="size-4" />
                    {form.processing ? 'Saving…' : 'Save integration'}
                </button>
            </footer>
        </form>
    );
}

function LogsPanel({ logs }: { logs: IntegrationLog[] }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
            <header className="border-b border-slate-100 p-5 sm:p-6 dark:border-white/8">
                <h3 className="font-black">Integration Logs</h3>
                <p className="mt-1 text-xs text-slate-500">
                    Recent configuration and provider events. Secret values are
                    never recorded.
                </p>
            </header>
            {logs.length === 0 ? (
                <div className="grid min-h-64 place-items-center p-8 text-center">
                    <div>
                        <Activity className="mx-auto size-8 text-slate-300" />
                        <p className="mt-3 text-sm font-bold">No events yet</p>
                        <p className="mt-1 text-xs text-slate-500">
                            Integration changes will appear here.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="divide-y divide-slate-100 dark:divide-white/8">
                    {logs.map((log) => (
                        <article
                            key={log.id}
                            className="flex items-start gap-3 px-5 py-4 sm:px-6"
                        >
                            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                                <CheckCircle2 className="size-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm font-semibold">
                                        {log.message}
                                    </p>
                                    <time className="text-[10px] text-slate-400">
                                        {new Date(
                                            log.occurred_at,
                                        ).toLocaleString()}
                                    </time>
                                </div>
                                <p className="mt-1 text-[11px] text-slate-500">
                                    {log.actor?.name ?? 'System'} ·{' '}
                                    {log.integration?.provider ?? log.category}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
