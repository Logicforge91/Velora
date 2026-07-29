import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    CalendarDays,
    Check,
    ChevronRight,
    Clock3,
    IndianRupee,
    MapPin,
    PackageCheck,
    ShieldCheck,
    Store,
    Truck,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { money, products } from '@/components/storefront/catalog';
import ProductImage from '@/components/storefront/product-image';
import StorefrontLayout from '@/layouts/storefront-layout';
import { checkout } from '@/routes/storefront';

type DeliveryMethod =
    'standard' | 'express' | 'same-day' | 'scheduled' | 'pickup';

type DeliveryOption = {
    id: DeliveryMethod;
    label: string;
    detail: string;
    charge: number;
    icon: LucideIcon;
};

const deliveryOptions: DeliveryOption[] = [
    {
        id: 'standard',
        label: 'Standard delivery',
        detail: '3–5 business days',
        charge: 0,
        icon: Truck,
    },
    {
        id: 'express',
        label: 'Express delivery',
        detail: '1–2 business days',
        charge: 149,
        icon: Zap,
    },
    {
        id: 'same-day',
        label: 'Same-day delivery',
        detail: 'Order before 12 PM',
        charge: 249,
        icon: Clock3,
    },
    {
        id: 'scheduled',
        label: 'Scheduled delivery',
        detail: 'Choose a date and slot',
        charge: 79,
        icon: CalendarDays,
    },
    {
        id: 'pickup',
        label: 'Store pickup',
        detail: 'Collect from a nearby store',
        charge: 0,
        icon: Store,
    },
];

const shipmentGroups = [
    {
        seller: 'The Tech Edit',
        items: products.slice(0, 2),
        eta: 'Tomorrow, 9 AM–1 PM',
        status: 'In transit',
    },
    {
        seller: 'Move Studio',
        items: products.slice(2, 4),
        eta: 'Saturday, 2 PM–6 PM',
        status: 'Packed',
    },
];

const trackingSteps = [
    ['Order confirmed', 'Today, 9:12 AM'],
    ['Packed by seller', 'Today, 11:40 AM'],
    ['Handed to courier', 'Today, 3:20 PM'],
    ['Out for delivery', 'Expected tomorrow'],
    ['Delivered', 'Pending'],
];

