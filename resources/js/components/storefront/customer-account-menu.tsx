import { Link, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    MapPin,
    MessageSquareText,
    UserRound,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dashboard, logout } from '@/routes';
import { edit as profile } from '@/routes/customer/profile';
import type { User } from '@/types';

const accountLinks = [
    {
        label: 'Dashboard',
        href: dashboard.url(),
        icon: LayoutDashboard,
    },
    {
        label: 'My orders',
        href: `${dashboard.url()}#orders`,
        icon: ClipboardList,
    },
    {
        label: 'Track order',
        href: `${dashboard.url()}#track-order`,
        icon: MapPin,
    },
    {
        label: 'Product reviews',
        href: `${dashboard.url()}#reviews`,
        icon: MessageSquareText,
    },
    {
        label: 'My profile',
        href: profile.url(),
        icon: UserRound,
    },
];

export default function CustomerAccountMenu({
    mobile = false,
}: {
    mobile?: boolean;
}) {
    const { auth } = usePage().props;
    const user = auth.user as User;
    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    if (mobile) {
        return (
            <div className="mt-4 rounded-2xl border border-slate-100 p-2 dark:border-white/10">
                <div className="flex items-center gap-3 px-2 py-2">
                    <span className="grid size-9 place-items-center rounded-xl bg-orange-500 text-xs font-black text-white">
                        {initials}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-black">
                            {user.name}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                            {user.email}
                        </p>
                    </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1">
                    {accountLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-500/10"
                            >
                                <Icon className="size-4" /> {item.label}
                            </Link>
                        );
                    })}
                    <Link
                        href={logout()}
                        method="post"
                        as="button"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                        <LogOut className="size-4" /> Logout
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="ml-1 inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 pr-4 pl-2 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition hover:bg-orange-500 dark:bg-orange-500"
                >
                    <span className="grid size-7 place-items-center rounded-full bg-white/15 text-[11px] font-black">
                        {initials}
                    </span>
                    My account
                    <ChevronDown className="size-3.5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-64 rounded-2xl border-slate-200 p-2 shadow-2xl dark:border-white/10"
            >
                <DropdownMenuLabel className="px-3 py-2">
                    <span className="block truncate text-sm font-black">
                        {user.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-normal text-slate-400">
                        {user.email}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accountLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                        <DropdownMenuItem
                            key={item.label}
                            asChild
                            className="rounded-xl px-3 py-2.5 font-bold"
                        >
                            <Link href={item.href}>
                                <Icon className="size-4" /> {item.label}
                            </Link>
                        </DropdownMenuItem>
                    );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    asChild
                    className="rounded-xl px-3 py-2.5 font-bold text-rose-600 focus:text-rose-600"
                >
                    <Link href={logout()} method="post" as="button">
                        <LogOut className="size-4" /> Logout
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
