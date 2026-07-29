import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    Check,
    Crosshair,
    Home,
    MapPin,
    Navigation,
    Pencil,
    Plus,
    Save,
    ShieldCheck,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import StorefrontLayout from '@/layouts/storefront-layout';
import { dashboard } from '@/routes';
import {
    defaultMethod,
    destroy,
    store,
    update,
} from '@/routes/customer/addresses';

type AddressType = 'home' | 'work' | 'other';

type CustomerAddress = {
    id: number;
    type: AddressType;
    label: string | null;
    recipient_name: string;
    phone: string;
    alternate_phone: string | null;
    line_1: string;
    line_2: string | null;
    landmark: string | null;
    city: string;
    district: string | null;
    state: string;
    postal_code: string;
    latitude: string | null;
    longitude: string | null;
    delivery_instructions: string | null;
    is_default_shipping: boolean;
    is_serviceable: boolean;
};

type Coordinates = {
    latitude: string;
    longitude: string;
};

const addressSuggestions = [
    'Koramangala, Bengaluru',
    'Indiranagar, Bengaluru',
    'Andheri West, Mumbai',
    'Bandra East, Mumbai',
    'Connaught Place, New Delhi',
    'Salt Lake, Kolkata',
    'Hitech City, Hyderabad',
    'T. Nagar, Chennai',
];

