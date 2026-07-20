import { Form, Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
    AlertTriangle,
    Ban,
    ChevronRight,
    FileWarning,
    Filter,
    Gavel,
    Radar,
    Save,
    Search,
    SearchX,
    ShieldAlert,
    ShieldCheck,
    SlidersHorizontal,
} from 'lucide-react';
import {
    AdminEmptyState,
    AdminPageHeader,
    AdminPanel,
    AdminStatusBadge,
} from '@/components/admin/primitives';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import { update as updateTrustSafetyCase } from '@/actions/App/Http/Controllers/Admin/TrustSafetyController';
import admin from '@/routes/admin';

type CatalogItem = {
    key: string;
    label: string;
    group: string;
    count: number;
};

type Filters = {
    section: string;
    search: string;
    status: string;
    severity: string;
};

type TrustSafetySection = {
    key: string;
    label: string;
    description: string;
    kind: 'case' | 'restriction' | 'rule' | 'queue';
};

type Metrics = {
    open_cases: number;
    high_risk: number;
    in_review: number;
    active_restrictions: number;
    active_rules: number;
};

type RiskRow = {
    id: number;
    type: 'case' | 'restriction' | 'rule';
    reference: string;
    title: string;
    category: string;
    status: string;
    severity: string;
    score: number | null;
    source: string | null;
    owner: string | null;
    occurred_at: string | null;
    resolution_notes?: string | null;
    expires_at?: string | null;
    matches?: number | null;
};

type Props = {
    catalog: CatalogItem[];
    filters: Filters;
    section: TrustSafetySection;
    metrics: Metrics;
    rows: RiskRow[];
};

const number = new Intl.NumberFormat('en-IN');

