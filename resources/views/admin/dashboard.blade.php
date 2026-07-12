@extends('admin.layouts.app')

@section('title', 'Admin Dashboard')
@section('page-title', 'Dashboard Overview')

@section('content')
    <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {{-- Total users --}}
        <div class="rounded-xl bg-white p-6 shadow-sm">
            <p class="text-sm font-medium text-slate-500">
                Total Users
            </p>

            <p class="mt-3 text-3xl font-bold text-slate-900">
                {{ number_format($statistics['total_users']) }}
            </p>

            <p class="mt-2 text-xs text-slate-500">
                All registered accounts
            </p>
        </div>

        {{-- Vendors --}}
        <div class="rounded-xl bg-white p-6 shadow-sm">
            <p class="text-sm font-medium text-slate-500">
                Vendors
            </p>

            <p class="mt-3 text-3xl font-bold text-slate-900">
                {{ number_format($statistics['total_vendors']) }}
            </p>

            <p class="mt-2 text-xs text-slate-500">
                Registered marketplace sellers
            </p>
        </div>

        {{-- Customers --}}
        <div class="rounded-xl bg-white p-6 shadow-sm">
            <p class="text-sm font-medium text-slate-500">
                Customers
            </p>

            <p class="mt-3 text-3xl font-bold text-slate-900">
                {{ number_format($statistics['total_customers']) }}
            </p>

            <p class="mt-2 text-xs text-slate-500">
                Registered customers
            </p>
        </div>

        {{-- Active users --}}
        <div class="rounded-xl bg-white p-6 shadow-sm">
            <p class="text-sm font-medium text-slate-500">
                Active Users
            </p>

            <p class="mt-3 text-3xl font-bold text-slate-900">
                {{ number_format($statistics['active_users']) }}
            </p>

            <p class="mt-2 text-xs text-slate-500">
                Accounts currently enabled
            </p>
        </div>
    </div>

    <div class="mt-6 grid gap-6 xl:grid-cols-3">
        {{-- Recent users --}}
        <div class="overflow-hidden rounded-xl bg-white shadow-sm xl:col-span-2">
            <div
                class="flex items-center justify-between border-b
                       border-slate-200 px-6 py-4"
            >
                <div>
                    <h2 class="font-bold text-slate-900">
                        Recent Users
                    </h2>

                    <p class="text-sm text-slate-500">
                        Recently registered accounts
                    </p>
                </div>

                <a
                    href="#"
                    class="text-sm font-semibold text-indigo-600
                           hover:text-indigo-800"
                >
                    View all
                </a>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50">
                    <tr>
                        <th
                            class="px-6 py-3 text-left text-xs font-semibold
                                   uppercase tracking-wider text-slate-500"
                        >
                            User
                        </th>

                        <th
                            class="px-6 py-3 text-left text-xs font-semibold
                                   uppercase tracking-wider text-slate-500"
                        >
                            Role
                        </th>

                        <th
                            class="px-6 py-3 text-left text-xs font-semibold
                                   uppercase tracking-wider text-slate-500"
                        >
                            Status
                        </th>

                        <th
                            class="px-6 py-3 text-left text-xs font-semibold
                                   uppercase tracking-wider text-slate-500"
                        >
                            Joined
                        </th>
                    </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100 bg-white">
                    @forelse ($recentUsers as $user)
                        <tr>
                            <td class="whitespace-nowrap px-6 py-4">
                                <p class="text-sm font-semibold text-slate-900">
                                    {{ $user->name }}
                                </p>

                                <p class="text-sm text-slate-500">
                                    {{ $user->email }}
                                </p>
                            </td>

                            <td class="whitespace-nowrap px-6 py-4">
                                <span
                                    class="rounded-full bg-indigo-50 px-3 py-1
                                           text-xs font-semibold capitalize
                                           text-indigo-700"
                                >
                                    {{ str_replace('_', ' ', $user->role) }}
                                </span>
                            </td>

                            <td class="whitespace-nowrap px-6 py-4">
                                @if ($user->status)
                                    <span
                                        class="rounded-full bg-green-50 px-3 py-1
                                               text-xs font-semibold text-green-700"
                                    >
                                        Active
                                    </span>
                                @else
                                    <span
                                        class="rounded-full bg-red-50 px-3 py-1
                                               text-xs font-semibold text-red-700"
                                    >
                                        Inactive
                                    </span>
                                @endif
                            </td>

                            <td
                                class="whitespace-nowrap px-6 py-4
                                       text-sm text-slate-500"
                            >
                                {{ $user->created_at->format('d M Y') }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td
                                colspan="4"
                                class="px-6 py-10 text-center text-sm
                                       text-slate-500"
                            >
                                No users found.
                            </td>
                        </tr>
                    @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        {{-- Account summary --}}
        <div class="rounded-xl bg-white p-6 shadow-sm">
            <h2 class="font-bold text-slate-900">
                Account Summary
            </h2>

            <p class="mt-1 text-sm text-slate-500">
                Current platform account status
            </p>

            <div class="mt-6 space-y-5">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-600">
                        Administrators
                    </span>

                    <span class="font-bold text-slate-900">
                        {{ number_format($statistics['total_admins']) }}
                    </span>
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-600">
                        Active accounts
                    </span>

                    <span class="font-bold text-green-700">
                        {{ number_format($statistics['active_users']) }}
                    </span>
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-600">
                        Disabled accounts
                    </span>

                    <span class="font-bold text-red-700">
                        {{ number_format($statistics['inactive_users']) }}
                    </span>
                </div>
            </div>

            <div class="mt-8 rounded-lg bg-slate-50 p-4">
                <p class="text-sm font-semibold text-slate-800">
                    Next module
                </p>

                <p class="mt-1 text-sm text-slate-600">
                    Add administrators, vendors, and customer management.
                </p>
            </div>
        </div>
    </div>
@endsection
