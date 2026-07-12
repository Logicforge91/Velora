import { usePage } from '@inertiajs/react';
import type { AccountPermission } from '@/types';

export function usePermission(permission: AccountPermission): boolean {
    return usePage().props.auth.permissions.includes(permission);
}