export default function AddressIndex({
    addresses,
    serviceablePostalCodes,
}: {
    addresses: CustomerAddress[];
    serviceablePostalCodes: string[];
}) {
    const [editingAddress, setEditingAddress] =
        useState<CustomerAddress | null>(null);
    const [formOpen, setFormOpen] = useState(addresses.length === 0);

    const openCreateForm = () => {
        setEditingAddress(null);
        setFormOpen(true);
    };

    const openEditForm = (address: CustomerAddress) => {
        setEditingAddress(address);
        setFormOpen(true);
        window.setTimeout(
            () =>
                document
                    .querySelector('#address-form')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
            0,
        );
    };

    return (
        <StorefrontLayout>
            <Head title="Saved addresses" />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <Link
                    href={dashboard()}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600"
                >
                    <ArrowLeft className="size-4" /> Back to my account
                </Link>

                <section className="relative mt-6 overflow-hidden rounded-[2.25rem] bg-slate-950 px-6 py-8 text-white sm:px-9">
                    <div className="absolute -top-28 right-0 size-80 rounded-full bg-orange-500/30 blur-3xl" />
                    <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                        <div>
                            <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.16em] text-orange-300 uppercase">
                                <MapPin className="size-4" /> Address book
                            </span>
                            <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                                Delivery, made personal.
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                                Save home, work, and other locations for a
                                faster checkout.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-black"
                        >
                            <Plus className="size-4" /> Add address
                        </button>
                    </div>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <section>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-black tracking-wider text-orange-600 uppercase">
                                    Saved locations
                                </p>
                                <h2 className="mt-1 text-2xl font-black">
                                    {addresses.length} addresses
                                </h2>
                            </div>
                        </div>

                        {addresses.length > 0 ? (
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                {addresses.map((address) => (
                                    <AddressCard
                                        key={address.id}
                                        address={address}
                                        onEdit={() => openEditForm(address)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-4 rounded-[1.75rem] border border-dashed border-slate-300 p-10 text-center dark:border-white/10">
                                <MapPin className="mx-auto size-9 text-slate-300" />
                                <h3 className="mt-4 text-lg font-black">
                                    No saved addresses yet
                                </h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Add a delivery location to get started.
                                </p>
                            </div>
                        )}
                    </section>

                    <aside id="address-form" className="scroll-mt-28">
                        {formOpen ? (
                            <AddressForm
                                key={editingAddress?.id ?? 'new'}
                                address={editingAddress}
                                serviceablePostalCodes={serviceablePostalCodes}
                                onClose={() => {
                                    setEditingAddress(null);
                                    setFormOpen(false);
                                }}
                            />
                        ) : (
                            <button
                                type="button"
                                onClick={openCreateForm}
                                className="flex w-full flex-col items-center rounded-[1.75rem] border border-dashed border-slate-300 p-10 text-center hover:border-orange-400 dark:border-white/10"
                            >
                                <Plus className="size-8 text-orange-500" />
                                <span className="mt-3 font-black">
                                    Add another address
                                </span>
                            </button>
                        )}
                    </aside>
                </div>
            </main>
        </StorefrontLayout>
    );
}

function AddressCard({
    address,
    onEdit,
}: {
    address: CustomerAddress;
    onEdit: () => void;
}) {
    const Icon =
        address.type === 'home'
            ? Home
            : address.type === 'work'
              ? BriefcaseBusiness
              : MapPin;

    return (
        <article
            className={`rounded-[1.5rem] border bg-white p-5 shadow-sm dark:bg-white/[0.035] ${address.is_default_shipping ? 'border-orange-300 ring-2 ring-orange-100 dark:ring-orange-500/10' : 'border-slate-200 dark:border-white/10'}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                        <Icon className="size-5" />
                    </span>
                    <div>
                        <p className="font-black capitalize">
                            {address.label || address.type}
                        </p>
                        <p
                            className={`mt-0.5 text-[10px] font-black uppercase ${address.is_serviceable ? 'text-emerald-600' : 'text-rose-500'}`}
                        >
                            {address.is_serviceable
                                ? 'Delivery available'
                                : 'Currently unserviceable'}
                        </p>
                    </div>
                </div>
                {address.is_default_shipping && (
                    <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[9px] font-black text-white uppercase">
                        Default
                    </span>
                )}
            </div>

            <p className="mt-4 text-sm font-black">{address.recipient_name}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {address.line_1}
                {address.line_2 ? `, ${address.line_2}` : ''}
                {address.landmark ? `, near ${address.landmark}` : ''}
                <br />
                {address.city}, {address.state} {address.postal_code}
            </p>
            <p className="mt-2 text-xs font-bold text-slate-500">
                +91 {address.phone}
            </p>
            {address.delivery_instructions && (
                <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-white/5">
                    {address.delivery_instructions}
                </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-black dark:border-white/10"
                >
                    <Pencil className="size-3.5" /> Edit
                </button>
                {!address.is_default_shipping && (
                    <Link
                        href={defaultMethod(address.id)}
                        method="patch"
                        as="button"
                        preserveScroll
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-black dark:border-white/10"
                    >
                        <ShieldCheck className="size-3.5" /> Set default
                    </Link>
                )}
                <Link
                    href={destroy(address.id)}
                    method="delete"
                    as="button"
                    preserveScroll
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-black text-rose-500 hover:bg-rose-50"
                >
                    <Trash2 className="size-3.5" /> Delete
                </Link>
            </div>
        </article>
    );
}

function AddressForm({
    address,
    serviceablePostalCodes,
    onClose,
}: {
    address: CustomerAddress | null;
    serviceablePostalCodes: string[];
    onClose: () => void;
}) {
    const [addressType, setAddressType] = useState<AddressType>(
        address?.type ?? 'home',
    );
    const [postalCode, setPostalCode] = useState(address?.postal_code ?? '');
    const [coordinates, setCoordinates] = useState<Coordinates>({
        latitude: address?.latitude ?? '',
        longitude: address?.longitude ?? '',
    });
    const [locationMessage, setLocationMessage] = useState('');
    const postalCodeValid = /^\d{6}$/.test(postalCode);
    const isServiceable =
        postalCodeValid && serviceablePostalCodes.includes(postalCode);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setLocationMessage('Location detection is unavailable.');

            return;
        }

        setLocationMessage('Detecting your location…');
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setCoordinates({
                    latitude: coords.latitude.toFixed(7),
                    longitude: coords.longitude.toFixed(7),
                });
                setLocationMessage('Current location pinned.');
            },
            () => setLocationMessage('Location permission was not granted.'),
        );
    };

    const selectMapLocation = (event: MouseEvent<HTMLButtonElement>) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;

        setCoordinates({
            latitude: (37 - y * 29).toFixed(7),
            longitude: (68 + x * 29).toFixed(7),
        });
        setLocationMessage('Map location selected.');
    };

    return (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/[0.035]">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-black tracking-wider text-orange-600 uppercase">
                        {address ? 'Edit location' : 'New location'}
                    </p>
                    <h2 className="mt-1 text-xl font-black">
                        {address ? 'Update address' : 'Add an address'}
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="grid size-9 place-items-center rounded-full bg-slate-100 dark:bg-white/5"
                    aria-label="Close address form"
                >
                    <X className="size-4" />
                </button>
            </div>

            <Form
                {...(address ? update.form(address.id) : store.form())}
                options={{ preserveScroll: true }}
                onSuccess={onClose}
                className="mt-6 grid gap-4"
            >
                {({ errors, processing }) => (
                    <>
                        <div>
                            <Label className="font-bold">Address type</Label>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                                {(['home', 'work', 'other'] as const).map(
                                    (type) => (
                                        <label
                                            key={type}
                                            className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-xs font-black capitalize ${addressType === type ? 'border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-500/10' : 'border-slate-200 dark:border-white/10'}`}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value={type}
                                                checked={addressType === type}
                                                onChange={() =>
                                                    setAddressType(type)
                                                }
                                                className="sr-only"
                                            />
                                            {type}
                                        </label>
                                    ),
                                )}
                            </div>
                            <InputError message={errors.type} />
                        </div>

                        {addressType === 'other' && (
                            <Field
                                label="Address label"
                                name="label"
                                defaultValue={address?.label}
                                placeholder="Parents, warehouse, studio…"
                                error={errors.label}
                            />
                        )}
                        <Field
                            label="Recipient name"
                            name="recipient_name"
                            defaultValue={address?.recipient_name}
                            autoComplete="name"
                            required
                            error={errors.recipient_name}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Mobile number"
                                name="phone"
                                defaultValue={address?.phone}
                                inputMode="numeric"
                                autoComplete="tel"
                                required
                                error={errors.phone}
                            />
                            <Field
                                label="Alternate phone"
                                name="alternate_phone"
                                defaultValue={address?.alternate_phone}
                                inputMode="numeric"
                                error={errors.alternate_phone}
                            />
                        </div>
                        <Field
                            label="Flat, house, building"
                            name="line_1"
                            defaultValue={address?.line_1}
                            autoComplete="address-line1"
                            required
                            error={errors.line_1}
                        />
                        <Field
                            label="Area, street, locality"
                            name="line_2"
                            defaultValue={address?.line_2}
                            autoComplete="address-line2"
                            list="address-suggestions"
                            placeholder="Start typing an area…"
                            error={errors.line_2}
                        />
                        <datalist id="address-suggestions">
                            {addressSuggestions.map((suggestion) => (
                                <option key={suggestion} value={suggestion} />
                            ))}
                        </datalist>
                        <Field
                            label="Landmark"
                            name="landmark"
                            defaultValue={address?.landmark}
                            placeholder="Near a well-known place"
                            error={errors.landmark}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="City"
                                name="city"
                                defaultValue={address?.city}
                                autoComplete="address-level2"
                                required
                                error={errors.city}
                            />
                            <Field
                                label="State"
                                name="state"
                                defaultValue={address?.state}
                                autoComplete="address-level1"
                                required
                                error={errors.state}
                            />
                        </div>
                        <div>
                            <Field
                                label="Pincode"
                                name="postal_code"
                                value={postalCode}
                                onChange={(value) =>
                                    setPostalCode(
                                        value.replace(/\D/g, '').slice(0, 6),
                                    )
                                }
                                inputMode="numeric"
                                autoComplete="postal-code"
                                required
                                error={errors.postal_code}
                            />
                            {postalCode.length > 0 && (
                                <p
                                    className={`mt-2 inline-flex items-center gap-1.5 text-xs font-black ${isServiceable ? 'text-emerald-600' : 'text-rose-500'}`}
                                >
                                    {isServiceable ? (
                                        <Check className="size-3.5" />
                                    ) : (
                                        <X className="size-3.5" />
                                    )}
                                    {!postalCodeValid
                                        ? 'Enter a valid 6-digit pincode'
                                        : isServiceable
                                          ? 'Delivery is available here'
                                          : 'This pincode is not currently serviceable'}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between gap-3">
                                <Label className="font-bold">Pin on map</Label>
                                <button
                                    type="button"
                                    onClick={detectLocation}
                                    className="inline-flex items-center gap-1.5 text-xs font-black text-orange-600"
                                >
                                    <Crosshair className="size-3.5" /> Use
                                    current location
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={selectMapLocation}
                                className="relative mt-2 h-36 w-full overflow-hidden rounded-xl bg-[linear-gradient(135deg,#dcfce7_25%,#e0f2fe_25%,#e0f2fe_50%,#fef3c7_50%,#fef3c7_75%,#dcfce7_75%)] bg-size-[48px_48px] ring-1 ring-slate-200 dark:opacity-80"
                                aria-label="Choose location on map"
                            >
                                <span className="absolute inset-x-5 top-1/2 h-1 -rotate-12 bg-white/80" />
                                <span className="absolute top-4 bottom-4 left-1/2 w-1 rotate-6 bg-white/80" />
                                {coordinates.latitude && (
                                    <MapPin className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-full fill-orange-500 text-white drop-shadow" />
                                )}
                            </button>
                            <input
                                type="hidden"
                                name="latitude"
                                value={coordinates.latitude}
                            />
                            <input
                                type="hidden"
                                name="longitude"
                                value={coordinates.longitude}
                            />
                            {locationMessage && (
                                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <Navigation className="size-3.5" />
                                    {locationMessage}
                                </p>
                            )}
                        </div>

                        <label className="grid gap-2">
                            <span className="text-sm font-bold">
                                Delivery instructions
                            </span>
                            <textarea
                                name="delivery_instructions"
                                defaultValue={
                                    address?.delivery_instructions ?? ''
                                }
                                rows={3}
                                placeholder="Gate code, preferred drop-off point, or timing…"
                                className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
                            />
                            <InputError
                                message={errors.delivery_instructions}
                            />
                        </label>
                        <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm font-bold dark:bg-white/5">
                            <input
                                type="checkbox"
                                name="is_default_shipping"
                                value="1"
                                defaultChecked={
                                    address?.is_default_shipping ??
                                    addressesAreEmpty(address)
                                }
                                className="size-4 accent-orange-500"
                            />
                            Set as default delivery address
                        </label>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-12 rounded-xl bg-slate-950 font-black text-white hover:bg-orange-600 dark:bg-orange-500"
                        >
                            {processing ? (
                                <Spinner />
                            ) : (
                                <Save className="size-4" />
                            )}
                            {address ? 'Save changes' : 'Add address'}
                        </Button>
                    </>
                )}
            </Form>
        </div>
    );
}

function addressesAreEmpty(address: CustomerAddress | null): boolean {
    return address === null;
}

function Field({
    label,
    name,
    defaultValue,
    value,
    onChange,
    error,
    ...props
}: {
    label: string;
    name: string;
    defaultValue?: string | null;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    placeholder?: string;
    autoComplete?: string;
    inputMode?: 'numeric';
    list?: string;
    required?: boolean;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name} className="font-bold">
                {label}
            </Label>
            <Input
                id={name}
                name={name}
                defaultValue={
                    value === undefined ? (defaultValue ?? '') : undefined
                }
                value={value}
                onChange={
                    onChange
                        ? (event) => onChange(event.target.value)
                        : undefined
                }
                className="h-11 rounded-xl border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-white/5"
                {...props}
            />
            <InputError message={error} />
        </div>
    );
}
