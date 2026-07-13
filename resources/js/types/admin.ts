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

export type AdminAuditLog = {
    id: number;
    event_uuid: string;
    actor_id: number | null;
    category: string;
    action: string;
    severity: 'info' | 'notice' | 'warning' | 'critical';
    description: string;
    auditable_type: string | null;
    auditable_id: number | null;
    route_name: string | null;
    method: string;
    path: string;
    response_status: number;
    succeeded: boolean;
    duration_ms: number;
    ip_address: string | null;
    user_agent: string | null;
    before_values: Record<string, unknown> | null;
    after_values: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    record_hash: string;
    occurred_at: string;
    actor?: { id: number; name: string; email: string } | null;
};

export type CatalogImport = {
    id: number;
    uuid: string;
    original_name: string;
    status: string;
    dry_run: boolean;
    total_rows: number;
    processed_rows: number;
    created_rows: number;
    updated_rows: number;
    failed_rows: number;
    errors:
        { row: number | null; sku: string | null; message: string }[] | null;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    uploader?: { id: number; name: string; email: string } | null;
};

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
    kyc_status: 'pending' | 'in_review' | 'verified' | 'rejected';
    onboarding_stage: string;
    risk_level: 'unassessed' | 'low' | 'medium' | 'high';
    risk_score: number;
    risk_flags: string[] | null;
    submitted_at: string | null;
    kyc_verified_at: string | null;
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
    kyc_verified_by?: { id: number; name: string; email: string } | null;
    kyc_documents_count?: number;
    verified_documents_count?: number;
    kyc_documents?: VendorKycDocument[];
    review_events?: VendorReviewEvent[];
};

export type VendorKycDocument = {
    id: number;
    vendor_id: number;
    type: string;
    original_name: string;
    mime_type: string;
    size: number;
    status: 'pending' | 'verified' | 'rejected';
    rejection_reason: string | null;
    expires_on: string | null;
    reviewed_at: string | null;
    created_at: string;
    uploader?: { id: number; name: string; email: string } | null;
    reviewer?: { id: number; name: string; email: string } | null;
};

export type VendorReviewEvent = {
    id: number;
    action: string;
    from_status: string | null;
    to_status: string | null;
    notes: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
    actor?: { id: number; name: string; email: string } | null;
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
    vendor_id: number | null;
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

export type Coupon = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    type: 'percentage' | 'fixed';
    value: string;
    minimum_order_amount: string;
    maximum_discount_amount: string | null;
    usage_limit: number | null;
    used_count: number;
    starts_at: string | null;
    expires_at: string | null;
    status: boolean;
};
export type Review = {
    id: number;
    rating: number;
    title: string | null;
    body: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    product: { id: number; name: string; sku: string };
    user: { id: number; name: string; email: string };
    moderator?: { id: number; name: string } | null;
};
export type Payment = {
    id: number;
    transaction_id: string | null;
    provider: string;
    amount: string;
    status: 'pending' | 'paid' | 'failed' | 'partially_refunded' | 'refunded';
    refunded_amount: string;
    paid_at: string | null;
    order: Order;
};
export type Shipment = {
    id: number;
    carrier: string | null;
    tracking_number: string | null;
    status:
        | 'pending'
        | 'packed'
        | 'shipped'
        | 'in_transit'
        | 'delivered'
        | 'returned';
    estimated_delivery_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    notes: string | null;
    order: Order;
};

export type ReturnStatus =
    | 'requested'
    | 'approved'
    | 'pickup_scheduled'
    | 'in_transit'
    | 'received'
    | 'refunded'
    | 'rejected';

