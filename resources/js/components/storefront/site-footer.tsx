import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Twitter,
    Youtube,
} from 'lucide-react';
import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';

const footerGroups = [
    {
        title: 'Company',
        links: [
            { label: 'About us', href: '/about-us' },
            { label: 'Contact us', href: 'mailto:hello@velora.com' },
            { label: 'Careers', href: '/careers' },
            { label: 'Seller registration', href: '/register' },
            { label: 'Store locator', href: '/store-locator' },
        ],
    },
    {
        title: 'Help & support',
        links: [
            { label: 'Help centre', href: '/help-centre' },
            { label: 'Return policy', href: '/return-policy' },
            { label: 'Refund policy', href: '/refund-policy' },
            { label: 'Shipping policy', href: '/shipping-policy' },
            { label: 'Cancellation policy', href: '/cancellation-policy' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Terms and conditions', href: '/terms-and-conditions' },
            { label: 'Privacy policy', href: '/privacy-policy' },
        ],
    },
] as const;

const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
    { label: 'X', href: 'https://x.com', icon: Twitter },
    { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
] as const;

export default function SiteFooter() {
    const emailInputId = useId();
    const [isSubscribed, setIsSubscribed] = useState(false);

    const subscribe = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubscribed(true);
        event.currentTarget.reset();
    };

    return (
        <footer className="relative overflow-hidden bg-[#101820] text-slate-300">
            <div
                className="pointer-events-none absolute -top-40 right-0 size-96 rounded-full bg-orange-500/10 blur-3xl"
                aria-hidden="true"
            />

            <section className="relative border-b border-white/10">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:px-8 lg:py-12">
                    <div>
                        <span className="text-xs font-bold tracking-[0.2em] text-orange-400 uppercase">
                            The Velora edit
                        </span>
                        <h2 className="mt-2 max-w-lg text-2xl font-black tracking-tight text-white sm:text-3xl">
                            Fresh finds, thoughtful offers, no inbox clutter.
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                            Get product drops, member-only prices, and shopping
                            inspiration delivered occasionally.
                        </p>
                    </div>

                    <form
                        className="flex flex-col gap-3 sm:flex-row"
                        onSubmit={subscribe}
                    >
                        <label htmlFor={emailInputId} className="sr-only">
                            Email address
                        </label>
                        <div className="relative flex-1">
                            <Mail className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-500" />
                            <input
                                id={emailInputId}
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="you@example.com"
                                aria-describedby={`${emailInputId}-status`}
                                className="h-12 w-full rounded-xl border border-white/10 bg-white/6 pr-4 pl-11 text-sm text-white placeholder:text-slate-500 focus:border-orange-400"
                                onChange={() => setIsSubscribed(false)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-bold text-white transition hover:bg-orange-400"
                        >
                            Subscribe
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </form>
                    <p
                        id={`${emailInputId}-status`}
                        className={`text-sm text-emerald-400 lg:col-start-2 ${isSubscribed ? '' : 'sr-only'}`}
                        role="status"
                    >
                        You’re on the list. Welcome to Velora.
                    </p>
                </div>
            </section>

            <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.35fr_0.9fr_1.1fr_0.8fr_1.25fr] lg:px-8 lg:py-16">
                <div>
                    <Link
                        href={home.url()}
                        className="inline-flex items-center gap-2.5 text-white"
                        aria-label="Velora home"
                    >
                        <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-950/30">
                            <AppLogoIcon className="size-7" />
                        </span>
                        <span className="text-2xl font-black tracking-tight">
                            Velora
                        </span>
                    </Link>
                    <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
                        Good things, thoughtfully chosen. Shop confidently with
                        transparent pricing, reliable delivery, and support that
                        listens.
                    </p>
                    <div className="mt-6 flex gap-2">
                        {socialLinks.map(({ label, href, icon: Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Follow Velora on ${label}`}
                                className="grid size-9 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:border-orange-400/60 hover:bg-orange-500/10 hover:text-orange-400"
                            >
                                <Icon className="size-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {footerGroups.map((group) => (
                    <FooterLinks key={group.title} {...group} />
                ))}

                <div>
                    <h3 className="text-sm font-black text-white">
                        Shop on the go
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                        Save favourites, track orders, and discover new drops
                        anywhere.
                    </p>
                    <div className="mt-5 grid max-w-[12rem] gap-2">
                        <AppStoreBadge store="Apple App Store" />
                        <AppStoreBadge store="Google Play" />
                    </div>
                    <a
                        href="/store-locator"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-orange-400"
                    >
                        <MapPin className="size-4 text-orange-400" />
                        Find a Velora store
                    </a>
                </div>
            </div>

            <div className="relative border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                    <p>
                        © {new Date().getFullYear()} Velora Commerce. All rights
                        reserved.
                    </p>
                    <p>Secure payments · Easy returns · Made for India</p>
                </div>
            </div>
        </footer>
    );
}

function FooterLinks({ title, links }: (typeof footerGroups)[number]) {
    return (
        <nav aria-label={`${title} links`}>
            <h3 className="text-sm font-black text-white">{title}</h3>
            <ul className="mt-4 grid gap-3 text-sm text-slate-400">
                {links.map((link) => (
                    <li key={link.label}>
                        <a
                            href={link.href}
                            className="transition hover:text-orange-400"
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

function AppStoreBadge({ store }: { store: string }) {
    return (
        <a
            href="#app-download"
            aria-label={`Download Velora on ${store}`}
            className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/6 px-3 py-2 transition hover:border-orange-400/50 hover:bg-white/10"
        >
            <AppLogoIcon className="size-6 text-orange-400" />
            <span>
                <span className="block text-[9px] leading-none font-medium tracking-wide text-slate-400 uppercase">
                    Download on
                </span>
                <span className="mt-1 block text-xs leading-none font-bold text-white">
                    {store}
                </span>
            </span>
        </a>
    );
}
