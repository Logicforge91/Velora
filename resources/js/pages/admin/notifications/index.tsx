import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    ChevronRight,
    FileText,
    History,
    Mail,
    MessageCircle,
    MessageSquareText,
    Save,
    ShieldCheck,
    Smartphone,
    Users,
    Workflow,
} from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/notifications';

type Audience = 'admin' | 'seller' | 'customer';
type Channel = 'mail' | 'sms' | 'push' | 'whatsapp';
type Template = {
    id: number;
    name: string;
    slug: string;
    channel: Channel;
    audience: Audience;
    subject: string | null;
    body: string;
    variables: string[] | null;
    enabled: boolean;
    updated_at: string;
};
type Rule = {
    id: number;
    name: string;
    event: string;
    audience: Audience;
    channels: string[];
    templates: Record<string, number> | null;
    enabled: boolean;
};
type Delivery = {
    id: number;
    uuid: string;
    channel: string;
    audience: string;
    recipient: string;
    status: string;
    attempts: number;
    error_message: string | null;
    created_at: string;
    template?: { id: number; name: string; channel: string } | null;
    rule?: { id: number; name: string; event: string } | null;
};
type Counts = Record<
    | 'admin'
    | 'seller'
    | 'customer'
    | 'email_templates'
    | 'sms_templates'
    | 'push_templates'
    | 'whatsapp_templates'
    | 'rules'
    | 'history'
    | 'failed',
    number
>;

const sections = [
    ['admin', 'Admin Notifications', ShieldCheck],
    ['seller', 'Seller Notifications', Users],
    ['customer', 'Customer Notifications', Bell],
    ['email-templates', 'Email Templates', Mail],
    ['sms-templates', 'SMS Templates', MessageSquareText],
    ['push-templates', 'Push Templates', Smartphone],
    ['whatsapp-templates', 'WhatsApp Templates', MessageCircle],
    ['rules', 'Notification Rules', Workflow],
    ['history', 'Notification History', History],
    ['failed', 'Failed Notifications', AlertTriangle],
] as const;