export type ReturnCase = {
    id: number;
    order_id: number;
    order_item_id: number | null;
    number: string;
    type: 'return' | 'rto';
    reason_code: string;
    reason_details: string | null;
    status: ReturnStatus;
    requested_quantity: number;
    refund_amount: string;
    resolution: string | null;
    reverse_carrier: string | null;
    tracking_number: string | null;
    requested_at: string;
    approved_at: string | null;
    received_at: string | null;
    completed_at: string | null;
    order: Order & {
        payment?: Omit<Payment, 'order'> | null;
        shipment?: Omit<Shipment, 'order'> | null;
    };
    order_item?: OrderItem | null;
    customer: { id: number; name: string; email: string };
    processor?: { id: number; name: string; email: string } | null;
};

export type WarehouseInventory = {
    id: number;
    product_id: number;
    on_hand: number;
    reserved: number;
    reorder_level: number;
    bin_location: string | null;
    product: { id: number; name: string; sku: string; stock: number };
    updated_by?: { id: number; name: string } | null;
};

export type Warehouse = {
    id: number;
    code: string;
    name: string;
    type: 'warehouse' | 'fulfilment_center' | 'dark_store';
    contact_name: string | null;
    contact_phone: string | null;
    address: { line_1: string; line_2?: string };
    city: string;
    state: string;
    postal_code: string;
    capacity: number;
    priority: number;
    status: boolean;
    inventories_count?: number;
    units_on_hand?: number | null;
    units_reserved?: number | null;
    inventories?: WarehouseInventory[];
};

export type Settlement = {
    id: number;
    number: string;
    period_start: string;
    period_end: string;
    gross_sales: string;
    commission_amount: string;
    shipping_fee: string;
    tax_withheld: string;
    refund_deductions: string;
    adjustments: string;
    net_amount: string;
    status: string;
    transaction_reference: string | null;
    notes: string | null;
    approved_at: string | null;
    paid_at: string | null;
    vendor: Vendor;
    approver?: { id: number; name: string } | null;
};

export type SupportMessage = {
    id: number;
    body: string;
    is_internal: boolean;
    created_at: string;
    user: { id: number; name: string; email: string };
};
export type SupportTicket = {
    id: number;
    number: string;
    subject: string;
    category: string;
    channel: string;
    priority: string;
    status: string;
    description: string;
    first_response_due_at: string | null;
    resolution_due_at: string | null;
    first_responded_at: string | null;
    resolved_at: string | null;
    closed_at: string | null;
    created_at: string;
    messages_count?: number;
    customer: { id: number; name: string; email: string };
    order?: { id: number; number: string } | null;
    assignee?: { id: number; name: string; email: string } | null;
    messages?: SupportMessage[];
};

export type TaxInvoiceItem = {
    id: number;
    description: string;
    hsn_code: string | null;
    quantity: number;
    unit: string;
    taxable_value: string;
    gst_rate: string;
    cgst_amount: string;
    sgst_amount: string;
    igst_amount: string;
    cess_amount: string;
    total_amount: string;
};

export type TaxInvoice = {
    id: number;
    order_id: number;
    vendor_id: number | null;
    parent_invoice_id: number | null;
    type: 'invoice' | 'credit_note';
    number: string;
    financial_year: string;
    issued_on: string;
    status: 'draft' | 'issued' | 'cancelled';
    supplier_name: string;
    supplier_address: string;
    supplier_gstin: string | null;
    supplier_state_code: string;
    recipient_name: string;
    recipient_address: string;
    recipient_gstin: string | null;
    place_of_supply_state: string;
    place_of_supply_code: string;
    reverse_charge: boolean;
    taxable_value: string;
    cgst_amount: string;
    sgst_amount: string;
    igst_amount: string;
    cess_amount: string;
    total_amount: string;
    notes: string | null;
    issued_at: string | null;
    cancelled_at: string | null;
    order: {
        id: number;
        number: string;
        user?: { name: string; email: string };
    };
    vendor?: Vendor | null;
    parent_invoice?: Pick<TaxInvoice, 'id' | 'number' | 'total_amount'> | null;
    issuer?: { id: number; name: string } | null;
    items?: TaxInvoiceItem[];
};
