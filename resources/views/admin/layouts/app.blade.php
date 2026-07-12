<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0f172a">

    <title>@yield('title', 'Admin Dashboard') · {{ config('app.name', 'Velora') }}</title>

    <script>
        document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
        );
    </script>

    @vite('resources/css/app.css')
</head>

<body class="min-h-full bg-slate-50 font-sans text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-100">
<div class="min-h-screen">
    <div data-sidebar-overlay class="fixed inset-0 z-40 hidden bg-slate-950/60 backdrop-blur-sm lg:hidden"></div>

    <aside
        data-sidebar
        class="fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-white/10 bg-slate-950 text-slate-300 shadow-2xl transition-transform duration-300 ease-out lg:translate-x-0 lg:shadow-none"
        aria-label="Admin navigation"
    >
        <div class="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <a href="{{ route('admin.dashboard') }}" class="group flex items-center gap-3">
                <span class="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-black text-white shadow-lg shadow-indigo-950/40">V</span>
                <span>
                    <span class="block text-base font-bold tracking-tight text-white">{{ config('app.name', 'Velora') }}</span>
                    <span class="block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Control center</span>
                </span>
            </a>

            <button data-sidebar-close type="button" class="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 lg:hidden" aria-label="Close navigation">
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
        </div>

        <nav class="flex-1 overflow-y-auto px-4 py-6">
            <p class="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Overview</p>
            <a href="{{ route('admin.dashboard') }}" aria-current="page" class="mt-3 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/10">
                <span class="grid size-9 place-items-center rounded-lg bg-indigo-500 text-white shadow-lg shadow-indigo-950/50">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>
                </span>
                Dashboard
            </a>

            <p class="mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Management</p>
            <div class="mt-3 grid gap-1">
                @foreach ([
                    ['Users', 'M5 20a7 7 0 0 1 14 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
                    ['Catalogue', 'M4 5h16v14H4zM4 9h16M9 9v10'],
                    ['Orders', 'M6 7h12l-1 13H7L6 7Zm3 0a3 3 0 0 1 6 0'],
                    ['Analytics', 'M4 19V9m6 10V5m6 14v-7m4 7H2'],
                ] as [$label, $path])
                    <span class="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500" title="Coming soon">
                        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="{{ $path }}"/></svg>
                        <span class="flex-1">{{ $label }}</span>
                        <span class="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">Soon</span>
                    </span>
                @endforeach
            </div>
        </nav>

        <div class="border-t border-white/10 p-4">
            <div class="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <span class="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-slate-950">
                    {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
                </span>
                <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-white">{{ auth()->user()->name }}</p>
                    <p class="truncate text-xs text-slate-500">{{ auth()->user()->email }}</p>
                </div>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400" aria-label="Sign out">
                        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/></svg>
                    </button>
                </form>
            </div>
        </div>
    </aside>

    <div class="lg:pl-72">
        <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
            <div class="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
                <button data-sidebar-open type="button" class="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 lg:hidden" aria-label="Open navigation">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>

                <div class="min-w-0 flex-1">
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Admin / Overview</p>
                    <h1 class="truncate text-lg font-bold tracking-tight text-slate-950 dark:text-white">@yield('page-title', 'Dashboard')</h1>
                </div>

                <div class="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-400 sm:flex">
                    <span class="size-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                    All systems operational
                </div>

                <button data-theme-toggle type="button" class="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10" aria-label="Toggle color theme">
                    <svg class="size-5 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3V1m0 22v-2M3 12H1m22 0h-2M5.64 5.64 4.22 4.22m15.56 15.56-1.42-1.42M18.36 5.64l1.42-1.42M4.22 19.78l1.42-1.42"/><circle cx="12" cy="12" r="4"/></svg>
                    <svg class="hidden size-5 dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 14.5A9 9 0 0 1 9.5 3 9 9 0 1 0 21 14.5Z"/></svg>
                </button>
            </div>
        </header>

        <main class="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            @if (session('success'))
                <div role="status" class="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <span class="size-2 rounded-full bg-emerald-500"></span>
                    {{ session('success') }}
                </div>
            @endif

            @yield('content')
        </main>
    </div>
</div>

<script>
    const sidebar = document.querySelector('[data-sidebar]');
    const overlay = document.querySelector('[data-sidebar-overlay]');
    const setSidebar = (open) => {
        sidebar?.classList.toggle('-translate-x-full', !open);
        overlay?.classList.toggle('hidden', !open);
        document.body.classList.toggle('overflow-hidden', open);
    };

    document.querySelector('[data-sidebar-open]')?.addEventListener('click', () => setSidebar(true));
    document.querySelector('[data-sidebar-close]')?.addEventListener('click', () => setSidebar(false));
    overlay?.addEventListener('click', () => setSidebar(false));
    document.addEventListener('keydown', (event) => event.key === 'Escape' && setSidebar(false));

    document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
        const dark = document.documentElement.classList.toggle('dark');
        localStorage.theme = dark ? 'dark' : 'light';
    });
</script>
</body>
</html>
