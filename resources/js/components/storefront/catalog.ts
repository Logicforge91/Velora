import {
    Headphones,
    Home,
    Laptop,
    Shirt,
    ShoppingBag,
    Smartphone,
    Watch,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type StorefrontCategory = {
    label: string;
    icon: LucideIcon;
    tone: string;
    imagePosition: string;
};

export type StorefrontProduct = {
    id: number;
    slug: string;
    name: string;
    category: string;
    price: number;
    original: number;
    rating: number;
    offer: string;
    icon: LucideIcon;
    tone: string;
    imagePosition: string;
    brand: string;
    seller: string;
    subcategory: string;
    collection: string;
    isBestSeller?: boolean;
    isRecommended?: boolean;
    popularity: number;
    stock: number;
    sizes: string[];
    colors: string[];
    material: string;
    gender: string;
    deliveryZones: string[];
    cashOnDelivery: boolean;
    freeShipping: boolean;
};

export const categories: StorefrontCategory[] = [
    {
        label: 'Mobiles',
        icon: Smartphone,
        tone: 'from-blue-100 to-indigo-50 text-blue-700',
        imagePosition: '0% 0%',
    },
    {
        label: 'Fashion',
        icon: Shirt,
        tone: 'from-pink-100 to-rose-50 text-rose-700',
        imagePosition: '100% 0%',
    },
    {
        label: 'Electronics',
        icon: Laptop,
        tone: 'from-violet-100 to-purple-50 text-violet-700',
        imagePosition: '50% 100%',
    },
    {
        label: 'Home',
        icon: Home,
        tone: 'from-amber-100 to-orange-50 text-amber-700',
        imagePosition: '100% 100%',
    },
    {
        label: 'Appliances',
        icon: Zap,
        tone: 'from-cyan-100 to-sky-50 text-cyan-700',
        imagePosition: '50% 0%',
    },
    {
        label: 'Accessories',
        icon: Watch,
        tone: 'from-emerald-100 to-teal-50 text-emerald-700',
        imagePosition: '0% 100%',
    },
];

export const products: StorefrontProduct[] = [
    {
        id: 1,
        slug: 'nova-x-pro-smartphone',
        name: 'Nova X Pro Smartphone',
        category: 'Mobiles',
        price: 28999,
        original: 34999,
        rating: 4.6,
        offer: '17% off',
        icon: Smartphone,
        tone: 'from-blue-100 via-sky-50 to-white text-blue-700',
        imagePosition: '0% 0%',
        brand: 'Nova',
        seller: 'The Tech Edit',
        subcategory: 'Smartphones',
        collection: 'Future favourites',
        isBestSeller: true,
        popularity: 94,
        stock: 18,
        sizes: ['Standard'],
        colors: ['Midnight', 'Silver'],
        material: 'Glass & aluminium',
        gender: 'Unisex',
        deliveryZones: ['All India', 'Metro cities'],
        cashOnDelivery: true,
        freeShipping: true,
    },
    {
        id: 2,
        slug: 'studio-wireless-headphones',
        name: 'Studio Wireless Headphones',
        category: 'Electronics',
        price: 2499,
        original: 4999,
        rating: 4.4,
        offer: '50% off',
        icon: Headphones,
        tone: 'from-violet-100 via-fuchsia-50 to-white text-violet-700',
        imagePosition: '50% 0%',
        brand: 'Studio',
        seller: 'The Tech Edit',
        subcategory: 'Audio',
        collection: 'Summer edit',
        isRecommended: true,
        popularity: 91,
        stock: 34,
        sizes: ['Standard'],
        colors: ['Black', 'Violet'],
        material: 'Recycled plastic',
        gender: 'Unisex',
        deliveryZones: ['All India', 'Metro cities'],
        cashOnDelivery: true,
        freeShipping: true,
    },
    {
        id: 3,
        slug: 'everyday-classic-sneakers',
        name: 'Everyday Classic Sneakers',
        category: 'Fashion',
        price: 1599,
        original: 2999,
        rating: 4.3,
        offer: '46% off',
        icon: ShoppingBag,
        tone: 'from-rose-100 via-orange-50 to-white text-rose-700',
        imagePosition: '100% 0%',
        brand: 'Move',
        seller: 'Move Studio',
        subcategory: 'Footwear',
        collection: 'Everyday style',
        isBestSeller: true,
        popularity: 97,
        stock: 12,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Rose'],
        material: 'Canvas',
        gender: 'Unisex',
        deliveryZones: ['All India', 'Metro cities'],
        cashOnDelivery: true,
        freeShipping: false,
    },
    {
        id: 4,
        slug: 'pulse-active-smartwatch',
        name: 'Pulse Active Smartwatch',
        category: 'Accessories',
        price: 3499,
        original: 6999,
        rating: 4.5,
        offer: '50% off',
        icon: Watch,
        tone: 'from-emerald-100 via-teal-50 to-white text-emerald-700',
        imagePosition: '0% 100%',
        brand: 'Pulse',
        seller: 'Move Studio',
        subcategory: 'Wearables',
        collection: 'Future favourites',
        isRecommended: true,
        popularity: 89,
        stock: 0,
        sizes: ['S', 'M', 'L'],
        colors: ['Black', 'Green'],
        material: 'Silicone',
        gender: 'Unisex',
        deliveryZones: ['Metro cities'],
        cashOnDelivery: false,
        freeShipping: true,
    },
    {
        id: 5,
        slug: 'airbook-14-performance',
        name: 'Airbook 14 Performance',
        category: 'Electronics',
        price: 54990,
        original: 64990,
        rating: 4.7,
        offer: '15% off',
        icon: Laptop,
        tone: 'from-slate-200 via-blue-50 to-white text-slate-700',
        imagePosition: '50% 100%',
        brand: 'Airbook',
        seller: 'The Tech Edit',
        subcategory: 'Laptops',
        collection: 'Work better',
        popularity: 84,
        stock: 7,
        sizes: ['14 inch'],
        colors: ['Silver'],
        material: 'Aluminium',
        gender: 'Unisex',
        deliveryZones: ['Metro cities'],
        cashOnDelivery: false,
        freeShipping: true,
    },
    {
        id: 6,
        slug: 'modern-home-essentials',
        name: 'Modern Home Essentials',
        category: 'Home',
        price: 1299,
        original: 2199,
        rating: 4.2,
        offer: '40% off',
        icon: Home,
        tone: 'from-amber-100 via-yellow-50 to-white text-amber-700',
        imagePosition: '100% 100%',
        brand: 'Modern Home',
        seller: 'House of Everyday',
        subcategory: 'Home décor',
        collection: 'Calmer spaces',
        isRecommended: true,
        popularity: 86,
        stock: 25,
        sizes: ['Small', 'Large'],
        colors: ['Natural', 'Amber'],
        material: 'Cotton',
        gender: 'Unisex',
        deliveryZones: ['All India', 'Metro cities'],
        cashOnDelivery: true,
        freeShipping: false,
    },
];

export const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

export function scrollToStorefrontSection(selector: string): void {
    const section = document.querySelector<HTMLElement>(selector);

    if (!section) {
        return;
    }

    const header = document.querySelector<HTMLElement>(
        '[data-storefront-header]',
    );
    const headerOffset = header?.offsetHeight ?? 0;
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({
        top:
            section.getBoundingClientRect().top +
            window.scrollY -
            headerOffset -
            16,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
}