export default function NotificationsIndex({
    counts,
    templates,
    rules,
    history,
    failed,
}: {
    counts: Counts;
    templates: Template[];
    rules: Rule[];
    history: Delivery[];
    failed: Delivery[];
}) {
    const requested =
        typeof window === 'undefined'
            ? 'admin'
            : (new URLSearchParams(window.location.search).get('section') ??
              'admin');
    const active = sections.some(([key]) => key === requested)
        ? requested
        : 'admin';

    return (
        <AdminLayout
            title="Notifications"
            breadcrumb="Administration / Notifications"
        >
            <Head title="Notifications" />
            <div>
                <h2 className="text-xl font-black tracking-tight">
                    Notifications
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage audience rules, channel templates and delivery
                    health.
                </p>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
                    {sections.map(([key, label, Icon]) => (
                        <Link
                            key={key}
                            href={routes.index.url({ query: { section: key } })}
                            preserveScroll
                            className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                                active === key
                                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300'
                                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
                            }`}
                        >
                            <span className="flex items-center gap-2.5">
                                <Icon className="size-3.5" /> {label}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <strong className="text-[10px]">
                                    {countForSection(key, counts)}
                                </strong>
                                <ChevronRight className="size-3.5 opacity-50" />
                            </span>
                        </Link>
                    ))}
                </aside>

                {(['admin', 'seller', 'customer'] as string[]).includes(
                    active,
                ) ? (
                    <AudiencePanel
                        audience={active as Audience}
                        rules={rules.filter(
                            ({ audience }) => audience === active,
                        )}
                    />
                ) : active.endsWith('-templates') ? (
                    <TemplatePanel
                        channel={active.replace('-templates', '') as Channel}
                        templates={templates.filter(
                            ({ channel }) =>
                                channel === active.replace('-templates', ''),
                        )}
                    />
                ) : active === 'rules' ? (
                    <RulesPanel rules={rules} templates={templates} />
                ) : (
                    <DeliveryPanel
                        title={
                            active === 'failed'
                                ? 'Failed Notifications'
                                : 'Notification History'
                        }
                        deliveries={active === 'failed' ? failed : history}
                        failedOnly={active === 'failed'}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

function countForSection(key: string, counts: Counts): number {
    const mapping: Record<string, keyof Counts> = {
        admin: 'admin',
        seller: 'seller',
        customer: 'customer',
        'email-templates': 'email_templates',
        'sms-templates': 'sms_templates',
        'push-templates': 'push_templates',
        'whatsapp-templates': 'whatsapp_templates',
        rules: 'rules',
        history: 'history',
        failed: 'failed',
    };

    return counts[mapping[key]];
}

function AudiencePanel({
    audience,
    rules,
}: {
    audience: Audience;
    rules: Rule[];
}) {
    return (
        <Panel
            title={`${headline(audience)} Notifications`}
            description={`Delivery rules currently targeting ${audience} accounts.`}
        >
            {rules.length === 0 ? (
                <Empty message={`No ${audience} notification rules yet.`} />
            ) : (
                <div className="divide-y divide-slate-100 dark:divide-white/8">
                    {rules.map((rule) => (
                        <div
                            key={rule.id}
                            className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                        >
                            <div>
                                <p className="text-sm font-bold">{rule.name}</p>
                                <p className="mt-1 text-[11px] text-slate-500">
                                    {rule.event} · {rule.channels.join(', ')}
                                </p>
                            </div>
                            <Status enabled={rule.enabled} />
                        </div>
                    ))}
                </div>
            )}
        </Panel>
    );
}

function TemplatePanel({
    channel,
    templates,
}: {
    channel: Channel;
    templates: Template[];
}) {
    const form = useForm({
        name: '',
        slug: '',
        channel,
        audience: 'customer' as Audience,
        subject: '',
        body: '',
        variables: [] as string[],
        enabled: true,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(routes.templates.store.url(), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <div className="grid gap-5">
            <Panel
                title={`${headline(channel)} Templates`}
                description="Create or update a reusable channel message. Reusing a slug updates the existing template."
            >
                <form
                    onSubmit={submit}
                    className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6"
                >
                    <Input
                        label="Template name"
                        value={form.data.name}
                        onChange={(value) => form.setData('name', value)}
                    />
                    <Input
                        label="Slug (optional)"
                        value={form.data.slug}
                        onChange={(value) => form.setData('slug', value)}
                    />
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Audience
                        <select
                            value={form.data.audience}
                            onChange={(event) =>
                                form.setData(
                                    'audience',
                                    event.target.value as Audience,
                                )
                            }
                            className={control}
                        >
                            <option value="admin">Admin</option>
                            <option value="seller">Seller</option>
                            <option value="customer">Customer</option>
                        </select>
                    </label>
                    {channel === 'mail' && (
                        <Input
                            label="Subject"
                            value={form.data.subject}
                            onChange={(value) => form.setData('subject', value)}
                        />
                    )}
                    <label className="text-xs font-bold text-slate-600 sm:col-span-2 dark:text-slate-300">
                        Message body
                        <textarea
                            required
                            rows={5}
                            value={form.data.body}
                            onChange={(event) =>
                                form.setData('body', event.target.value)
                            }
                            className={control}
                        />
                    </label>
                    <Input
                        label="Variables (comma separated)"
                        value={form.data.variables.join(', ')}
                        onChange={(value) =>
                            form.setData(
                                'variables',
                                value
                                    .split(',')
                                    .map((item) => item.trim())
                                    .filter(Boolean),
                            )
                        }
                    />
                    <div className="flex items-end justify-end">
                        <button
                            disabled={form.processing}
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-5 text-xs font-bold text-white disabled:opacity-50"
                        >
                            <Save className="size-4" /> Save template
                        </button>
                    </div>
                    {Object.values(form.errors)[0] && (
                        <p className="text-xs text-rose-600 sm:col-span-2">
                            {Object.values(form.errors)[0]}
                        </p>
                    )}
                </form>
            </Panel>
            <Panel
                title="Saved templates"
                description={`${templates.length} ${channel} templates configured.`}
            >
                {templates.length === 0 ? (
                    <Empty message="No templates for this channel." />
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/8">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="px-5 py-4 sm:px-6"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-bold">
                                        {template.name}
                                    </p>
                                    <Status enabled={template.enabled} />
                                </div>
                                <p className="mt-1 line-clamp-2 text-[11px] text-slate-500">
                                    {template.subject ?? template.body}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </Panel>
        </div>
    );
}

function RulesPanel({
    rules,
    templates,
}: {
    rules: Rule[];
    templates: Template[];
}) {
    const form = useForm({
        name: '',
        event: '',
        audience: 'customer' as Audience,
        channels: ['database'] as string[],
        templates: {} as Record<string, number>,
        conditions: {} as Record<string, string>,
        enabled: true,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(routes.rules.store.url(), { preserveScroll: true });
    };

    return (
        <div className="grid gap-5">
            <Panel
                title="Notification Rules"
                description="Map application events to audiences and delivery channels."
            >
                <form
                    onSubmit={submit}
                    className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6"
                >
                    <Input
                        label="Rule name"
                        value={form.data.name}
                        onChange={(value) => form.setData('name', value)}
                    />
                    <Input
                        label="Event key"
                        value={form.data.event}
                        onChange={(value) => form.setData('event', value)}
                        placeholder="orders.created"
                    />
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Audience
                        <select
                            value={form.data.audience}
                            onChange={(event) =>
                                form.setData(
                                    'audience',
                                    event.target.value as Audience,
                                )
                            }
                            className={control}
                        >
                            <option value="admin">Admin</option>
                            <option value="seller">Seller</option>
                            <option value="customer">Customer</option>
                        </select>
                    </label>
                    <div className="flex flex-wrap items-end gap-3">
                        {['database', 'mail', 'sms', 'push', 'whatsapp'].map(
                            (channel) => (
                                <label
                                    key={channel}
                                    className="flex items-center gap-1.5 text-xs font-semibold"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.data.channels.includes(
                                            channel,
                                        )}
                                        onChange={(event) =>
                                            form.setData(
                                                'channels',
                                                event.target.checked
                                                    ? [
                                                          ...form.data.channels,
                                                          channel,
                                                      ]
                                                    : form.data.channels.filter(
                                                          (item) =>
                                                              item !== channel,
                                                      ),
                                            )
                                        }
                                    />
                                    {channel}
                                </label>
                            ),
                        )}
                    </div>
                    <label className="text-xs font-bold text-slate-600 sm:col-span-2 dark:text-slate-300">
                        Default template
                        <select
                            className={control}
                            onChange={(event) =>
                                event.target.value &&
                                form.setData('templates', {
                                    default: Number(event.target.value),
                                })
                            }
                        >
                            <option value="">No template mapping</option>
                            {templates.map((template) => (
                                <option key={template.id} value={template.id}>
                                    {template.name} · {template.channel}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="flex justify-end sm:col-span-2">
                        <button
                            disabled={form.processing}
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-5 text-xs font-bold text-white disabled:opacity-50"
                        >
                            <Workflow className="size-4" /> Save rule
                        </button>
                    </div>
                    {Object.values(form.errors)[0] && (
                        <p className="text-xs text-rose-600 sm:col-span-2">
                            {Object.values(form.errors)[0]}
                        </p>
                    )}
                </form>
            </Panel>
            <Panel
                title="Configured rules"
                description={`${rules.length} event rules configured.`}
            >
                {rules.length === 0 ? (
                    <Empty message="No notification rules configured." />
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/8">
                        {rules.map((rule) => (
                            <div
                                key={rule.id}
                                className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                            >
                                <div>
                                    <p className="text-sm font-bold">
                                        {rule.name}
                                    </p>
                                    <p className="mt-1 text-[11px] text-slate-500">
                                        {rule.event} · {rule.audience} ·{' '}
                                        {rule.channels.join(', ')}
                                    </p>
                                </div>
                                <Status enabled={rule.enabled} />
                            </div>
                        ))}
                    </div>
                )}
            </Panel>
        </div>
    );
}

function DeliveryPanel({
    title,
    deliveries,
    failedOnly,
}: {
    title: string;
    deliveries: Delivery[];
    failedOnly: boolean;
}) {
    return (
        <Panel
            title={title}
            description={
                failedOnly
                    ? 'Deliveries requiring investigation or retry.'
                    : 'Latest notification delivery attempts across all channels.'
            }
        >
            {deliveries.length === 0 ? (
                <Empty
                    message={
                        failedOnly
                            ? 'No failed notifications.'
                            : 'No delivery history yet.'
                    }
                />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-100 text-[10px] tracking-wider text-slate-400 uppercase dark:border-white/8">
                            <tr>
                                <th className="px-5 py-3">Recipient</th>
                                <th className="px-4 py-3">Channel</th>
                                <th className="px-4 py-3">Template / event</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-5 py-3">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/8">
                            {deliveries.map((delivery) => (
                                <tr key={delivery.id}>
                                    <td className="px-5 py-4 font-semibold">
                                        {delivery.recipient}
                                    </td>
                                    <td className="px-4 py-4 capitalize">
                                        {delivery.channel}
                                    </td>
                                    <td className="px-4 py-4 text-slate-500">
                                        {delivery.template?.name ??
                                            delivery.rule?.event ??
                                            'Direct'}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={
                                                delivery.status === 'failed'
                                                    ? 'text-rose-600'
                                                    : 'text-emerald-600'
                                            }
                                        >
                                            {delivery.status}
                                        </span>
                                        {delivery.error_message && (
                                            <p className="mt-1 max-w-xs truncate text-[10px] text-rose-500">
                                                {delivery.error_message}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-slate-500">
                                        {new Date(
                                            delivery.created_at,
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Panel>
    );
}

function Panel({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
            <header className="border-b border-slate-100 p-5 sm:p-6 dark:border-white/8">
                <h3 className="font-black">{title}</h3>
                <p className="mt-1 text-xs text-slate-500">{description}</p>
            </header>
            {children}
        </section>
    );
}

const control =
    'mt-2 min-h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-[#101722]';
function Input({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {label}
            <input
                required={!label.includes('optional')}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className={control}
            />
        </label>
    );
}
function Status({ enabled }: { enabled: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold ${enabled ? 'text-emerald-600' : 'text-slate-400'}`}
        >
            {enabled ? (
                <CheckCircle2 className="size-3" />
            ) : (
                <AlertTriangle className="size-3" />
            )}
            {enabled ? 'Enabled' : 'Disabled'}
        </span>
    );
}
function Empty({ message }: { message: string }) {
    return (
        <div className="grid min-h-44 place-items-center p-8 text-center">
            <div>
                <FileText className="mx-auto size-8 text-slate-300" />
                <p className="mt-3 text-sm font-bold">{message}</p>
                <p className="mt-1 text-xs text-slate-500">
                    Saved configuration will appear here.
                </p>
            </div>
        </div>
    );
}
function headline(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
