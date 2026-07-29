export type OrderItem = {
    id: number;
    product_id: number | null;
    product_name: string;
    sku: string;
    variant_name: string | null;
    unit_price: string;
    quantity: number;
    total: string;
    fulfilment_status: string;
    vendor: {
        id: number;
        business_name: string;
        business_email: string;
    } | null;
};

export type CustomerOrder = {
    id: number;
    number: string;
    status: string;
    payment_method: string;
    payment_status: string;
    shipping_address: {
        recipient_name?: string;
        phone?: string;
        line_1?: string;
        line_2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
    };
    subtotal: string;
    shipping_total: string;
    discount_total: string;
    tax_total: string;
    gift_wrap_total: string;
    total: string;
    customer_note: string | null;
    placed_at: string;
    confirmed_at: string | null;
    cancelled_at: string | null;
    items: OrderItem[];
    shipment: {
        id: number;
        carrier: string | null;
        tracking_number: string | null;
        status: string;
        estimated_delivery_at: string | null;
        notes: string | null;
        events?: Array<{
            id: number;
            status: string;
            location: string | null;
            message: string | null;
            occurred_at: string;
        }>;
    } | null;
    payment: {
        id: number;
        transaction_id: string | null;
        provider: string;
        status: string;
        paid_at: string | null;
    } | null;
};
