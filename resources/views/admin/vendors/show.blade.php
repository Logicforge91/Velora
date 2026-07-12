@extends('admin.layouts.app')

@section('title', 'Review Vendor')
@section('page-title', 'Review Vendor Application')

@section('content')
    <div class="mb-5">
        <a
            href="{{ route('admin.vendors.index') }}"
            class="text-sm font-semibold text-indigo-600
                   hover:text-indigo-800"
        >
            ← Back to vendors
        </a>
    </div>

    @if ($errors->has('vendor'))
        <div class="mb-5 rounded-lg border border-red-200 bg-red-50
                    px-4 py-3 text-sm text-red-700">
            {{ $errors->first('vendor') }}
        </div>
    @endif

    <div class="grid gap-6 xl:grid-cols-3">
        <div class="space-y-6 xl:col-span-2">
            <div class="rounded-xl bg-white shadow-sm">
                <div class="flex items-center justify-between
                            border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 class="text-lg font-bold text-slate-900">
                            {{ $vendor->business_name }}
                        </h2>

                        <p class="mt-1 text-sm text-slate-500">
                            Vendor application #{{ $vendor->id }}
                        </p>
                    </div>

                    @switch($vendor->status)
                        @case('approved')
                            <span class="rounded-full bg-green-50 px-4 py-2
                                         text-sm font-semibold text-green-700">
                                Approved
                            </span>
                            @break

                        @case('rejected')
                            <span class="rounded-full bg-red-50 px-4 py-2
                                         text-sm font-semibold text-red-700">
                                Rejected
                            </span>
                            @break

                        @default
                            <span class="rounded-full bg-amber-50 px-4 py-2
                                         text-sm font-semibold text-amber-700">
                                Pending Review
                            </span>
                    @endswitch
                </div>

                <div class="grid gap-6 p-6 sm:grid-cols-2">
                    <div>
                        <p class="text-xs font-semibold uppercase
                                  tracking-wide text-slate-500">
                            Business name
                        </p>

                        <p class="mt-1 font-medium text-slate-900">
                            {{ $vendor->business_name }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase
                                  tracking-wide text-slate-500">
                            Business email
                        </p>

                        <p class="mt-1 font-medium text-slate-900">
                            {{ $vendor->business_email }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase
                                  tracking-wide text-slate-500">
                            Business phone
                        </p>

                        <p class="mt-1 font-medium text-slate-900">
                            {{ $vendor->business_phone }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase
                                  tracking-wide text-slate-500">
                            Tax number
                        </p>

                        <p class="mt-1 font-medium text-slate-900">
                            {{ $vendor->tax_number ?: 'Not provided' }}
                        </p>
                    </div>

                    <div class="sm:col-span-2">
                        <p class="text-xs font-semibold uppercase
                                  tracking-wide text-slate-500">
                            Business address
                        </p>

                        <p class="mt-1 whitespace-pre-line
                                  text-slate-900">{{ $vendor->address }}</p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase
                                  tracking-wide text-slate-500">
                            Application date
                        </p>

                        <p class="mt-1 font-medium text-slate-900">
                            {{ $vendor->created_at->format('d M Y, h:i A') }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase
                                  tracking-wide text-slate-500">
                            Last updated
                        </p>

                        <p class="mt-1 font-medium text-slate-900">
                            {{ $vendor->updated_at->format('d M Y, h:i A') }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="rounded-xl bg-white shadow-sm">
                <div class="border-b border-slate-200 px-6 py-5">
                    <h2 class="text-lg font-bold text-slate-900">
                        Account Owner
                    </h2>
                </div>

                <div class="grid gap-6 p-6 sm:grid-cols-2">
                    <div>
                        <p class="text-xs font-semibold uppercase
                                  tracking-wide text-slate-500">
                            Name
                        </p>

                        <p class="mt-1 font-medium text-slate-900">
                            {{ $vendor->user->name }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase
                                  tracking-wide text-slate-500">
                            Email
                        </p>

                        <p class="mt-1 font-medium text-slate-900">
                            {{ $vendor->user->email }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase
                                  tracking-wide text-slate-500">
                            Current role
                        </p>

                        <p class="mt-1 font-medium capitalize text-slate-900">
                            {{ str_replace('_', ' ', $vendor->user->role) }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase
                                  tracking-wide text-slate-500">
                            Account status
                        </p>

                        <p class="mt-1 font-medium text-slate-900">
                            {{ $vendor->user->status ? 'Active' : 'Inactive' }}
                        </p>
                    </div>
                </div>
            </div>

            @if ($vendor->isRejected())
                <div class="rounded-xl border border-red-200
                            bg-red-50 p-6">
                    <h2 class="font-bold text-red-800">
                        Rejection Reason
                    </h2>

                    <p class="mt-2 whitespace-pre-line text-sm
                              text-red-700">{{ $vendor->rejection_reason }}</p>
                </div>
            @endif
        </div>

        <div class="space-y-6">
            @if ($vendor->isPending())
                <div class="rounded-xl bg-white p-6 shadow-sm">
                    <h2 class="text-lg font-bold text-slate-900">
                        Approve Vendor
                    </h2>

                    <p class="mt-2 text-sm text-slate-600">
                        The user will receive vendor access after approval.
                    </p>

                    <form
                        method="POST"
                        action="{{ route('admin.vendors.approve', $vendor) }}"
                        class="mt-5"
                        onsubmit="return confirm(
                            'Are you sure you want to approve this vendor?'
                        )"
                    >
                        @csrf
                        @method('PATCH')

                        <button
                            type="submit"
                            class="w-full rounded-lg bg-green-600
                                   px-5 py-3 text-sm font-semibold text-white
                                   hover:bg-green-700"
                        >
                            Approve Application
                        </button>
                    </form>
                </div>

                <div class="rounded-xl bg-white p-6 shadow-sm">
                    <h2 class="text-lg font-bold text-slate-900">
                        Reject Vendor
                    </h2>

                    <p class="mt-2 text-sm text-slate-600">
                        Enter a clear reason for rejecting the application.
                    </p>

                    <form
                        method="POST"
                        action="{{ route('admin.vendors.reject', $vendor) }}"
                        class="mt-5"
                    >
                        @csrf
                        @method('PATCH')

                        <label
                            for="rejection_reason"
                            class="mb-2 block text-sm font-medium
                                   text-slate-700"
                        >
                            Rejection reason
                        </label>

                        <textarea
                            id="rejection_reason"
                            name="rejection_reason"
                            rows="5"
                            required
                            placeholder="Explain why the application was rejected"
                            class="w-full rounded-lg border
                                   border-slate-300 px-4 py-3 text-sm
                                   outline-none focus:border-red-500"
                        >{{ old('rejection_reason') }}</textarea>

                        @error('rejection_reason')
                            <p class="mt-1 text-sm text-red-600">
                                {{ $message }}
                            </p>
                        @enderror

                        <button
                            type="submit"
                            class="mt-4 w-full rounded-lg bg-red-600
                                   px-5 py-3 text-sm font-semibold text-white
                                   hover:bg-red-700"
                        >
                            Reject Application
                        </button>
                    </form>
                </div>
            @else
                <div class="rounded-xl bg-white p-6 shadow-sm">
                    <h2 class="font-bold text-slate-900">
                        Review Information
                    </h2>

                    <div class="mt-4 space-y-4">
                        <div>
                            <p class="text-xs font-semibold uppercase
                                      text-slate-500">
                                Decision
                            </p>

                            <p class="mt-1 font-medium capitalize
                                      text-slate-900">
                                {{ $vendor->status }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs font-semibold uppercase
                                      text-slate-500">
                                Reviewed by
                            </p>

                            <p class="mt-1 font-medium text-slate-900">
                                {{ $vendor->approvedBy?->name ?? 'Unknown' }}
                            </p>
                        </div>

                        @if ($vendor->approved_at)
                            <div>
                                <p class="text-xs font-semibold uppercase
                                          text-slate-500">
                                    Reviewed at
                                </p>

                                <p class="mt-1 font-medium text-slate-900">
                                    {{ $vendor->approved_at->format(
                                        'd M Y, h:i A'
                                    ) }}
                                </p>
                            </div>
                        @endif
                    </div>
                </div>
            @endif
        </div>
    </div>
@endsection