export default function TrustSafetyIndex({
    catalog,
    filters,
    section,
    metrics,
    rows,
}: Props) {
    const groups = Object.entries(
        catalog.reduce<Record<string, CatalogItem[]>>((result, item) => {
            (result[item.group] ??= []).push(item);

            return result;
        }, {}),
    );
    const cards = [
        {
            label: 'Open cases',
            value: number.format(metrics.open_cases),
            note: 'Open or in review',
            icon: ShieldAlert,
            tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
        },
        {
            label: 'High risk',
            value: number.format(metrics.high_risk),
            note: 'High and critical severity',
            icon: AlertTriangle,
            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
        },
        {
            label: 'Manual review',
            value: number.format(metrics.in_review),
            note: 'Currently assigned to analysts',
            icon: Radar,
            tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
        },
        {
            label: 'Active controls',
            value: number.format(
                metrics.active_restrictions + metrics.active_rules,
            ),
            note: `${number.format(metrics.active_restrictions)} restrictions, ${number.format(metrics.active_rules)} rules`,
            icon: ShieldCheck,
            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
        },
    ];

    return (
        <AdminLayout
            title="Trust & Safety"
            breadcrumb={`Trust & Safety / ${section.label}`}
        >
            <Head title="Trust & Safety" />
            <AdminPageHeader
                title="Trust and safety"
                description="Monitor marketplace risk signals, enforcement lists, detection rules, and manual review decisions from one operations workspace."
            />

            <div className="mt-6 grid items-start gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
                <AdminPanel className="xl:sticky xl:top-6">
                    <div className="border-b border-slate-200/75 p-4 dark:border-white/10">
                        <div className="flex items-center gap-2 text-sm font-black">
                            <ShieldAlert className="size-4 text-orange-500" />
                            Risk workspace
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            {catalog.length} trust and safety queues
                        </p>
                    </div>
                    <nav className="max-h-[calc(100vh-13rem)] overflow-y-auto p-2">
                        {groups.map(([group, items]) => (
                            <div key={group} className="py-2">
                                <p className="px-2 pb-1 text-[10px] font-black tracking-[0.16em] text-slate-400 uppercase">
                                    {group}
                                </p>
                                <div className="grid gap-0.5">
                                    {items.map((item) => (
                                        <Link
                                            key={item.key}
                                            href={sectionUrl(item.key, filters)}
                                            preserveScroll
                                            className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold transition ${
                                                item.key === section.key
                                                    ? 'bg-orange-500 text-white shadow-sm'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
                                            }`}
                                        >
                                            <span className="truncate">
                                                {item.label}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <strong className="text-[10px]">
                                                    {number.format(item.count)}
                                                </strong>
                                                <ChevronRight className="size-3.5 opacity-50" />
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </AdminPanel>

                <div className="min-w-0">
                    <AdminPanel>
                        <Form
                            {...admin.trustSafety.form()}
                            options={{ preserveScroll: true }}
                            className="grid gap-3 p-4 lg:grid-cols-[minmax(11rem,0.85fr)_minmax(13rem,1fr)_minmax(9rem,0.55fr)_minmax(9rem,0.55fr)_auto] lg:items-end"
                        >
                            <SelectField
                                icon={SlidersHorizontal}
                                label="Queue"
                                name="section"
                                defaultValue={section.key}
                                options={catalog.map((item) => ({
                                    value: item.key,
                                    label: item.label,
                                }))}
                            />
                            <label className="grid gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                                <span className="flex items-center gap-1.5">
                                    <Search className="size-3.5" /> Search
                                </span>
                                <input
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Case number, rule, IP, account"
                                    className={controlClass}
                                />
                            </label>
                            <SelectField
                                icon={Filter}
                                label="Status"
                                name="status"
                                defaultValue={filters.status}
                                options={[
                                    { value: '', label: 'Any status' },
                                    { value: 'open', label: 'Open' },
                                    {
                                        value: 'in_review',
                                        label: 'In review',
                                    },
                                    { value: 'resolved', label: 'Resolved' },
                                    { value: 'dismissed', label: 'Dismissed' },
                                ]}
                            />
                            <SelectField
                                icon={AlertTriangle}
                                label="Severity"
                                name="severity"
                                defaultValue={filters.severity}
                                options={[
                                    { value: '', label: 'Any severity' },
                                    { value: 'low', label: 'Low' },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'high', label: 'High' },
                                    { value: 'critical', label: 'Critical' },
                                ]}
                            />
                            <button
                                type="submit"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-black text-white transition hover:bg-orange-600"
                            >
                                <Filter className="size-4" />
                                Apply
                            </button>
                        </Form>
                    </AdminPanel>

                    <div className="mt-6">
                        <StatCards cards={cards} />
                    </div>

                    <AdminPanel className="mt-6">
                        <header className="flex flex-col justify-between gap-3 border-b border-slate-200/75 p-5 sm:flex-row sm:items-start sm:p-6 dark:border-white/10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <SectionIcon kind={section.kind} />
                                    <h3 className="text-lg font-black">
                                        {section.label}
                                    </h3>
                                </div>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {section.description}
                                </p>
                            </div>
                            <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                                {number.format(rows.length)} visible records
                            </span>
                        </header>

                        {rows.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-black tracking-wide text-slate-500 uppercase dark:border-white/10 dark:bg-white/[0.025]">
                                        <tr>
                                            <th className="px-5 py-3.5 pl-6">
                                                Signal
                                            </th>
                                            <th className="px-5 py-3.5">
                                                Risk
                                            </th>
                                            <th className="px-5 py-3.5">
                                                Source
                                            </th>
                                            <th className="px-5 py-3.5">
                                                Timeline
                                            </th>
                                            <th className="px-5 py-3.5 pr-6">
                                                Decision
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {rows.map((row) => (
                                            <tr
                                                key={`${row.type}-${row.id}`}
                                                className="align-top transition hover:bg-orange-50/35 dark:hover:bg-orange-500/[0.035]"
                                            >
                                                <td className="min-w-72 px-5 py-4 pl-6">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-300">
                                                            <RowIcon
                                                                type={row.type}
                                                            />
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] font-bold text-slate-400">
                                                                {row.reference}
                                                            </p>
                                                            <p className="mt-1 font-bold text-slate-900 dark:text-white">
                                                                {row.title}
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-500 capitalize">
                                                                {row.category.replaceAll(
                                                                    '_',
                                                                    ' ',
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="min-w-44 px-5 py-4">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <AdminStatusBadge
                                                            value={row.status}
                                                        />
                                                        <SeverityBadge
                                                            value={row.severity}
                                                        />
                                                    </div>
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        Score:{' '}
                                                        <strong className="text-slate-700 dark:text-slate-200">
                                                            {row.score === null
                                                                ? 'n/a'
                                                                : number.format(
                                                                      row.score,
                                                                  )}
                                                        </strong>
                                                    </p>
                                                </td>
                                                <td className="min-w-44 px-5 py-4 text-xs text-slate-500">
                                                    <p className="font-semibold text-slate-700 capitalize dark:text-slate-200">
                                                        {row.source?.replaceAll(
                                                            '_',
                                                            ' ',
                                                        ) ?? 'Manual'}
                                                    </p>
                                                    <p className="mt-1">
                                                        Owner:{' '}
                                                        {row.owner ??
                                                            'Unassigned'}
                                                    </p>
                                                    {row.matches !==
                                                        undefined && (
                                                        <p className="mt-1">
                                                            Matches:{' '}
                                                            {number.format(
                                                                row.matches ??
                                                                    0,
                                                            )}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="min-w-44 px-5 py-4 text-xs text-slate-500">
                                                    <time>
                                                        {formatDateTime(
                                                            row.occurred_at,
                                                        )}
                                                    </time>
                                                    {row.expires_at && (
                                                        <p className="mt-1 text-amber-600 dark:text-amber-300">
                                                            Expires{' '}
                                                            {formatDateTime(
                                                                row.expires_at,
                                                            )}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="min-w-80 px-5 py-4 pr-6">
                                                    {row.type === 'case' ? (
                                                        <CaseReviewForm
                                                            row={row}
                                                        />
                                                    ) : (
                                                        <ReadonlyAction
                                                            row={row}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <AdminEmptyState
                                icon={SearchX}
                                title="No trust and safety records found"
                                description="Try another queue, clear the search term, or widen the status and severity filters."
                            />
                        )}
                    </AdminPanel>
                </div>
            </div>
        </AdminLayout>
    );
}

function CaseReviewForm({ row }: { row: RiskRow }) {
    const form = useForm({
        status: row.status,
        severity: row.severity,
        resolution_notes: row.resolution_notes ?? '',
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.patch(updateTrustSafetyCase.url(row.id), {
            preserveScroll: true,
        });
    };
    const firstError = Object.values(form.errors)[0];

    return (
        <form onSubmit={submit} className="grid gap-2">
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <select
                    value={form.data.status}
                    onChange={(event) =>
                        form.setData('status', event.target.value)
                    }
                    className={compactControlClass}
                >
                    <option value="open">Open</option>
                    <option value="in_review">In review</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                </select>
                <select
                    value={form.data.severity}
                    onChange={(event) =>
                        form.setData('severity', event.target.value)
                    }
                    className={compactControlClass}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-3 text-xs font-black text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-400"
                >
                    <Save className="size-3.5" />
                    {form.processing ? 'Saving' : 'Save'}
                </button>
            </div>
            <input
                value={form.data.resolution_notes}
                onChange={(event) =>
                    form.setData('resolution_notes', event.target.value)
                }
                placeholder="Resolution notes"
                className={compactControlClass}
            />
            {firstError && (
                <p className="text-[11px] text-rose-600">{firstError}</p>
            )}
        </form>
    );
}

function ReadonlyAction({ row }: { row: RiskRow }) {
    const message =
        row.type === 'rule'
            ? 'Rule configuration is tracked here for review.'
            : 'Restriction lifecycle is tracked here for review.';

    return (
        <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-white/[0.035] dark:text-slate-400">
            <p className="font-semibold text-slate-700 dark:text-slate-200">
                {row.status === 'active' ? 'Active control' : 'Read only'}
            </p>
            <p className="mt-1">{message}</p>
        </div>
    );
}

function SelectField({
    icon: Icon,
    label,
    name,
    defaultValue,
    options,
}: {
    icon: LucideIcon;
    label: string;
    name: string;
    defaultValue: string;
    options: { value: string; label: string }[];
}) {
    return (
        <label className="grid gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
                <Icon className="size-3.5" /> {label}
            </span>
            <select
                name={name}
                defaultValue={defaultValue}
                className={controlClass}
            >
                {options.map((option) => (
                    <option key={option.value || 'any'} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function SeverityBadge({ value }: { value: string }) {
    const tones: Record<string, string> = {
        critical:
            'bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-300',
        high: 'bg-orange-50 text-orange-700 ring-orange-600/10 dark:bg-orange-500/10 dark:text-orange-300',
        medium: 'bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-300',
        low: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ring-inset ${
                tones[value] ??
                'bg-slate-100 text-slate-700 ring-slate-600/10 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10'
            }`}
        >
            {value}
        </span>
    );
}

function SectionIcon({ kind }: { kind: TrustSafetySection['kind'] }) {
    const Icon =
        kind === 'restriction'
            ? Ban
            : kind === 'rule'
              ? SlidersHorizontal
              : kind === 'queue'
                ? Radar
                : ShieldAlert;

    return <Icon className="size-5 text-orange-500" />;
}

function RowIcon({ type }: { type: RiskRow['type'] }) {
    const Icon =
        type === 'restriction' ? Ban : type === 'rule' ? Gavel : FileWarning;

    return <Icon className="size-4" />;
}

function sectionUrl(section: string, filters: Filters): string {
    const query: Record<string, string> = { section };

    if (filters.search) {
        query.search = filters.search;
    }

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.severity) {
        query.severity = filters.severity;
    }

    return admin.trustSafety.url({ query });
}

function formatDateTime(value: string | null): string {
    if (!value) {
        return 'Not recorded';
    }

    return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

const controlClass =
    'h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5';

const compactControlClass =
    'min-h-9 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-orange-400 dark:border-white/10 dark:bg-[#101722]';
