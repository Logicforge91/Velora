import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Activity,
    CalendarClock,
    CheckCircle2,
    ChevronRight,
    DatabaseBackup,
    FileClock,
    HardDrive,
    RefreshCw,
    Save,
    SearchCheck,
    Settings2,
    ShieldAlert,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/system-settings';

type SettingValue = string | number | boolean;
type Field = {
    label: string;
    type: 'text' | 'email' | 'number' | 'textarea' | 'boolean';
    default: SettingValue;
    min?: number;
    max?: number;
};
type Definition = {
    label: string;
    description: string;
    fields: Record<string, Field>;
};
type Operations = {
    cache_driver: string;
    queue_driver: string;
    queued_jobs: number;
    failed_jobs: number;
    maintenance: boolean;
    database_driver: string;
    last_backup: string | null;
    log_size: number;
};

const operationalSections = [
    { key: 'cache', label: 'Cache Management', icon: RefreshCw },
    { key: 'queue', label: 'Queue Monitor', icon: Activity },
    { key: 'scheduled-jobs', label: 'Scheduled Jobs', icon: CalendarClock },
    { key: 'backup', label: 'Database Backup', icon: DatabaseBackup },
    { key: 'maintenance', label: 'Maintenance Mode', icon: Wrench },
    { key: 'logs', label: 'System Logs', icon: FileClock },
];

export default function SystemSettingsIndex({
    definitions,
    settings,
    operations,
}: {
    definitions: Record<string, Definition>;
    settings: Record<string, Record<string, SettingValue>>;
    operations: Operations;
}) {
    const requestedSection =
        typeof window === 'undefined'
            ? 'general'
            : (new URLSearchParams(window.location.search).get('section') ??
              'general');
    const activeKey =
        requestedSection in definitions ||
        operationalSections.some(({ key }) => key === requestedSection)
            ? requestedSection
            : 'general';
    const definition = definitions[activeKey];

    return (
        <AdminLayout
            title="System Settings"
            breadcrumb="Administration / System Settings"
        >
            <Head title="System Settings" />
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                    System settings
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Configure marketplace behaviour and monitor core application
                    services.
                </p>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
                <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
                    <div className="border-b border-slate-100 px-4 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:border-white/8">
                        Commerce configuration
                    </div>
                    <nav className="max-h-[34rem] overflow-y-auto p-2">
                        {Object.entries(definitions).map(([key, item]) => (
                            <SettingsLink
                                key={key}
                                section={key}
                                label={item.label}
                                active={activeKey === key}
                            />
                        ))}
                    </nav>
                    <div className="border-y border-slate-100 px-4 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:border-white/8">
                        System operations
                    </div>
                    <nav className="p-2">
                        {operationalSections.map(({ key, label }) => (
                            <SettingsLink
                                key={key}
                                section={key}
                                label={label}
                                active={activeKey === key}
                            />
                        ))}
                    </nav>
                </aside>

                {definition ? (
                    <SettingsForm
                        key={activeKey}
                        group={activeKey}
                        definition={definition}
                        values={settings[activeKey]}
                    />
                ) : (
                    <OperationsPanel
                        section={activeKey}
                        operations={operations}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

function SettingsLink({
    section,
    label,
    active,
}: {
    section: string;
    label: string;
    active: boolean;
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
            <span className="flex items-center gap-2.5">
                <Settings2 className="size-3.5" />
                {label}
            </span>
            <ChevronRight className="size-3.5 opacity-50" />
        </Link>
    );
}

function SettingsForm({
    group,
    definition,
    values,
}: {
    group: string;
    definition: Definition;
    values: Record<string, SettingValue>;
}) {
    const form = useForm({ settings: values });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.patch(routes.update.url(group), { preserveScroll: true });
    };
    const update = (key: string, value: SettingValue) =>
        form.setData('settings', { ...form.data.settings, [key]: value });

    return (
        <form
            onSubmit={submit}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.035]"
        >
            <header className="flex items-start gap-4 border-b border-slate-100 p-5 sm:p-6 dark:border-white/8">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                    <Settings2 className="size-5" />
                </span>
                <div>
                    <h3 className="font-black text-slate-950 dark:text-white">
                        {definition.label}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        {definition.description}
                    </p>
                </div>
            </header>
            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                {Object.entries(definition.fields).map(([key, field]) => (
                    <SettingField
                        key={key}
                        field={field}
                        value={form.data.settings[key]}
                        error={form.errors[`settings.${key}`]}
                        onChange={(value) => update(key, value)}
                    />
                ))}
            </div>
            <footer className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-white/8 dark:bg-white/[0.02]">
                {form.recentlySuccessful && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="size-4" /> Saved
                    </span>
                )}
                <button
                    disabled={form.processing || !form.isDirty}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-5 text-xs font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="size-4" />
                    {form.processing ? 'Saving…' : 'Save changes'}
                </button>
            </footer>
        </form>
    );
}

function SettingField({
    field,
    value,
    error,
    onChange,
}: {
    field: Field;
    value: SettingValue;
    error?: string;
    onChange: (value: SettingValue) => void;
}) {
    if (field.type === 'boolean') {
        return (
            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-white/10">
                <span className="text-sm font-semibold">{field.label}</span>
                <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => onChange(event.target.checked)}
                    className="size-4 accent-orange-500"
                />
            </label>
        );
    }

    const className =
        'mt-2 min-h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-white/10 dark:bg-[#101722] dark:focus:ring-orange-500/10';

    return (
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {field.label}
            {field.type === 'textarea' ? (
                <textarea
                    rows={4}
                    value={String(value ?? '')}
                    onChange={(event) => onChange(event.target.value)}
                    className={className}
                />
            ) : (
                <input
                    type={field.type}
                    min={field.min}
                    max={field.max}
                    value={String(value ?? '')}
                    onChange={(event) =>
                        onChange(
                            field.type === 'number'
                                ? Number(event.target.value)
                                : event.target.value,
                        )
                    }
                    className={className}
                />
            )}
            {error && (
                <span className="mt-1 block text-[11px] text-rose-600">
                    {error}
                </span>
            )}
        </label>
    );
}

