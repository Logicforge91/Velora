import { router } from '@inertiajs/react';
import {
    Camera,
    Clock3,
    Flame,
    Mic,
    QrCode,
    Search,
    Store,
    Tag,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { categories, products } from '@/components/storefront/catalog';
import { catalog } from '@/routes/storefront';

const historyKey = 'velora-recent-searches';
const popularSearches = [
    'wireless headphones',
    'smartwatch',
    'home essentials',
    'sneakers',
];
const brandSuggestions = ['Nova', 'Studio', 'Pulse', 'Airbook', 'Modern Home'];
const storeSuggestions = ['The Tech Edit', 'House of Everyday', 'Move Studio'];

type SpeechRecognitionConstructor = new () => {
    lang: string;
    interimResults: boolean;
    start: () => void;
    onresult: (event: {
        results: ArrayLike<{ 0: { transcript: string } }>;
    }) => void;
    onerror: () => void;
    onend: () => void;
};

type Props = {
    query: string;
    onQueryChange: (query: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    className: string;
    compact?: boolean;
};

export default function StorefrontSearch({
    query,
    onQueryChange,
    onSubmit,
    className,
    compact = false,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        if (typeof window === 'undefined') {
            return [];
        }

        try {
            return JSON.parse(
                localStorage.getItem(historyKey) ?? '[]',
            ) as string[];
        } catch {
            return [];
        }
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const barcodeInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const close = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', close);

        return () => document.removeEventListener('mousedown', close);
    }, []);

    const suggestions = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        if (normalized === '') {
            return [];
        }

        return [
            ...products.map((product) => ({
                label: product.name,
                type: 'Product',
            })),
            ...categories.map((category) => ({
                label: category.label,
                type: 'Category',
            })),
            ...brandSuggestions.map((brand) => ({
                label: brand,
                type: 'Brand',
            })),
            ...storeSuggestions.map((store) => ({
                label: store,
                type: 'Store',
            })),
        ]
            .filter((item) => item.label.toLowerCase().includes(normalized))
            .slice(0, 6);
    }, [query]);

    const saveAndSearch = (term: string) => {
        const normalized = term.trim();

        if (normalized === '') {
            return;
        }

        const next = [
            normalized,
            ...recentSearches.filter(
                (item) => item.toLowerCase() !== normalized.toLowerCase(),
            ),
        ].slice(0, 6);
        setRecentSearches(next);
        localStorage.setItem(historyKey, JSON.stringify(next));
        setIsOpen(false);
        onQueryChange(normalized);
        router.visit(catalog.url({ query: { search: normalized } }));
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        if (query.trim() !== '') {
            const next = [
                query.trim(),
                ...recentSearches.filter((item) => item !== query.trim()),
            ].slice(0, 6);
            setRecentSearches(next);
            localStorage.setItem(historyKey, JSON.stringify(next));
            setIsOpen(false);
        }

        onSubmit(event);
    };

    const startVoiceSearch = () => {
        const recognitionConstructor =
            (
                window as typeof window & {
                    SpeechRecognition?: SpeechRecognitionConstructor;
                    webkitSpeechRecognition?: SpeechRecognitionConstructor;
                }
            ).SpeechRecognition ??
            (
                window as typeof window & {
                    webkitSpeechRecognition?: SpeechRecognitionConstructor;
                }
            ).webkitSpeechRecognition;

        if (!recognitionConstructor) {
            onQueryChange('Voice search is not supported in this browser');

            return;
        }

        const recognition = new recognitionConstructor();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.onresult = (event) =>
            saveAndSearch(event.results[0][0].transcript);
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        setIsListening(true);
        recognition.start();
    };

    const searchFromFile = (
        event: ChangeEvent<HTMLInputElement>,
        mode: 'barcode' | 'image',
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const name = file.name.replace(/\.[^.]+$/, '').replaceAll(/[-_]/g, ' ');
        saveAndSearch(
            mode === 'barcode'
                ? name || 'scanned product'
                : name || 'visual match',
        );
        event.target.value = '';
    };

    const clearHistory = () => {
        setRecentSearches([]);
        localStorage.removeItem(historyKey);
    };

    return (
        <div ref={containerRef} className={className}>
            <form onSubmit={submit}>
                <Search
                    className={`absolute left-3 size-4 -translate-y-1/2 text-slate-400 ${compact ? 'top-5' : 'top-1/2 left-4'}`}
                />
                <input
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={
                        compact
                            ? 'Search products'
                            : 'Search products, categories, brands or stores'
                    }
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls="storefront-search-panel"
                    className={`${compact ? 'h-10 bg-white pl-9 dark:bg-white/5' : 'h-11 border border-slate-950/10 bg-white/70 pr-40 pl-11 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-white/5 dark:focus:ring-orange-500/10'} w-full rounded-full pr-3 text-sm transition outline-none`}
                />
                {!compact && (
                    <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-0.5">
                        <SearchAction
                            label="Voice search"
                            onClick={startVoiceSearch}
                            active={isListening}
                        >
                            <Mic className="size-4" />
                        </SearchAction>
                        <SearchAction
                            label="Scan barcode or QR code"
                            onClick={() => barcodeInputRef.current?.click()}
                        >
                            <QrCode className="size-4" />
                        </SearchAction>
                        <SearchAction
                            label="Search by image"
                            onClick={() => imageInputRef.current?.click()}
                        >
                            <Camera className="size-4" />
                        </SearchAction>
                        <button className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500">
                            Search
                        </button>
                    </div>
                )}
            </form>

            <input
                ref={barcodeInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(event) => searchFromFile(event, 'barcode')}
            />
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => searchFromFile(event, 'image')}
            />

            {isOpen && (
                <div
                    id="storefront-search-panel"
                    className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-2xl dark:border-white/10 dark:bg-slate-900 dark:text-white"
                >
                    <div className="max-h-[70vh] overflow-y-auto p-3">
                        {query.trim() !== '' ? (
                            suggestions.length > 0 ? (
                                <div>
                                    <p className="px-2 py-1 text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                        Suggestions
                                    </p>
                                    {suggestions.map((suggestion) => (
                                        <button
                                            key={`${suggestion.type}-${suggestion.label}`}
                                            type="button"
                                            onClick={() =>
                                                saveAndSearch(suggestion.label)
                                            }
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-orange-50 dark:hover:bg-white/5"
                                        >
                                            {suggestion.type === 'Store' ? (
                                                <Store className="size-4 text-orange-500" />
                                            ) : suggestion.type === 'Brand' ? (
                                                <Tag className="size-4 text-violet-500" />
                                            ) : (
                                                <Search className="size-4 text-slate-400" />
                                            )}
                                            <span className="font-semibold">
                                                {suggestion.label}
                                            </span>
                                            <span className="ml-auto text-[10px] font-bold text-slate-400">
                                                {suggestion.type}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-5 text-center">
                                    <Search className="mx-auto size-7 text-slate-300" />
                                    <p className="mt-2 text-sm font-black">
                                        No exact suggestions
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Search anyway to see recommended
                                        alternatives.
                                    </p>
                                </div>
                            )
                        ) : (
                            <>
                                {recentSearches.length > 0 && (
                                    <SearchList
                                        title="Recent searches"
                                        icon={<Clock3 className="size-3.5" />}
                                        items={recentSearches}
                                        onSelect={saveAndSearch}
                                        action={
                                            <button
                                                type="button"
                                                onClick={clearHistory}
                                                className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-rose-500"
                                            >
                                                <Trash2 className="size-3" />{' '}
                                                Clear
                                            </button>
                                        }
                                    />
                                )}
                                <SearchList
                                    title="Popular searches"
                                    icon={
                                        <Flame className="size-3.5 text-orange-500" />
                                    }
                                    items={popularSearches}
                                    onSelect={saveAndSearch}
                                />
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-1 border-t border-slate-100 px-4 py-2 text-[10px] text-slate-400 dark:border-white/10">
                        <QrCode className="size-3" /> Scan a code or{' '}
                        <Camera className="ml-2 size-3" /> upload an image to
                        find a visual match
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="ml-auto grid size-6 place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
                            aria-label="Close search"
                        >
                            <X className="size-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function SearchAction({
    label,
    onClick,
    children,
    active = false,
}: {
    label: string;
    onClick: () => void;
    children: ReactNode;
    active?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={`grid size-8 place-items-center rounded-full transition hover:bg-slate-100 dark:hover:bg-white/10 ${active ? 'animate-pulse text-orange-500' : 'text-slate-400'}`}
        >
            {children}
        </button>
    );
}

function SearchList({
    title,
    icon,
    items,
    onSelect,
    action,
}: {
    title: string;
    icon: ReactNode;
    items: readonly string[];
    onSelect: (item: string) => void;
    action?: ReactNode;
}) {
    return (
        <div className="p-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-slate-400 uppercase">
                {icon}
                {title}
                <span className="ml-auto">{action}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                {items.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onSelect(item)}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold transition hover:bg-orange-100 hover:text-orange-700 dark:bg-white/5"
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
}
