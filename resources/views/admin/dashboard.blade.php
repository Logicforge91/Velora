@extends('admin.layouts.app')

@section('title', 'Admin Dashboard')
@section('page-title', 'Dashboard Overview')

@section('content')
    @php
        $totalUsers = max($statistics['total_users'], 1);
        $roleDistribution = [
            ['label' => 'Customers', 'value' => $statistics['total_customers'], 'color' => 'bg-indigo-500'],
            ['label' => 'Vendors', 'value' => $statistics['total_vendors'], 'color' => 'bg-violet-500'],
            ['label' => 'Delivery agents', 'value' => $statistics['total_delivery_agents'], 'color' => 'bg-cyan-500'],
            ['label' => 'Support agents', 'value' => $statistics['total_support_agents'], 'color' => 'bg-amber-500'],
            ['label' => 'Administrators', 'value' => $statistics['total_admins'], 'color' => 'bg-emerald-500'],
        ];
    @endphp

    <section class="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8 sm:py-9">
        <div class="absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-indigo-500/30 blur-3xl"></div>
        <div class="absolute -bottom-32 right-1/3 -z-10 size-64 rounded-full bg-cyan-400/20 blur-3xl"></div>
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
                <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100 backdrop-blur">
                    <span class="size-1.5 rounded-full bg-cyan-300"></span>
                    Live marketplace overview
                </div>
                <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
                    Welcome back, {{ explode(' ', auth()->user()->name)[0] }}.
                </h2>
                <p class="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                    Your platform is healthy. Monitor account growth, activation, and the newest members from one focused workspace.
                </p>
            </div>

            <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <span class="grid size-10 place-items-center rounded-xl bg-white/10 text-cyan-300">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 2v3m8-3v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"/></svg>
                </span>
                <div>
                    <p class="text-xs text-slate-400">Reporting period</p>
                    <p class="text-sm font-semibold">Last 30 days · {{ now()->format('d M Y') }}</p>
                </div>
            </div>
        </div>
    </section>

    <section class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key performance indicators">
        <article class="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total users</p>
                    <p class="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{{ number_format($statistics['total_users']) }}</p>
                </div>
                <span class="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </span>
            </div>
            <p class="mt-4 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span class="font-bold text-emerald-600 dark:text-emerald-400">+{{ number_format($statistics['new_users_30_days']) }}</span>
                joined in 30 days
            </p>
        </article>

        <article class="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Active accounts</p>
                    <p class="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{{ number_format($statistics['active_users']) }}</p>
                </div>
                <span class="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>
                </span>
            </div>
            <p class="mt-4 text-xs text-slate-500 dark:text-slate-400"><span class="font-bold text-emerald-600 dark:text-emerald-400">{{ $statistics['active_rate'] }}%</span> platform activation rate</p>
        </article>

        <article class="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Marketplace vendors</p>
                    <p class="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{{ number_format($statistics['total_vendors']) }}</p>
                </div>
                <span class="grid size-11 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 9l2-6h14l2 6M5 13v8h14v-8M9 21v-6h6v6M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></svg>
                </span>
            </div>
            <p class="mt-4 text-xs text-slate-500 dark:text-slate-400">Registered seller accounts</p>
        </article>

        <article class="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Needs attention</p>
                    <p class="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{{ number_format($statistics['inactive_users']) }}</p>
                </div>
                <span class="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/></svg>
                </span>
            </div>
            <p class="mt-4 text-xs text-slate-500 dark:text-slate-400">Currently disabled accounts</p>
        </article>
    </section>

    <section class="mt-6 grid gap-6 xl:grid-cols-3">
        <article class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 xl:col-span-2">
            <div class="flex flex-col gap-3 border-b border-slate-200/80 px-5 py-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                    <h3 class="font-bold tracking-tight text-slate-950 dark:text-white">Recent registrations</h3>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">The newest people joining your marketplace</p>
                </div>
                <span class="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">Latest {{ $recentUsers->count() }}</span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[680px] text-left">
                    <thead>
                        <tr class="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                            <th scope="col" class="px-6 py-3.5">User</th>
                            <th scope="col" class="px-5 py-3.5">Role</th>
                            <th scope="col" class="px-5 py-3.5">Status</th>
                            <th scope="col" class="px-6 py-3.5 text-right">Joined</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                        @forelse ($recentUsers as $user)
                            <tr class="transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <span class="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold text-slate-700 ring-2 ring-white dark:from-slate-700 dark:to-slate-800 dark:text-slate-200 dark:ring-slate-900">{{ strtoupper(substr($user->name, 0, 1)) }}</span>
                                        <div class="min-w-0">
                                            <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">{{ $user->name }}</p>
                                            <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ $user->email }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-5 py-4">
                                    <span class="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold capitalize text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">{{ str_replace('_', ' ', $user->role) }}</span>
                                </td>
                                <td class="px-5 py-4">
                                    <span class="inline-flex items-center gap-1.5 text-xs font-semibold {{ $user->status ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400' }}">
                                        <span class="size-1.5 rounded-full {{ $user->status ? 'bg-emerald-500' : 'bg-rose-500' }}"></span>
                                        {{ $user->status ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400">{{ $user->created_at->format('d M Y') }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="px-6 py-16 text-center">
                                    <span class="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/5">
                                        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/></svg>
                                    </span>
                                    <p class="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">No users yet</p>
                                    <p class="mt-1 text-xs text-slate-500">New registrations will appear here.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </article>

        <article class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h3 class="font-bold tracking-tight text-slate-950 dark:text-white">User mix</h3>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Accounts by platform role</p>
                </div>
                <span class="rounded-xl bg-slate-100 p-2.5 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></svg>
                </span>
            </div>

            <div class="mt-7 grid gap-5">
                @foreach ($roleDistribution as $role)
                    @php($percentage = (int) round(($role['value'] / $totalUsers) * 100))
                    <div>
                        <div class="mb-2 flex items-center justify-between gap-4 text-sm">
                            <span class="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                                <span class="size-2 rounded-full {{ $role['color'] }}"></span>
                                {{ $role['label'] }}
                            </span>
                            <span class="font-bold tabular-nums text-slate-950 dark:text-white">{{ number_format($role['value']) }} <span class="ml-1 text-xs font-medium text-slate-400">{{ $percentage }}%</span></span>
                        </div>
                        <div class="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10" role="progressbar" aria-label="{{ $role['label'] }}" aria-valuenow="{{ $percentage }}" aria-valuemin="0" aria-valuemax="100">
                            <div class="h-full rounded-full {{ $role['color'] }}" style="width: {{ $percentage }}%"></div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="mt-7 rounded-2xl border border-emerald-200/70 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Account health</p>
                        <p class="mt-1 text-2xl font-bold text-emerald-950 dark:text-emerald-100">{{ $statistics['active_rate'] }}%</p>
                    </div>
                    <span class="grid size-11 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>
                    </span>
                </div>
                <p class="mt-2 text-xs leading-5 text-emerald-800/80 dark:text-emerald-300/80">Share of registered accounts currently enabled on the platform.</p>
            </div>
        </article>
    </section>
@endsection
