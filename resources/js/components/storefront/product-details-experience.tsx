import { Link } from '@inertiajs/react';
import {
    BadgeCheck,
    Bell,
    Box,
    Check,
    ChevronDown,
    CircleAlert,
    Copy,
    CreditCard,
    Heart,
    Maximize2,
    Minus,
    PackageCheck,
    Play,
    Plus,
    Rotate3D,
    Share2,
    ShieldCheck,
    ShoppingBag,
    Star,
    Truck,
    Video,
    ZoomIn,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { money } from '@/components/storefront/catalog';
import type { StorefrontProduct } from '@/components/storefront/catalog';
import ProductImage from '@/components/storefront/product-image';
import {
    createProductVariants,
    variantLabels,
    variantMatches,
    variantOptions,
} from '@/components/storefront/product-variants';
import type {
    VariantDimension,
    VariantSelections,
} from '@/components/storefront/product-variants';
import { cart, checkout, comparison, wishlist } from '@/routes/storefront';

type GalleryMode = 'image' | 'video' | '360';

export default function ProductDetailsExperience({
    product,
}: {
    product: StorefrontProduct;
}) {
    const [galleryMode, setGalleryMode] = useState<GalleryMode>('image');
    const [activeImage, setActiveImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [rotation, setRotation] = useState(0);
    const variants = useMemo(() => createProductVariants(product), [product]);
    const firstAvailableVariant =
        variants.find((variant) => variant.stock > 0) ?? variants[0];
    const [variantSelections, setVariantSelections] =
        useState<VariantSelections>({
            size: firstAvailableVariant.size,
            color: firstAvailableVariant.color,
            storage: firstAvailableVariant.storage,
            weight: firstAvailableVariant.weight,
            packSize: firstAvailableVariant.packSize,
        });
    const selectedVariant =
        variants.find((variant) =>
            variantMatches(variant, variantSelections),
        ) ?? firstAvailableVariant;
    const [quantity, setQuantity] = useState(1);
    const [pincode, setPincode] = useState('');
    const [deliveryMessage, setDeliveryMessage] = useState('');
    const [alertEnabled, setAlertEnabled] = useState(false);
    const [copied, setCopied] = useState(false);
    const discount = Math.round(
        (1 - selectedVariant.price / selectedVariant.originalPrice) * 100,
    );
    const selectVariantOption = (
        dimension: VariantDimension,
        value: string,
    ) => {
        setVariantSelections((current) => ({
            ...current,
            [dimension]: value,
        }));
        setQuantity(1);
        setGalleryMode('image');
    };
    const isOptionAvailable = (dimension: VariantDimension, value: string) => {
        const proposedSelections = {
            ...variantSelections,
            [dimension]: value,
        };

        return variants.some(
            (variant) =>
                variantMatches(variant, proposedSelections) &&
                variant.stock > 0,
        );
    };

    const checkDelivery = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeliveryMessage(
            /^\d{6}$/.test(pincode)
                ? 'Delivery available in 2–4 business days'
                : 'Enter a valid 6-digit pincode',
        );
    };

    const shareProduct = async () => {
        if (navigator.share) {
            await navigator.share({
                title: product.name,
                url: window.location.href,
            });

            return;
        }

        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    };

    return (
        <section className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
                <div className="relative min-h-[480px] overflow-hidden rounded-[2.5rem] bg-slate-100 sm:min-h-[650px]">
                    {galleryMode === 'video' ? (
                        <div className="absolute inset-0 grid place-items-center bg-slate-950 text-white">
                            <ProductImage
                                product={product}
                                className="absolute inset-0 size-full opacity-35"
                            />
                            <button
                                type="button"
                                className="relative grid size-20 place-items-center rounded-full bg-white text-slate-950 shadow-2xl"
                                aria-label="Play product video"
                            >
                                <Play className="ml-1 size-8 fill-current" />
                            </button>
                            <p className="absolute bottom-8 text-sm font-black">
                                Product story · 00:42
                            </p>
                        </div>
                    ) : (
                        <ProductImage
                            product={product}
                            imagePosition={selectedVariant.imagePosition}
                            className={`absolute inset-0 size-full transition duration-500 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'} ${galleryMode === '360' ? 'duration-300' : ''}`}
                            style={{
                                transform:
                                    galleryMode === '360'
                                        ? `perspective(900px) rotateY(${rotation}deg)`
                                        : undefined,
                            }}
                        />
                    )}
                    {galleryMode === '360' && (
                        <div className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setRotation((value) => value - 45)
                                }
                                className="rounded-full bg-white px-4 py-2 text-xs font-black shadow"
                            >
                                Rotate left
                            </button>
                            <span className="rounded-full bg-slate-950/75 px-3 py-2 text-[10px] font-bold text-white">
                                {Math.abs(rotation) % 360}° view
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setRotation((value) => value + 45)
                                }
                                className="rounded-full bg-white px-4 py-2 text-xs font-black shadow"
                            >
                                Rotate right
                            </button>
                        </div>
                    )}
                    <span className="absolute top-5 left-5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-emerald-600 shadow-sm">
                        {discount}% off
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsZoomed((value) => !value)}
                        className="absolute top-5 right-5 grid size-10 place-items-center rounded-full bg-white shadow"
                        aria-label="Toggle product zoom"
                    >
                        <ZoomIn className="size-4" />
                    </button>
                </div>
                <div className="mt-4 grid grid-cols-5 gap-3">
                    {[0, 1, 2].map((index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                                setGalleryMode('image');
                                setActiveImage(index);
                            }}
                            className={`relative aspect-square overflow-hidden rounded-2xl border-2 bg-slate-100 ${galleryMode === 'image' && activeImage === index ? 'border-orange-500' : 'border-transparent'}`}
                            aria-label={`View product image ${index + 1}`}
                        >
                            <ProductImage
                                product={product}
                                imagePosition={
                                    variants[index % variants.length]
                                        .imagePosition
                                }
                                className="absolute inset-0 size-full"
                            />
                        </button>
                    ))}
                    <GalleryButton
                        active={galleryMode === 'video'}
                        label="Video"
                        onClick={() => setGalleryMode('video')}
                    >
                        <Video className="size-5" />
                    </GalleryButton>
                    <GalleryButton
                        active={galleryMode === '360'}
                        label="360°"
                        onClick={() => setGalleryMode('360')}
                    >
                        <Rotate3D className="size-5" />
                    </GalleryButton>
                </div>
                <p className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400">
                    <Maximize2 className="size-3.5" /> Tap the main image to
                    inspect details
                </p>
            </div>

            <div className="py-2">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-black tracking-[0.18em] text-orange-500 uppercase">
                            {product.brand} · {product.category}
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
                            {product.name}
                        </h1>
                    </div>
                    <button
                        type="button"
                        onClick={shareProduct}
                        className="grid size-11 shrink-0 place-items-center rounded-full border border-slate-200 dark:border-white/10"
                        aria-label="Share product"
                    >
                        {copied ? (
                            <Check className="size-4 text-emerald-500" />
                        ) : (
                            <Share2 className="size-4" />
                        )}
                    </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 font-black text-white">
                        {product.rating}
                        <Star className="size-3 fill-current" />
                    </span>
                    <button
                        type="button"
                        onClick={() =>
                            document
                                .querySelector('#customer-reviews')
                                ?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className="font-bold text-slate-500 hover:text-orange-500"
                    >
                        1,248 ratings · 386 reviews
                    </button>
                    <span className="text-slate-300">|</span>
                    <span className="font-bold text-slate-500">
                        SKU: {selectedVariant.sku}
                    </span>
                </div>

                <div className="mt-6 rounded-2xl bg-orange-50 p-5 dark:bg-orange-500/10">
                    <div className="flex flex-wrap items-baseline gap-3">
                        <span className="text-3xl font-black">
                            {money.format(selectedVariant.price)}
                        </span>
                        <span className="text-base text-slate-400 line-through">
                            {money.format(selectedVariant.originalPrice)}
                        </span>
                        <span className="font-black text-emerald-600">
                            Save {discount}%
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                        Inclusive of all taxes · GST invoice available
                    </p>
                </div>

                <p className="mt-6 leading-7 text-slate-600 dark:text-slate-300">
                    Designed for modern everyday life with dependable
                    performance, thoughtful details, and quality you can feel
                    from the first use.
                </p>
                <ul className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Highlight>
                        Verified quality and authentic brand warranty
                    </Highlight>
                    <Highlight>
                        Thoughtfully selected materials and finish
                    </Highlight>
                    <Highlight>
                        Secure packaging with easy return eligibility
                    </Highlight>
                </ul>

                <div className="mt-6 rounded-[1.5rem] border border-slate-200 p-5 dark:border-white/10">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="font-black">Choose your variant</p>
                            <p className="mt-1 text-xs text-slate-500">
                                Price, stock, image, and SKU update by
                                combination.
                            </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black dark:bg-white/5">
                            {variants.length} variants
                        </span>
                    </div>
                    {(
                        [
                            'color',
                            'size',
                            'storage',
                            'weight',
                            'packSize',
                        ] as VariantDimension[]
                    ).map((dimension) => (
                        <VariantOptionGroup
                            key={dimension}
                            dimension={dimension}
                            value={variantSelections[dimension]}
                            options={variantOptions(variants, dimension)}
                            onChange={(value) =>
                                selectVariantOption(dimension, value)
                            }
                            isAvailable={(value) =>
                                isOptionAvailable(dimension, value)
                            }
                        />
                    ))}
                </div>
                <button
                    type="button"
                    className="mt-2 text-xs font-black text-orange-600 underline underline-offset-4"
                >
                    View size chart
                </button>

                <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                    <div>
                        <p className="text-sm font-black">Quantity</p>
                        <p
                            className={`mt-1 text-xs font-bold ${selectedVariant.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}
                        >
                            {selectedVariant.stock > 0
                                ? `${selectedVariant.stock} units in stock`
                                : 'Currently out of stock'}
                        </p>
                    </div>
                    <div className="flex items-center rounded-full border border-slate-200 dark:border-white/10">
                        <QuantityButton
                            label="Decrease quantity"
                            disabled={quantity === 1}
                            onClick={() =>
                                setQuantity((value) => Math.max(1, value - 1))
                            }
                        >
                            <Minus className="size-3.5" />
                        </QuantityButton>
                        <span className="w-9 text-center text-sm font-black">
                            {quantity}
                        </span>
                        <QuantityButton
                            label="Increase quantity"
                            disabled={
                                quantity >= Math.max(selectedVariant.stock, 1)
                            }
                            onClick={() => setQuantity((value) => value + 1)}
                        >
                            <Plus className="size-3.5" />
                        </QuantityButton>
                    </div>
                </div>

                {selectedVariant.stock > 0 ? (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <Link
                            href={cart.url({
                                query: {
                                    add: product.slug,
                                    variant: selectedVariant.id,
                                    quantity,
                                },
                            })}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white hover:bg-orange-500 dark:bg-orange-500"
                        >
                            <ShoppingBag className="size-4" /> Add to cart
                        </Link>
                        <Link
                            href={checkout.url()}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-4 text-sm font-black text-white hover:bg-orange-400"
                        >
                            Buy now{' '}
                            <ChevronDown className="size-4 -rotate-90" />
                        </Link>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setAlertEnabled(true)}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white"
                    >
                        <Bell className="size-4" />{' '}
                        {alertEnabled
                            ? 'Back-in-stock alert enabled'
                            : 'Notify me when available'}
                    </button>
                )}
                <div className="mt-3 grid grid-cols-3 gap-2">
                    <Link
                        href={wishlist.url({
                            query: { add: product.slug },
                        })}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-3 text-xs font-black dark:border-white/10"
                    >
                        <Heart className="size-4" /> Wishlist
                    </Link>
                    <Link
                        href={comparison.url({
                            query: { add: product.slug },
                        })}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-3 text-xs font-black dark:border-white/10"
                    >
                        <Copy className="size-4" /> Compare
                    </Link>
                    <button
                        type="button"
                        onClick={() => setAlertEnabled((value) => !value)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-3 text-xs font-black dark:border-white/10"
                    >
                        <Bell className="size-4" /> Price alert
                    </button>
                </div>

                <div className="mt-7 rounded-[1.5rem] border border-slate-200 p-5 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <p className="font-black">Delivery & services</p>
                        <Truck className="size-5 text-orange-500" />
                    </div>
                    <form onSubmit={checkDelivery} className="mt-4 flex gap-2">
                        <input
                            value={pincode}
                            onChange={(event) =>
                                setPincode(
                                    event.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 6),
                                )
                            }
                            inputMode="numeric"
                            placeholder="Enter 6-digit pincode"
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-slate-900"
                        />
                        <button className="rounded-xl bg-slate-950 px-4 text-xs font-black text-white dark:bg-orange-500">
                            Check
                        </button>
                    </form>
                    {deliveryMessage && (
                        <p
                            className={`mt-2 text-xs font-bold ${deliveryMessage.startsWith('Delivery') ? 'text-emerald-600' : 'text-rose-500'}`}
                        >
                            {deliveryMessage}
                        </p>
                    )}
                    <div className="mt-4 grid gap-3 text-xs">
                        <Service
                            icon={<Truck className="size-4" />}
                            title="Delivery estimate"
                            value="2–4 business days"
                        />
                        <Service
                            icon={<Box className="size-4" />}
                            title="Shipping"
                            value={
                                product.freeShipping
                                    ? 'Free shipping'
                                    : '₹99 shipping charge'
                            }
                        />
                        <Service
                            icon={<PackageCheck className="size-4" />}
                            title="Returns"
                            value="7-day easy returns"
                        />
                        <Service
                            icon={<ShieldCheck className="size-4" />}
                            title="Warranty"
                            value="1-year manufacturer warranty"
                        />
                    </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-slate-200 p-5 dark:border-white/10">
                    <p className="font-black">Offers for you</p>
                    <div className="mt-4 grid gap-3">
                        <Offer
                            icon={<CreditCard className="size-4" />}
                            title="Bank offer"
                            copy="10% instant discount with select cards"
                        />
                        <Offer
                            icon={<BadgeCheck className="size-4" />}
                            title="Coupon offer"
                            copy="Use VELORA10 for an extra 10% off"
                        />
                        <Offer
                            icon={<CircleAlert className="size-4" />}
                            title="Easy EMI"
                            copy={`Plans from ${money.format(Math.ceil(selectedVariant.price / 12))}/month`}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function GalleryButton({
    active,
    label,
    onClick,
    children,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`grid aspect-square place-items-center rounded-2xl border-2 text-xs font-black ${active ? 'border-orange-500 text-orange-600' : 'border-slate-200 dark:border-white/10'}`}
            aria-label={`Show product ${label}`}
        >
            {children}
            <span className="sr-only">{label}</span>
        </button>
    );
}
function Highlight({ children }: { children: ReactNode }) {
    return (
        <li className="flex items-center gap-2">
            <Check className="size-4 text-emerald-500" />
            {children}
        </li>
    );
}
function VariantOptionGroup({
    dimension,
    value,
    options,
    onChange,
    isAvailable,
}: {
    dimension: VariantDimension;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    isAvailable: (value: string) => boolean;
}) {
    return (
        <div className="mt-5">
            <div className="flex items-center justify-between">
                <p className="text-sm font-black">{variantLabels[dimension]}</p>
                <span className="text-xs text-slate-400">
                    Selected: {value}
                </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {options.map((option, index) => {
                    const available = isAvailable(option);

                    return (
                        <button
                            key={option}
                            type="button"
                            disabled={!available}
                            onClick={() => onChange(option)}
                            className={`relative rounded-full border-2 px-4 py-2 text-xs font-black transition ${value === option ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-500/10' : 'border-slate-200 dark:border-white/10'} disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300 disabled:line-through dark:disabled:border-white/5 dark:disabled:text-slate-700`}
                            aria-label={`${variantLabels[dimension]} ${option}${available ? '' : ', unavailable'}`}
                        >
                            {dimension === 'color' && (
                                <span
                                    className={`mr-2 inline-block size-2.5 rounded-full ${index % 2 === 0 ? 'bg-slate-900' : 'bg-orange-500'}`}
                                />
                            )}
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
function QuantityButton({
    label,
    disabled,
    onClick,
    children,
}: {
    label: string;
    disabled: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className="grid size-9 place-items-center disabled:opacity-30"
        >
            {children}
        </button>
    );
}
function Service({
    icon,
    title,
    value,
}: {
    icon: ReactNode;
    title: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-orange-500">{icon}</span>
            <span className="font-bold">{title}</span>
            <span className="ml-auto text-slate-500">{value}</span>
        </div>
    );
}
function Offer({
    icon,
    title,
    copy,
}: {
    icon: ReactNode;
    title: string;
    copy: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-orange-500">{icon}</span>
            <div>
                <p className="text-xs font-black">{title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{copy}</p>
            </div>
        </div>
    );
}
