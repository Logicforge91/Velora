@extends('admin.layouts.app')

@section('title', 'Vendor Management')
@section('page-title', 'Vendor Management')

@section('content')
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <a
            href="{{ route('admin.vendors.index') }}"
            class="rounded-xl bg-white p-5 shadow-sm"
        >
            <p class="text-sm font-medium text-slate-500">
                All Applications
            </p>

            <p class="mt-2 text-3xl font-bold text-slate-900">
                {{ number_format($counts['all']) }}
            </p>
        </a>

        <a
            href="{{ route('admin.vendors.index', ['status' => 'pending']) }}"
            class="rounded-xl bg-white p-5 shadow-sm"
        >
            <p class="text-sm font-medium text-amber-600">
                Pending
            </p>

            <p class="mt-2 text-3xl font-bold text-slate-900">
                {{ number_format($counts['pending']) }}
            </p>
        </a>

        <a
            href="{{ route('admin.vendors.index', ['status' => 'approved']) }}"
            class="rounded-xl bg-white p-5 shadow-sm"
        >
            <p class="text-sm font-medium text-green-600">
                Approved
            </p>

            <p class="mt-2 text-3xl font-bold text-slate-900">
                {{ number_format($counts['approved']) }}
            </p>
        </a>

        <a
            href="{{ route('admin.vendors.index', ['status' => 'rejected']) }}"
            class="rounded-xl bg-white p-5 shadow-sm"
        >
            <p class="text-sm font-medium text-red-600">
                Rejected
            </p>

            <p class="mt-2 text-3xl font-bold text-slate-900">
                {{ number_format($counts['rejected']) }}
            </p>
        </a>
    </div>

    <div class="mt-6 rounded-xl bg-white shadow-sm">
        <div class="border-b border-slate-200 p-5">
            <form
                method="GET"
                action="{{ route('admin.vendors.index') }}"
                class="grid gap-4 md:grid-cols-4"
            >
                <div class="md:col-span-2">
                    <label
                        for="search"
                        class="mb-1 block text-sm font-medium text-slate-700"
                    >
                        Search vendor
                    </label>

                    <input
                        id="search"
                        type="search"
                        name="search"
                        value="{{ request('search') }}"
                        placeholder="Business, email, phone or tax number"
                        class="w-full rounded-lg border border-slate-300
                               px-4 py-2.5 text-sm outline-none
                               focus:border-indigo-500"
                    >
                </div>

                <div>
                    <label
                        for="status"
                        class="mb-1 block text-sm font-medium text-slate-700"
                    >
                        Status
                    </label>

                    <select
                        id="status"
                        name="status"
                        class="w-full rounded-lg border border-slate-300
                               px-4 py-2.5 text-sm outline-none
                               focus:border-indigo-500"
                    >
                        <option value="">All statuses</option>

                        <option
                            value="pending"
                            @selected(request('status') === 'pending')
                        >
                            Pending
                        </option>

                        <option
                            value="approved"
                            @selected(request('status') === 'approved')
                        >
                            Approved
                        </option>

                        <option
                            value="rejected"
                            @selected(request('status') === 'rejected')
                        >
                            Rejected
                        </option>
                    </select>
                </div>

                <div class="flex items-end gap-2">
                    <button
                        type="submit"
                        class="rounded-lg bg-indigo-600 px-5 py-2.5
                               text-sm font-semibold text-white
                               hover:bg-indigo-700"
                    >
                        Filter
                    </button>

                    <a
                        href="{{ route('admin.vendors.index') }}"
                        class="rounded-lg border border-slate-300
                               px-5 py-2.5 text-sm font-semibold
                               text-slate-700 hover:bg-slate-100"
                    >
                        Reset
                    </a>
                </div>
            </form>
        </div>

        @if ($errors->has('vendor'))
            <div class="m-5 rounded-lg border border-red-200 bg-red-50
                        px-4 py-3 text-sm text-red-700">
                {{ $errors->first('vendor') }}
            </div>
        @endif

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-semibold
                               uppercase tracking-wider text-slate-500">
                        Business
                    </th>

                    <th class="px-6 py-3 text-left text-xs font-semibold
                               uppercase tracking-wider text-slate-500">
                        Owner
                    </th>

                    <th class="px-6 py-3 text-left text-xs font-semibold
                               uppercase tracking-wider text-slate-500">
                        Phone
                    </th>

                    <th class="px-6 py-3 text-left text-xs font-semibold
                               uppercase tracking-wider text-slate-500">
                        Status
                    </th>

                    <th class="px-6 py-3 text-left text-xs font-semibold
                               uppercase tracking-wider text-slate-500">
                        Applied
                    </th>

                    <th class="px-6 py-3 text-right text-xs font-semibold
                               uppercase tracking-wider text-slate-500">
                        Action
                    </th>
                </tr>
                </thead>

                <tbody class="divide-y divide-slate-100 bg-white">
                @forelse ($vendors as $vendor)
                    <tr>
                        <td class="px-6 py-4">
                            <p class="font-semibold text-slate-900">
                                {{ $vendor->business_name }}
                            </p>

                            <p class="text-sm text-slate-500">
                                {{ $vendor->business_email }}
                            </p>
                        </td>

                        <td class="px-6 py-4">
                            <p class="text-sm font-medium text-slate-900">
                                {{ $vendor->user->name }}
                            </p>

                            <p class="text-sm text-slate-500">
                                {{ $vendor->user->email }}
                            </p>
                        </td>

                        <td class="whitespace-nowrap px-6 py-4
                                   text-sm text-slate-600">
                            {{ $vendor->business_phone }}
                        </td>

                        <td class="whitespace-nowrap px-6 py-4">
                            @switch($vendor->status)
                                @case('approved')
                                    <span class="rounded-full bg-green-50
                                                 px-3 py-1 text-xs font-semibold
                                                 text-green-700">
                                        Approved
                                    </span>
                                    @break

                                @case('rejected')
                                    <span class="rounded-full bg-red-50
                                                 px-3 py-1 text-xs font-semibold
                                                 text-red-700">
                                        Rejected
                                    </span>
                                    @break

                                @default
                                    <span class="rounded-full bg-amber-50
                                                 px-3 py-1 text-xs font-semibold
                                                 text-amber-700">
                                        Pending
                                    </span>
                            @endswitch
                        </td>

                        <td class="whitespace-nowrap px-6 py-4
                                   text-sm text-slate-500">
                            {{ $vendor->created_at->format('d M Y') }}
                        </td>

                        <td class="whitespace-nowrap px-6 py-4 text-right">
                            <a
                                href="{{ route('admin.vendors.show', $vendor) }}"
                                class="text-sm font-semibold text-indigo-600
                                       hover:text-indigo-800"
                            >
                                Review
                            </a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td
                            colspan="6"
                            class="px-6 py-12 text-center text-sm
                                   text-slate-500"
                        >
                            No vendor applications found.
                        </td>
                    </tr>
                @endforelse
                </tbody>
            </table>
        </div>

        @if ($vendors->hasPages())
            <div class="border-t border-slate-200 px-6 py-4">
                {{ $vendors->links() }}
            </div>
        @endif
    </div>
@endsection
