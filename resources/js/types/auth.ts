export type AccountRole =
    'admin' | 'vendor' | 'customer' | 'delivery_agent' | 'support_agent';

export type AccountPermission =
    | 'admin.dashboard.view'
    | 'users.manage'
    | 'roles.manage'
    | 'vendors.manage'
    | 'catalogue.manage'
    | 'orders.manage'
    | 'payments.manage'
    | 'reports.view'
    | 'vendor.dashboard.view'
    | 'catalogue.own.manage'
    | 'orders.own.manage'
    | 'shop.access'
    | 'profile.own.manage'
    | 'delivery.dashboard.view'
    | 'deliveries.assigned.manage'
    | 'support.dashboard.view'
    | 'support.requests.manage';

export type User = {
    id: number;
    name: string;
    email: string;
    role: AccountRole;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    permissions: AccountPermission[];
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */
