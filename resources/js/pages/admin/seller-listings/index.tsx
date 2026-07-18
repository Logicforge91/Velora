import { router, useForm } from '@inertiajs/react';
import {
    BadgeIndianRupee,
    Crown,
    PackageCheck,
    Search,
    Store,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/seller-listings';
import type { Counts, Paginated, SellerListing } from '@/types/admin';

const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});
const control =
    'h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]';

export default function SellerListingsIndex({
    listings,
    counts,
}: {
    listings: Paginated<SellerListing>;
    counts: Counts;
}) {
    const params = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const filter = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            routes.index.url(),
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout
            title="Seller Listings"
            breadcrumb="Catalogue / Seller Listings"
        >
            <div>
                <h2 className="text-xl font-black">
                    Marketplace listing control
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Review seller offers, pricing, stock, commission and buy-box
                    placement.
                </p>
            </div>
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'All listings',
                            value: counts.total,
                            icon: Store,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Active',
                            value: counts.active,
                            icon: PackageCheck,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
                        },
                        {
                            label: 'Pending review',
                            value: counts.pending,
                            icon: BadgeIndianRupee,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'Suspended',
                            value: counts.suspended,
                            icon: Crown,
                            tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
                        },
                    ]}
                />
            </div>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <form
                    onSubmit={filter}
                    className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row dark:border-white/10"
                >
                    <label className="relative flex-1">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Seller, product or seller SKU"
                            className={`${control} pl-9`}
                        />
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={control + ' sm:w-48'}
                    >
                        <option value="">All statuses</option>
                        {[
                            'draft',
                            'pending',
                            'active',
                            'suspended',
                            'rejected',
                        ].map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                    <button className="h-10 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </form>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {listings.data.map((listing) => (
                        <ListingRow key={listing.id} listing={listing} />
                    ))}
                    {listings.data.length === 0 && (
                        <p className="p-14 text-center text-sm text-slate-500">
                            No seller listings found.
                        </p>
                    )}
                </div>
                <Pagination links={listings.links} />
            </section>
        </AdminLayout>
    );
}

function ListingRow({ listing }: { listing: SellerListing }) {
    const form = useForm({
        status: listing.status,
        selling_price: listing.selling_price,
        mrp: listing.mrp,
        stock: listing.stock,
        commission_rate: listing.commission_rate,
        is_buy_box_winner: listing.is_buy_box_winner,
        rejection_reason: listing.rejection_reason ?? '',
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            is_buy_box_winner: data.is_buy_box_winner ? 1 : 0,
        }));
        form.patch(routes.update.url(listing.id), { preserveScroll: true });
    };

    return (
        <form
            onSubmit={submit}
            className="grid gap-4 p-5 xl:grid-cols-[minmax(15rem,1fr)_9rem_9rem_8rem_9rem_10rem_auto] xl:items-end"
        >
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black">{listing.product.name}</p>
                    {listing.is_buy_box_winner && (
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                            Buy box
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-500">
                    {listing.vendor.business_name} · {listing.seller_sku}
                    {listing.variant ? ` · ${listing.variant.name}` : ''}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                    Available {listing.stock - listing.reserved} · MRP{' '}
                    {money.format(Number(listing.mrp))}
                </p>
            </div>
            <Field label="Status">
                <select
                    value={form.data.status}
                    onChange={(e) =>
                        form.setData(
                            'status',
                            e.target.value as SellerListing['status'],
                        )
                    }
                    className={control}
                >
                    {[
                        'draft',
                        'pending',
                        'active',
                        'suspended',
                        'rejected',
                    ].map((value) => (
                        <option key={value}>{value}</option>
                    ))}
                </select>
            </Field>
            <Field label="Selling price">
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.data.selling_price}
                    onChange={(e) =>
                        form.setData('selling_price', e.target.value)
                    }
                    className={control}
                />
            </Field>
            <Field label="Stock">
                <input
                    type="number"
                    min="0"
                    value={form.data.stock}
                    onChange={(e) =>
                        form.setData('stock', Number(e.target.value))
                    }
                    className={control}
                />
            </Field>
            <Field label="Commission %">
                <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={form.data.commission_rate}
                    onChange={(e) =>
                        form.setData('commission_rate', e.target.value)
                    }
                    className={control}
                />
            </Field>
            <label className="flex h-10 items-center gap-2 rounded-xl bg-slate-50 px-3 text-xs font-bold dark:bg-white/5">
                <input
                    type="checkbox"
                    checked={form.data.is_buy_box_winner}
                    onChange={(e) =>
                        form.setData('is_buy_box_winner', e.target.checked)
                    }
                />{' '}
                Buy-box winner
            </label>
            <button
                disabled={form.processing}
                className="h-10 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white disabled:opacity-50"
            >
                Save
            </button>
            {form.data.status === 'rejected' && (
                <div className="xl:col-span-full">
                    <Field label="Rejection reason">
                        <textarea
                            value={form.data.rejection_reason}
                            onChange={(e) =>
                                form.setData('rejection_reason', e.target.value)
                            }
                            className="mt-1 min-h-20 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-white/10 dark:bg-[#101722]"
                        />
                    </Field>
                </div>
            )}
            {Object.values(form.errors)[0] && (
                <p className="text-xs text-rose-600 xl:col-span-full">
                    {Object.values(form.errors)[0]}
                </p>
            )}
        </form>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="text-[10px] font-bold text-slate-500 uppercase">
            {label}
            <span className="mt-1 block">{children}</span>
        </label>
    );
}
