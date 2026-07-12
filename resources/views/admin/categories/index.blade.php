@extends('admin.layouts.app')

@section('title', 'Category Management')
@section('page-title', 'Category Management')

@section('content')
    <div class="flex flex-col gap-4 sm:flex-row
                sm:items-center sm:justify-between">
        <div>
            <h2 class="text-lg font-bold text-slate-900">
                Product Categories
            </h2>

            <p class="text-sm text-slate-500">
                Manage root categories and subcategories.
            </p>
        </div>

        <a
            href="{{ route('admin.categories.create') }}"
            class="rounded-lg bg-indigo-600 px-5 py-2.5
                   text-center text-sm font-semibold text-white
                   hover:bg-indigo-700"
        >
            Add Category
        </a>
    </div>

    <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <a
            href="{{ route('admin.categories.index') }}"
            class="rounded-xl bg-white p-5 shadow-sm"
        >
            <p class="text-sm text-slate-500">
                All Categories
            </p>

            <p class="mt-2 text-3xl font-bold text-slate-900">
                {{ number_format($counts['all']) }}
            </p>
        </a>

        <a
            href="{{ route(
                'admin.categories.index',
                ['status' => 'active']
            ) }}"
            class="rounded-xl bg-white p-5 shadow-sm"
        >
            <p class="text-sm text-green-600">
                Active
            </p>

            <p class="mt-2 text-3xl font-bold text-slate-900">
                {{ number_format($counts['active']) }}
            </p>
        </a>

        <a
            href="{{ route(
                'admin.categories.index',
                ['status' => 'inactive']
            ) }}"
            class="rounded-xl bg-white p-5 shadow-sm"
        >
            <p class="text-sm text-red-600">
                Inactive
            </p>

            <p class="mt-2 text-3xl font-bold text-slate-900">
                {{ number_format($counts['inactive']) }}
            </p>
        </a>

        <a
            href="{{ route(
                'admin.categories.index',
                ['parent' => 'root']
            ) }}"
            class="rounded-xl bg-white p-5 shadow-sm"
        >
            <p class="text-sm text-indigo-600">
                Root Categories
            </p>

            <p class="mt-2 text-3xl font-bold text-slate-900">
                {{ number_format($counts['root']) }}
            </p>
        </a>
    </div>

    <div class="mt-6 overflow-hidden rounded-xl
                bg-white shadow-sm">
        <div class="border-b border-slate-200 p-5">
            <form
                method="GET"
                action="{{ route('admin.categories.index') }}"
                class="grid gap-4 lg:grid-cols-5"
            >
                <div class="lg:col-span-2">
                    <label
                        for="search"
                        class="mb-1 block text-sm font-medium
                               text-slate-700"
                    >
                        Search
                    </label>

                    <input
                        id="search"
                        type="search"
                        name="search"
                        value="{{ request('search') }}"
                        placeholder="Category name or slug"
                        class="w-full rounded-lg border
                               border-slate-300 px-4 py-2.5
                               text-sm outline-none
                               focus:border-indigo-500"
                    >
                </div>

                <div>
                    <label
                        for="status"
                        class="mb-1 block text-sm font-medium
                               text-slate-700"
                    >
                        Status
                    </label>

                    <select
                        id="status"
                        name="status"
                        class="w-full rounded-lg border
                               border-slate-300 px-4 py-2.5
                               text-sm outline-none"
                    >
                        <option value="">
                            All statuses
                        </option>

                        <option
                            value="active"
                            @selected(
                                request('status') === 'active'
                            )
                        >
                            Active
                        </option>

                        <option
                            value="inactive"
                            @selected(
                                request('status') === 'inactive'
                            )
                        >
                            Inactive
                        </option>
                    </select>
                </div>

                <div>
                    <label
                        for="parent"
                        class="mb-1 block text-sm font-medium
                               text-slate-700"
                    >
                        Parent
                    </label>

                    <select
                        id="parent"
                        name="parent"
                        class="w-full rounded-lg border
                               border-slate-300 px-4 py-2.5
                               text-sm outline-none"
                    >
                        <option value="">
                            All categories
                        </option>

                        <option
                            value="root"
                            @selected(
                                request('parent') === 'root'
                            )
                        >
                            Root categories
                        </option>

                        @foreach ($parentOptions as $parent)
                            <option
                                value="{{ $parent->id }}"
                                @selected(
                                    (string) request('parent')
                                    === (string) $parent->id
                                )
                            >
                                Children of {{ $parent->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="flex items-end gap-2">
                    <button
                        type="submit"
                        class="rounded-lg bg-indigo-600
                               px-5 py-2.5 text-sm font-semibold
                               text-white hover:bg-indigo-700"
                    >
                        Filter
                    </button>

                    <a
                        href="{{ route('admin.categories.index') }}"
                        class="rounded-lg border border-slate-300
                               px-5 py-2.5 text-sm font-semibold
                               text-slate-700 hover:bg-slate-100"
                    >
                        Reset
                    </a>
                </div>
            </form>
        </div>

        @if ($errors->has('category'))
            <div class="m-5 rounded-lg border border-red-200
                        bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ $errors->first('category') }}
            </div>
        @endif

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs
                               font-semibold uppercase tracking-wider
                               text-slate-500">
                        Category
                    </th>

                    <th class="px-6 py-3 text-left text-xs
                               font-semibold uppercase tracking-wider
                               text-slate-500">
                        Parent
                    </th>

                    <th class="px-6 py-3 text-left text-xs
                               font-semibold uppercase tracking-wider
                               text-slate-500">
                        Children
                    </th>

                    <th class="px-6 py-3 text-left text-xs
                               font-semibold uppercase tracking-wider
                               text-slate-500">
                        Order
                    </th>

                    <th class="px-6 py-3 text-left text-xs
                               font-semibold uppercase tracking-wider
                               text-slate-500">
                        Status
                    </th>

                    <th class="px-6 py-3 text-right text-xs
                               font-semibold uppercase tracking-wider
                               text-slate-500">
                        Actions
                    </th>
                </tr>
                </thead>

                <tbody class="divide-y divide-slate-100 bg-white">
                @forelse ($categories as $category)
                    <tr>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                @if ($category->image_url)
                                    <img
                                        src="{{ $category->image_url }}"
                                        alt="{{ $category->name }}"
                                        class="h-11 w-11 rounded-lg
                                               object-cover"
                                    >
                                @else
                                    <div class="flex h-11 w-11
                                                items-center justify-center
                                                rounded-lg bg-slate-100
                                                text-sm font-bold
                                                text-slate-500">
                                        {{ strtoupper(
                                            substr($category->name, 0, 1)
                                        ) }}
                                    </div>
                                @endif

                                <div>
                                    <p class="font-semibold text-slate-900">
                                        {{ $category->name }}
                                    </p>

                                    <p class="text-sm text-slate-500">
                                        {{ $category->slug }}
                                    </p>
                                </div>
                            </div>
                        </td>

                        <td class="px-6 py-4 text-sm text-slate-600">
                            {{ $category->parent?->name ?? 'Root category' }}
                        </td>

                        <td class="px-6 py-4 text-sm text-slate-600">
                            {{ number_format(
                                $category->children_count
                            ) }}
                        </td>

                        <td class="px-6 py-4 text-sm text-slate-600">
                            {{ $category->sort_order }}
                        </td>

                        <td class="px-6 py-4">
                            @if ($category->status)
                                <span class="rounded-full bg-green-50
                                             px-3 py-1 text-xs font-semibold
                                             text-green-700">
                                    Active
                                </span>
                            @else
                                <span class="rounded-full bg-red-50
                                             px-3 py-1 text-xs font-semibold
                                             text-red-700">
                                    Inactive
                                </span>
                            @endif
                        </td>

                        <td class="px-6 py-4">
                            <div class="flex justify-end gap-3">
                                <a
                                    href="{{ route(
                                        'admin.categories.edit',
                                        $category
                                    ) }}"
                                    class="text-sm font-semibold
                                           text-indigo-600
                                           hover:text-indigo-800"
                                >
                                    Edit
                                </a>

                                <form
                                    method="POST"
                                    action="{{ route(
                                        'admin.categories.destroy',
                                        $category
                                    ) }}"
                                    onsubmit="return confirm(
                                        'Delete this category?'
                                    )"
                                >
                                    @csrf
                                    @method('DELETE')

                                    <button
                                        type="submit"
                                        class="text-sm font-semibold
                                               text-red-600
                                               hover:text-red-800"
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
                            No categories found.
                        </td>
                    </tr>
                @endforelse
                </tbody>
            </table>
        </div>

        @if ($categories->hasPages())
            <div class="border-t border-slate-200 px-6 py-4">
                {{ $categories->links() }}
            </div>
        @endif
    </div>
@endsection
