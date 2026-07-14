import type { LucideIcon } from 'lucide-react';
import type { FormEventHandler, ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export function AdminPageHeader({
    title,
    description,
    action,
}: {
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-3xl">
                <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                    {title}
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {description}
                </p>
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </header>
    );
}

export function AdminPanel({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            className={cn(
                'overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-white/8 dark:bg-white/[0.04]',
                className,
            )}
        >
            {children}
        </section>
    );
}

export function AdminFilterBar({
    children,
    className,
    onSubmit,
}: {
    children: ReactNode;
    className?: string;
    onSubmit: FormEventHandler<HTMLFormElement>;
}) {
    return (
        <form
            onSubmit={onSubmit}
            className={cn(
                'grid gap-3 border-b border-slate-200/80 bg-slate-50/40 p-4 dark:border-white/8 dark:bg-white/[0.02]',
                className,
            )}
        >
            {children}
        </form>
    );
}

export function AdminEmptyState({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description?: string;
}) {
    return (
        <div className="grid place-items-center px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500">
                <Icon className="size-5" />
            </span>
            <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                {title}
            </p>
            {description && (
                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {description}
                </p>
            )}
        </div>
    );
}

const statusTones: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300',
    approved:
        'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300',
    delivered:
        'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300',
    paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300',
    verified:
        'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300',
    cancelled:
        'bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-300',
    failed: 'bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-300',
    high: 'bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-300',
    rejected:
        'bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-300',
    refunded:
        'bg-violet-50 text-violet-700 ring-violet-600/10 dark:bg-violet-500/10 dark:text-violet-300',
    shipped:
        'bg-sky-50 text-sky-700 ring-sky-600/10 dark:bg-sky-500/10 dark:text-sky-300',
    in_review:
        'bg-sky-50 text-sky-700 ring-sky-600/10 dark:bg-sky-500/10 dark:text-sky-300',
    processing:
        'bg-indigo-50 text-indigo-700 ring-indigo-600/10 dark:bg-indigo-500/10 dark:text-indigo-300',
    pending:
        'bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-300',
};

export function AdminStatusBadge({
    value,
    className,
}: {
    value: string;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ring-inset',
                statusTones[value] ??
                    'bg-slate-100 text-slate-700 ring-slate-600/10 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10',
                className,
            )}
        >
            {value.replaceAll('_', ' ')}
        </span>
    );
}

export function AdminConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    processing = false,
    onOpenChange,
    onConfirm,
}: {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    processing?: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border-slate-200 p-0 dark:border-white/10">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="leading-6">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="border-t border-slate-100 bg-slate-50/70 p-4 dark:border-white/8 dark:bg-white/[0.025]">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-500 disabled:opacity-50"
                    >
                        {processing ? 'Working...' : confirmLabel}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
