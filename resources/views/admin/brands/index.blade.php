@extends('admin.layouts.app')

@section('title', 'Brand Management')
@section('page-title', 'Brand Management')
@section('breadcrumb', 'Brands')

@section('content')
    <div
        class="flex flex-col gap-4 sm:flex-row
               sm:items-center sm:justify-between"
    >
        <div>
            <h2
                class="text-lg font-bold text-slate-950
                       dark:text-white"
            >
                Product Brands
            </h2>

            <p
                class="text-sm text-slate-500
                       dark:text-slate-400"
            >
                Manage product manufacturers and brand identities.
            </p>
        </div>

        <a
            href="{{ route('admin.brands.create') }}"
            class="rounded-xl bg-indigo-600 px-5 py-2.5
                   text-center text-sm font-semibold text-white
                   hover:bg-indigo-700"
        >
            Add Brand
        </a>
    </div>

    <div
        class="mt-6 grid gap-4 sm:grid-cols-2
               xl:grid-cols-4"
    >
        <a
            href="{{ route('admin.brands.index') }}"
            class="rounded-2xl border border-slate-200 bg-white
                   p-5 shadow-sm dark:border-white/10
                   dark:bg-white/5"
        >
            <p class="text-sm text-slate-500">
                All Brands
            </p>

            <p
                class="mt-2 text-3xl font-bold text-slate-950
                       dark:text-white"
            >
                {{ number_format($counts['all']) }}
            </p>
        </a>

        <a
            href="{{ route(
                'admin.brands.index',
                ['status' => 'active']
            ) }}"
            class="rounded-2xl border border-slate-200 bg-white
                   p-5 shadow-sm dark:border-white/10
                   dark:bg-white/5"
        >
            <p class="text-sm text-emerald-600">
                Active
            </p>

            <p
                class="mt-2 text-3xl font-bold text-slate-950
                       dark:text-white"
            >
                {{ number_format($counts['active']) }}
            </p>
        </a>

        <a
            href="{{ route(
                'admin.brands.index',
                ['status' => 'inactive']
            ) }}"
            class="rounded-2xl border border-slate-200 bg-white
                   p-5 shadow-sm dark:border-white/10
                   dark:bg-white/5"
        >
            <p class="text-sm text-red-500">
                Inactive
            </p>

            <p
                class="mt-2 text-3xl font-bold text-slate-950
                       dark:text-white"
            >
                {{ number_format($counts['inactive']) }}
            </p>
        </a>

        <a
            href="{{ route(
                'admin.brands.index',
                ['featured' => 'yes']
            ) }}"
            class="rounded-2xl border border-slate-200 bg-white
                   p-5 shadow-sm dark:border-white/10
                   dark:bg-white/5"
        >
            <p class="text-sm text-amber-500">
                Featured
            </p>

            <p
                class="mt-2 text-3xl font-bold text-slate-950
                       dark:text-white"
            >
                {{ number_format($counts['featured']) }}
            </p>
        </a>
    </div>

    <div
        class="mt-6 overflow-hidden rounded-2xl
               border border-slate-200 bg-white shadow-sm
               dark:border-white/10 dark:bg-white/5"
    >
        <div
            class="border-b border-slate-200 p-5
                   dark:border-white/10"
        >
            <form
                method="GET"
                action="{{ route('admin.brands.index') }}"
                class="grid gap-4 lg:grid-cols-5"
            >
                <div class="lg:col-span-2">
                    <label
                        for="search"
                        class="mb-1 block text-sm font-semibold
                               text-slate-700 dark:text-slate-300"
                    >
                        Search
                    </label>

                    <input
                        id="search"
                        type="search"
                        name="search"
                        value="{{ request('search') }}"
                        placeholder="Brand name, slug or website"
                        class="w-full rounded-xl border
                               border-slate-300 bg-white
                               px-4 py-2.5 text-sm outline-none
                               focus:border-indigo-500
                               dark:border-white/10
                               dark:bg-slate-900 dark:text-white"
                    >
                </div>

                <div>
                    <label
                        for="status"
                        class="mb-1 block text-sm font-semibold
                               text-slate-700 dark:text-slate-300"
                    >
                        Status
                    </label>

                    <select
                        id="status"
                        name="status"
                        class="w-full rounded-xl border
                               border-slate-300 bg-white
                               px-4 py-2.5 text-sm
                               dark:border-white/10
                               dark:bg-slate-900 dark:text-white"
                    >
                        <option value="">All statuses</option>

                        <option
                            value="active"
                            @selected(request('status') === 'active')
                        >
                            Active
                        </option>

                        <option
                            value="inactive"
                            @selected(request('status') === 'inactive')
                        >
                            Inactive
                        </option>
                    </select>
                </div>

                <div>
                    <label
                        for="featured"
                        class="mb-1 block text-sm font-semibold
                               text-slate-700 dark:text-slate-300"
                    >
                        Featured
                    </label>

                    <select
                        id="featured"
                        name="featured"
                        class="w-full rounded-xl border
                               border-slate-300 bg-white
                               px-4 py-2.5 text-sm
                               dark:border-white/10
                               dark:bg-slate-900 dark:text-white"
                    >
                        <option value="">All brands</option>

                        <option
                            value="yes"
                            @selected(request('featured') === 'yes')
                        >
                            Featured
                        </option>

                        <option
                            value="no"
                            @selected(request('featured') === 'no')
                        >
                            Not featured
                        </option>
                    </select>
                </div>

                <div class="flex items-end gap-2">
                    <button
                        type="submit"
                        class="rounded-xl bg-indigo-600
                               px-5 py-2.5 text-sm font-semibold
                               text-white hover:bg-indigo-700"
                    >
                        Filter
                    </button>

                    <a
                        href="{{ route('admin.brands.index') }}"
                        class="rounded-xl border border-slate-300
                               px-5 py-2.5 text-sm font-semibold
                               text-slate-700 hover:bg-slate-100
                               dark:border-white/10
                               dark:text-slate-300
                               dark:hover:bg-white/10"
                    >
                        Reset
                    </a>
                </div>
            </form>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200
                          dark:divide-white/10">
                <thead
                    class="bg-slate-50 dark:bg-white/5"
                >
                <tr>
                    <th
                        class="px-6 py-3 text-left text-xs
                               font-bold uppercase tracking-wider
                               text-slate-500"
                    >
                        Brand
                    </th>

                    <th
                        class="px-6 py-3 text-left text-xs
                               font-bold uppercase tracking-wider
                               text-slate-500"
                    >
                        Website
                    </th>

                    <th
                        class="px-6 py-3 text-left text-xs
                               font-bold uppercase tracking-wider
                               text-slate-500"
                    >
                        Featured
                    </th>

                    <th
                        class="px-6 py-3 text-left text-xs
                               font-bold uppercase tracking-wider
                               text-slate-500"
                    >
                        Order
                    </th>

                    <th
                        class="px-6 py-3 text-left text-xs
                               font-bold uppercase tracking-wider
                               text-slate-500"
                    >
                        Status
                    </th>

                    <th
                        class="px-6 py-3 text-right text-xs
                               font-bold uppercase tracking-wider
                               text-slate-500"
                    >
                        Actions
                    </th>
                </tr>
                </thead>

                <tbody
                    class="divide-y divide-slate-100
                           dark:divide-white/10"
                >
                @forelse ($brands as $brand)
                    <tr>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                @if ($brand->logo_url)
                                    <img
                                        src="{{ $brand->logo_url }}"
                                        alt="{{ $brand->name }}"
                                        class="h-12 w-16 rounded-lg
                                               border border-slate-200
                                               bg-white object-contain
                                               p-1 dark:border-white/10"
                                    >
                                @else
                                    <div
                                        class="grid h-12 w-16
                                               place-items-center
                                               rounded-lg bg-slate-100
                                               font-bold text-slate-500
                                               dark:bg-white/10"
                                    >
                                        {{ strtoupper(
                                            substr($brand->name, 0, 1)
                                        ) }}
                                    </div>
                                @endif

                                <div>
                                    <p
                                        class="font-semibold
                                               text-slate-950
                                               dark:text-white"
                                    >
                                        {{ $brand->name }}
                                    </p>

                                    <p class="text-sm text-slate-500">
                                        {{ $brand->slug }}
                                    </p>
                                </div>
                            </div>
                        </td>

                        <td class="px-6 py-4 text-sm">
                            @if ($brand->website_url)
                                <a
                                    href="{{ $brand->website_url }}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-indigo-600
                                           hover:underline"
                                >
                                    Visit website
                                </a>
                            @else
                                <span class="text-slate-400">
                                    Not provided
                                </span>
                            @endif
                        </td>

                        <td class="px-6 py-4">
                            @if ($brand->is_featured)
                                <span
                                    class="rounded-full bg-amber-100
                                           px-3 py-1 text-xs
                                           font-semibold text-amber-700
                                           dark:bg-amber-500/10
                                           dark:text-amber-300"
                                >
                                    Featured
                                </span>
                            @else
                                <span class="text-sm text-slate-400">
                                    No
                                </span>
                            @endif
                        </td>

                        <td
                            class="px-6 py-4 text-sm text-slate-600
                                   dark:text-slate-300"
                        >
                            {{ $brand->sort_order }}
                        </td>

                        <td class="px-6 py-4">
                            @if ($brand->status)
                                <span
                                    class="rounded-full bg-emerald-100
                                           px-3 py-1 text-xs
                                           font-semibold
                                           text-emerald-700
                                           dark:bg-emerald-500/10
                                           dark:text-emerald-300"
                                >
                                    Active
                                </span>
                            @else
                                <span
                                    class="rounded-full bg-red-100
                                           px-3 py-1 text-xs
                                           font-semibold text-red-700
                                           dark:bg-red-500/10
                                           dark:text-red-300"
                                >
                                    Inactive
                                </span>
                            @endif
                        </td>

                        <td class="px-6 py-4">
                            <div class="flex justify-end gap-3">
                                <a
                                    href="{{ route(
                                        'admin.brands.edit',
                                        $brand
                                    ) }}"
                                    class="text-sm font-semibold
                                           text-indigo-600
                                           hover:text-indigo-700"
                                >
                                    Edit
                                </a>

                                <form
                                    method="POST"
                                    action="{{ route(
                                        'admin.brands.destroy',
                                        $brand
                                    ) }}"
                                    onsubmit="return confirm(
                                        'Delete this brand?'
                                    )"
                                >
                                    @csrf
                                    @method('DELETE')

                                    <button
                                        type="submit"
                                        class="text-sm font-semibold
                                               text-red-500
                                               hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td
                            colspan="6"
                            class="px-6 py-12 text-center
                                   text-sm text-slate-500"
                        >
                            No brands found.
                        </td>
                    </tr>
                @endforelse
                </tbody>
            </table>
        </div>

        @if ($brands->hasPages())
            <div
                class="border-t border-slate-200 px-6 py-4
                       dark:border-white/10"
            >
                {{ $brands->links() }}
            </div>
        @endif
    </div>
@endsection