function OperationsPanel({
    section,
    operations,
}: {
    section: string;
    operations: Operations;
}) {
    const sectionDetails = {
        cache: {
            icon: RefreshCw,
            title: 'Cache Management',
            description: `Active driver: ${operations.cache_driver}`,
            status: 'Ready',
            action: () =>
                window.confirm('Clear all application cache entries?') &&
                router.delete(routes.cache.clear.url(), {
                    preserveScroll: true,
                }),
            actionLabel: 'Clear cache',
        },
        queue: {
            icon: Activity,
            title: 'Queue Monitor',
            description: `${operations.queued_jobs} queued · ${operations.failed_jobs} failed · ${operations.queue_driver} driver`,
            status: operations.failed_jobs > 0 ? 'Needs attention' : 'Healthy',
        },
        'scheduled-jobs': {
            icon: CalendarClock,
            title: 'Scheduled Jobs',
            description:
                'Review recurring application tasks from the scheduler.',
            status: 'Configured by console routes',
        },
        backup: {
            icon: DatabaseBackup,
            title: 'Database Backup',
            description: operations.last_backup
                ? `Latest: ${operations.last_backup}`
                : `No backup found · ${operations.database_driver} driver`,
            status: operations.last_backup ? 'Available' : 'Not created',
            action: () =>
                router.post(routes.backups.store.url(), undefined, {
                    preserveScroll: true,
                }),
            actionLabel: 'Create backup',
        },
        maintenance: {
            icon: Wrench,
            title: 'Maintenance Mode',
            description:
                'Application availability is controlled through Laravel maintenance mode.',
            status: operations.maintenance
                ? 'Maintenance active'
                : 'Application online',
        },
        logs: {
            icon: FileClock,
            title: 'System Logs',
            description: `${formatBytes(operations.log_size)} application log · audit activity is available from Administration.`,
            status: 'Recording',
        },
    }[section];

    if (!sectionDetails) {
        return null;
    }

    const Icon = sectionDetails.icon;

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
            <div className="border-b border-slate-100 p-6 dark:border-white/8">
                <span className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                    <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-black">
                    {sectionDetails.title}
                </h3>
                <p className="mt-1 max-w-xl text-sm text-slate-500">
                    {sectionDetails.description}
                </p>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-3">
                <StatusCard
                    icon={ShieldAlert}
                    label="Status"
                    value={sectionDetails.status}
                />
                <StatusCard
                    icon={HardDrive}
                    label="Environment"
                    value={operations.database_driver}
                />
                <StatusCard
                    icon={SearchCheck}
                    label="Failed jobs"
                    value={operations.failed_jobs.toLocaleString()}
                />
            </div>
            {'action' in sectionDetails && sectionDetails.action && (
                <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-white/8 dark:bg-white/[0.02]">
                    <button
                        onClick={sectionDetails.action}
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-5 text-xs font-bold text-white hover:bg-orange-600"
                    >
                        <RefreshCw className="size-4" />
                        {sectionDetails.actionLabel}
                    </button>
                </div>
            )}
        </section>
    );
}

function StatusCard({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
            <Icon className="size-4 text-orange-500" />
            <p className="mt-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {label}
            </p>
            <p className="mt-1 text-sm font-black text-slate-800 dark:text-slate-100">
                {value}
            </p>
        </div>
    );
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
