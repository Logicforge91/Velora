import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/types/admin';

export default function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            className="flex flex-wrap gap-1 border-t border-slate-200 px-6 py-4 dark:border-white/10"
            aria-label="Pagination"
        >
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        className={`rounded-lg px-3 py-2 text-sm ${link.active ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={`${link.label}-${index}`}
                        className="px-3 py-2 text-sm text-slate-300"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </nav>
    );
}
