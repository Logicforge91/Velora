export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};
export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};
export type Counts = Record<string, number>;

export type Brand = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    logo_url: string | null;
    website_url: string | null;
    sort_order: number;
    is_featured: boolean;
    status: boolean;
};
export type Category = {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    image_url: string | null;
    sort_order: number;
    status: boolean;
    parent?: { id: number; name: string } | null;
    children_count?: number;
};
export type Vendor = {
    id: number;
    business_name: string;
    business_email: string;
    business_phone: string | null;
    tax_number: string | null;
    address: string | null;
    status: string;
    rejection_reason: string | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        status: boolean;
    };
    approved_by?: { id: number; name: string; email: string } | null;
};

export type AccountRoleOption = { value: string; label: string };
export type ManagedUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
};
export type UserHistory = {
    id: number;
    action: 'created' | 'updated' | 'deleted';
    changes: Record<
        string,
        { from: string | boolean | null; to: string | boolean | null }
    > | null;
    snapshot: Pick<ManagedUser, 'id' | 'name' | 'email' | 'role' | 'status'>;
    ip_address: string | null;
    created_at: string;
    actor: { id: number; name: string; email: string } | null;
};