export default function ShippingDelivery() {
    const [method, setMethod] = useState<DeliveryMethod>('standard');
    const [deliveryDate, setDeliveryDate] = useState('2026-08-01');
    const [deliverySlot, setDeliverySlot] = useState('9 AM–1 PM');
    const [instructions, setInstructions] = useState('');
    const [contactless, setContactless] = useState(true);
    const [orderValue, setOrderValue] = useState(1749);
    const selectedOption =
        deliveryOptions.find((option) => option.id === method) ??
        deliveryOptions[0];
    const freeShippingThreshold = 2000;
    const qualifiesForFreeShipping = orderValue >= freeShippingThreshold;
    const shippingCharge =
        qualifiesForFreeShipping && method === 'standard'
            ? 0
            : selectedOption.charge;
    const amountUntilFreeShipping = Math.max(
        0,
        freeShippingThreshold - orderValue,
    );
    const progress = Math.min(100, (orderValue / freeShippingThreshold) * 100);
    const deliverySummary = useMemo(() => {
        if (method === 'pickup') {
            return 'Pickup from Velora Indiranagar, Bengaluru';
        }

        if (method === 'same-day') {
            return `Today · ${deliverySlot}`;
        }

        return `${new Date(`${deliveryDate}T12:00:00`).toLocaleDateString(
            'en-IN',
            {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
            },
        )} · ${deliverySlot}`;
    }, [deliveryDate, deliverySlot, method]);

    return (
        <StorefrontLayout>
            <Head title="Shipping and delivery" />
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.18em] text-orange-500 uppercase">
                            <Truck className="size-4" /> Fulfilment centre
                        </span>
                        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                            Delivery on your terms.
                        </h1>
                        <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
                            Choose how and when your order arrives, then follow
                            every shipment to your door.
                        </p>
                    </div>
                    <Link
                        href={checkout.url()}
                        className="inline-flex items-center gap-2 text-sm font-black text-orange-600"
                    >
                        Continue to checkout <ChevronRight className="size-4" />
                    </Link>
                </div>

                <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="grid content-start gap-6">
                        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-white/5">
                            <div className="flex items-center gap-3">
                                <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                    <Truck className="size-5" />
                                </span>
                                <div>
                                    <h2 className="text-xl font-black">
                                        Delivery method
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Availability may vary by pincode and
                                        seller.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {deliveryOptions.map((option) => (
                                    <DeliveryMethodCard
                                        key={option.id}
                                        option={option}
                                        selected={method === option.id}
                                        onSelect={() => setMethod(option.id)}
                                    />
                                ))}
                            </div>

                            {method !== 'pickup' ? (
                                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 dark:border-white/10">
                                    <label className="grid gap-2 text-xs font-black">
                                        <span className="inline-flex items-center gap-2">
                                            <CalendarDays className="size-4 text-orange-500" />
                                            Delivery date
                                        </span>
                                        <input
                                            type="date"
                                            value={deliveryDate}
                                            min="2026-07-29"
                                            onChange={(event) =>
                                                setDeliveryDate(
                                                    event.target.value,
                                                )
                                            }
                                            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                                        />
                                    </label>
                                    <label className="grid gap-2 text-xs font-black">
                                        <span className="inline-flex items-center gap-2">
                                            <Clock3 className="size-4 text-orange-500" />
                                            Delivery slot
                                        </span>
                                        <select
                                            value={deliverySlot}
                                            onChange={(event) =>
                                                setDeliverySlot(
                                                    event.target.value,
                                                )
                                            }
                                            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                                        >
                                            <option>9 AM–1 PM</option>
                                            <option>1 PM–5 PM</option>
                                            <option>5 PM–9 PM</option>
                                        </select>
                                    </label>
                                </div>
                            ) : (
                                <div className="mt-5 rounded-2xl bg-orange-50 p-5 dark:bg-orange-500/10">
                                    <p className="inline-flex items-center gap-2 font-black">
                                        <MapPin className="size-4 text-orange-600" />
                                        Velora Indiranagar
                                    </p>
                                    <p className="mt-2 text-sm text-slate-500">
                                        100 Feet Road, Bengaluru · Ready within
                                        2 hours
                                    </p>
                                </div>
                            )}
                        </section>

                        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-white/5">
                            <h2 className="text-xl font-black">
                                Seller-wise shipments
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Items ship separately when they come from
                                different sellers.
                            </p>
                            <div className="mt-5 grid gap-4">
                                {shipmentGroups.map((shipment, index) => (
                                    <article
                                        key={shipment.seller}
                                        className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                                    Shipment {index + 1} of{' '}
                                                    {shipmentGroups.length}
                                                </p>
                                                <h3 className="mt-1 inline-flex items-center gap-2 font-black">
                                                    <Building2 className="size-4 text-orange-500" />
                                                    {shipment.seller}
                                                </h3>
                                            </div>
                                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-500/10">
                                                {shipment.status}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between gap-4">
                                            <div className="flex -space-x-3">
                                                {shipment.items.map(
                                                    (product) => (
                                                        <ProductImage
                                                            key={product.id}
                                                            product={product}
                                                            className="size-12 rounded-xl ring-2 ring-white dark:ring-slate-900"
                                                        />
                                                    ),
                                                )}
                                            </div>
                                            <p className="text-right text-xs font-bold text-slate-500">
                                                Estimated arrival
                                                <span className="mt-1 block font-black text-slate-950 dark:text-white">
                                                    {shipment.eta}
                                                </span>
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-white/5">
                            <h2 className="text-xl font-black">
                                Delivery preferences
                            </h2>
                            <label className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-white/5">
                                <input
                                    type="checkbox"
                                    checked={contactless}
                                    onChange={(event) =>
                                        setContactless(event.target.checked)
                                    }
                                    className="mt-0.5 size-4 accent-orange-500"
                                />
                                <span className="text-sm font-black">
                                    Contactless delivery
                                    <span className="mt-1 block text-xs font-medium text-slate-500">
                                        Leave the package at the door and notify
                                        me.
                                    </span>
                                </span>
                            </label>
                            <label className="mt-4 grid gap-2 text-xs font-black">
                                Delivery instructions
                                <textarea
                                    value={instructions}
                                    onChange={(event) =>
                                        setInstructions(event.target.value)
                                    }
                                    maxLength={500}
                                    rows={3}
                                    placeholder="Gate code, landmark, preferred drop-off point…"
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
                                />
                                <span className="text-right font-medium text-slate-400">
                                    {instructions.length}/500
                                </span>
                            </label>
                        </section>

                        <ShipmentTracker />
                    </div>

                    <aside className="h-fit rounded-[2rem] bg-slate-950 p-6 text-white lg:sticky lg:top-32">
                        <div className="flex items-center gap-2">
                            <IndianRupee className="size-5 text-orange-400" />
                            <h2 className="text-xl font-black">
                                Shipping summary
                            </h2>
                        </div>
                        <label className="mt-6 grid gap-2 text-xs font-black text-slate-300">
                            Order value simulator
                            <input
                                type="range"
                                min="499"
                                max="5000"
                                step="50"
                                value={orderValue}
                                onChange={(event) =>
                                    setOrderValue(Number(event.target.value))
                                }
                                className="accent-orange-500"
                            />
                        </label>
                        <div className="mt-3 flex justify-between text-xs">
                            <span className="text-slate-400">Basket value</span>
                            <span className="font-black">
                                {money.format(orderValue)}
                            </span>
                        </div>

                        <div className="mt-5">
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-emerald-400 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-400">
                                {qualifiesForFreeShipping
                                    ? 'Free standard shipping unlocked'
                                    : `Add ${money.format(amountUntilFreeShipping)} for free standard shipping`}
                            </p>
                        </div>

                        <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">
                                    {selectedOption.label}
                                </span>
                                <span
                                    className={
                                        shippingCharge === 0
                                            ? 'font-black text-emerald-400'
                                            : 'font-black'
                                    }
                                >
                                    {shippingCharge === 0
                                        ? 'Free'
                                        : money.format(shippingCharge)}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">
                                    Shipment groups
                                </span>
                                <span className="font-black">2 sellers</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">
                                    Contactless
                                </span>
                                <span className="font-black">
                                    {contactless ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl bg-white/5 p-4">
                            <p className="text-xs font-black tracking-wider text-orange-300 uppercase">
                                Selected arrival
                            </p>
                            <p className="mt-2 text-sm font-black">
                                {deliverySummary}
                            </p>
                        </div>
                        <Link
                            href={checkout.url()}
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-4 text-sm font-black hover:bg-orange-400"
                        >
                            Use these options{' '}
                            <ChevronRight className="size-4" />
                        </Link>
                        <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-400">
                            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                            Final eligibility and charges are confirmed against
                            your delivery pincode.
                        </p>
                    </aside>
                </div>
            </main>
        </StorefrontLayout>
    );
}

function DeliveryMethodCard({
    option,
    selected,
    onSelect,
}: {
    option: DeliveryOption;
    selected: boolean;
    onSelect: () => void;
}) {
    const Icon = option.icon;

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 hover:border-orange-300 dark:border-white/10'}`}
        >
            <div className="flex items-start justify-between gap-3">
                <Icon className="size-5 text-orange-500" />
                {selected && <Check className="size-4 text-emerald-600" />}
            </div>
            <p className="mt-4 text-sm font-black">{option.label}</p>
            <p className="mt-1 text-xs text-slate-500">{option.detail}</p>
            <p className="mt-3 text-xs font-black">
                {option.charge === 0 ? 'Free' : money.format(option.charge)}
            </p>
        </button>
    );
}

function ShipmentTracker() {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                    <PackageCheck className="size-5" />
                </span>
                <div>
                    <h2 className="text-xl font-black">
                        Shipment status tracking
                    </h2>
                    <p className="text-xs text-slate-500">
                        Tracking ID VLX92841037
                    </p>
                </div>
            </div>
            <ol className="mt-6 grid gap-0">
                {trackingSteps.map(([label, time], index) => {
                    const complete = index < 3;
                    const active = index === 2;

                    return (
                        <li
                            key={label}
                            className="relative grid grid-cols-[28px_1fr] gap-3 pb-6 last:pb-0"
                        >
                            {index < trackingSteps.length - 1 && (
                                <span
                                    className={`absolute top-6 bottom-0 left-[13px] w-0.5 ${complete ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-white/10'}`}
                                />
                            )}
                            <span
                                className={`relative z-10 grid size-7 place-items-center rounded-full ${complete ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-white/10'} ${active ? 'ring-4 ring-emerald-100 dark:ring-emerald-500/10' : ''}`}
                            >
                                {complete ? (
                                    <Check className="size-3.5" />
                                ) : (
                                    <span className="size-2 rounded-full bg-current" />
                                )}
                            </span>
                            <div>
                                <p
                                    className={`text-sm font-black ${!complete ? 'text-slate-400' : ''}`}
                                >
                                    {label}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    {time}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
