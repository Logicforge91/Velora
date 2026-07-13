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

export type Product = {
    id: number;
    category_id: number | null;
    brand_id: number | null;
    name: string;
    slug: string;
    sku: string;
    short_description: string | null;
    description: string | null;
    price: string;
    compare_at_price: string | null;
    stock: number;
    low_stock_threshold: number;
    status: 'draft' | 'active' | 'archived';
    is_featured: boolean;
    created_at: string;
    category?: { id: number; name: string } | null;
    brand?: { id: number; name: string } | null;
    primary_image?: { id: number; url: string; path: string } | null;
};

export type OrderItem = {
    id: number;
    product_id: number | null;
    product_name: string;
    sku: string;
    unit_price: string;
    quantity: number;
    total: string;
    product?: Product | null;
};

export type Order = {
    id: number;
    number: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_method: string;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    shipping_address: Record<string, string>;
    subtotal: string;
    shipping_total: string;
    discount_total: string;
    total: string;
    customer_note: string | null;
    placed_at: string;
    items_count?: number;
    user: { id: number; name: string; email: string };
    items?: OrderItem[];
};
