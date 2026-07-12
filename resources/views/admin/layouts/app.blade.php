<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        @yield('title', 'Admin Dashboard') |
        {{ config('app.name', 'Vendora') }}
    </title>

    @vite('resources/css/app.css')
</head>

<body class="bg-slate-100 text-slate-900">
<div class="min-h-screen lg:flex">

    {{-- Sidebar --}}
    <aside class="w-full bg-slate-950 text-white lg:min-h-screen lg:w-64">
        <div class="border-b border-slate-800 px-6 py-5">
            <a
                href="{{ route('admin.dashboard') }}"
                class="text-2xl font-bold"
            >
                Vendora
            </a>

            <p class="mt-1 text-xs uppercase tracking-widest text-slate-400">
                Administration
            </p>
        </div>

        <nav class="space-y-1 p-4">
            <a
                href="{{ route('admin.dashboard') }}"
                class="flex items-center rounded-lg bg-slate-800 px-4 py-3
                       text-sm font-medium text-white"
            >
                Dashboard
            </a>

            <p class="px-4 pb-1 pt-5 text-xs font-semibold uppercase
                      tracking-wider text-slate-500">
                User Management
            </p>

            <a
                href="#"
                class="flex items-center rounded-lg px-4 py-3 text-sm
                       text-slate-300 hover:bg-slate-800 hover:text-white"
            >
                Administrators
            </a>

            <a
                href="#"
                class="flex items-center rounded-lg px-4 py-3 text-sm
                       text-slate-300 hover:bg-slate-800 hover:text-white"
            >
                Vendors
            </a>

            <a
                href="#"
                class="flex items-center rounded-lg px-4 py-3 text-sm
                       text-slate-300 hover:bg-slate-800 hover:text-white"
            >
                Customers
            </a>

            <p class="px-4 pb-1 pt-5 text-xs font-semibold uppercase
                      tracking-wider text-slate-500">
                Catalogue
            </p>

            <a
                href="#"
                class="flex items-center rounded-lg px-4 py-3 text-sm
                       text-slate-300 hover:bg-slate-800 hover:text-white"
            >
                Categories
            </a>

            <a
                href="#"
                class="flex items-center rounded-lg px-4 py-3 text-sm
                       text-slate-300 hover:bg-slate-800 hover:text-white"
            >
                Products
            </a>

            <p class="px-4 pb-1 pt-5 text-xs font-semibold uppercase
                      tracking-wider text-slate-500">
                Sales
            </p>

            <a
                href="#"
                class="flex items-center rounded-lg px-4 py-3 text-sm
                       text-slate-300 hover:bg-slate-800 hover:text-white"
            >
                Orders
            </a>

            <a
                href="#"
                class="flex items-center rounded-lg px-4 py-3 text-sm
                       text-slate-300 hover:bg-slate-800 hover:text-white"
            >
                Payments
            </a>

            <a
                href="#"
                class="flex items-center rounded-lg px-4 py-3 text-sm
                       text-slate-300 hover:bg-slate-800 hover:text-white"
            >
                Reports
            </a>
        </nav>
    </aside>

    {{-- Main content --}}
    <main class="min-w-0 flex-1">
        <header
            class="flex flex-col gap-4 border-b border-slate-200 bg-white
                   px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-xl font-bold text-slate-900">
                    @yield('page-title', 'Dashboard')
                </h1>

                <p class="text-sm text-slate-500">
                    Manage your Vendora marketplace
                </p>
            </div>

            <div class="flex items-center gap-4">
                <div class="text-right">
                    <p class="text-sm font-semibold text-slate-800">
                        {{ auth()->user()->name }}
                    </p>

                    <p class="text-xs capitalize text-slate-500">
                        {{ str_replace('_', ' ', auth()->user()->role) }}
                    </p>
                </div>

                <form
                    method="POST"
                    action="{{ route('logout') }}"
                >
                    @csrf

                    <button
                        type="submit"
                        class="rounded-lg border border-slate-300 px-4 py-2
                               text-sm font-medium text-slate-700
                               hover:bg-slate-100"
                    >
                        Logout
                    </button>
                </form>
            </div>
        </header>

        <section class="p-6">
            @if (session('success'))
                <div
                    class="mb-6 rounded-lg border border-green-200
                           bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                    {{ session('success') }}
                </div>
            @endif

            @yield('content')
        </section>
    </main>
</div>
</body>
</html>
