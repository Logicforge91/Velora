import { History, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { AccountRoleOption, UserHistory } from '@/types/admin';

const actionStyles = {
    created: {
        label: 'User created',
        icon: Plus,
        tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
    },
    updated: {
        label: 'User updated',
        icon: RefreshCw,
        tone: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300',
    },
    deleted: {
        label: 'User deleted',
        icon: Trash2,
        tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300',
    },
};

function labelFor(attribute: string): string {
    return attribute
        .replaceAll('_', ' ')
        .replace(/^./, (letter) => letter.toUpperCase());
}

function displayValue(
    attribute: string,
    value: string | boolean | null,
    roles: AccountRoleOption[],
): string {
    if (attribute === 'password') {
        return value === 'updated' ? 'Changed' : 'Hidden';
    }

    if (attribute === 'role' && typeof value === 'string') {
        return roles.find((role) => role.value === value)?.label ?? value;
    }

    if (attribute === 'status' && typeof value === 'boolean') {
        return value ? 'Active' : 'Inactive';
    }

    return value === null || value === '' ? 'Not set' : String(value);
}

export default function UserHistoryList({
    entries,
    roles = [],
}: {
    entries: UserHistory[];
    roles?: AccountRoleOption[];
}) {
    if (entries.length === 0) {
        return (
            <div className="grid place-items-center px-6 py-12 text-center">
                <span className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/5">
                    <History className="size-5" />
                </span>
                <p className="mt-3 text-sm font-semibold">
                    No history recorded
                </p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-slate-100 dark:divide-white/5">
            {entries.map((entry) => {
                const style = actionStyles[entry.action];
                const Icon = style.icon;

                return (
                    <article
                        key={entry.id}
                        className="flex gap-4 px-5 py-5 sm:px-6"
                    >
                        <span
                            className={`grid size-10 shrink-0 place-items-center rounded-xl ${style.tone}`}
                        >
                            <Icon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                                <div>
                                    <p className="text-sm font-semibold">
                                        {style.label}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                        by {entry.actor?.name ?? 'System'}
                                        {entry.ip_address
                                            ? ` · ${entry.ip_address}`
                                            : ''}
                                    </p>
                                </div>
                                <time
                                    className="shrink-0 text-xs text-slate-400"
                                    dateTime={entry.created_at}
                                >
                                    {formatDateTime(entry.created_at)}
                                </time>
                            </div>
                            {entry.changes && (
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {Object.entries(entry.changes).map(
                                        ([attribute, change]) => (
                                            <div
                                                key={attribute}
                                                className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs dark:bg-white/[0.035]"
                                            >
                                                <p className="font-semibold text-slate-600 dark:text-slate-300">
                                                    {labelFor(attribute)}
                                                </p>
                                                <p className="mt-1 truncate text-slate-500 dark:text-slate-400">
                                                    <span className="line-through opacity-70">
                                                        {displayValue(
                                                            attribute,
                                                            change.from,
                                                            roles,
                                                        )}
                                                    </span>
                                                    <span className="px-1.5">
                                                        →
                                                    </span>
                                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                                                        {displayValue(
                                                            attribute,
                                                            change.to,
                                                            roles,
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
