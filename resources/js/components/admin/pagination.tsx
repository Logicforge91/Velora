import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/types/admin';

export default function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            className="flex flex-wrap items-center justify-center gap-1.5 border-t border-slate-200/80 bg-slate-50/50 px-6 py-4 sm:justify-end dark:border-white/8 dark:bg-white/[0.02]"
            aria-label="Pagination"
        >
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        className={`min-w-9 rounded-lg px-3 py-2 text-center text-sm font-medium transition ${link.active ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={`${link.label}-${index}`}
                        className="min-w-9 px-3 py-2 text-center text-sm text-slate-300 dark:text-slate-700"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </nav>
    );
}
