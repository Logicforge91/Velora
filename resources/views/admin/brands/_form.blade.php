<form
    method="POST"
    enctype="multipart/form-data"
    action="{{ $brand->exists
        ? route('admin.brands.update', $brand)
        : route('admin.brands.store') }}"
>
    @csrf

    @if ($brand->exists)
        @method('PUT')
    @endif

    <div
        class="overflow-hidden rounded-2xl border border-slate-200
               bg-white shadow-sm dark:border-white/10
               dark:bg-white/5"
    >
        <div
            class="border-b border-slate-200 px-6 py-5
                   dark:border-white/10"
        >
            <h2
                class="text-lg font-bold text-slate-950
                       dark:text-white"
            >
                Brand Information
            </h2>

            <p
                class="mt-1 text-sm text-slate-500
                       dark:text-slate-400"
            >
                Enter the brand identity and display settings.
            </p>
        </div>

        <div class="grid gap-6 p-6 md:grid-cols-2">
            {{-- Name --}}
            <div>
                <label
                    for="name"
                    class="mb-2 block text-sm font-semibold
                           text-slate-700 dark:text-slate-300"
                >
                    Brand name
                    <span class="text-red-500">*</span>
                </label>

                <input
                    id="name"
                    type="text"
                    name="name"
                    value="{{ old('name', $brand->name) }}"
                    required
                    maxlength="150"
                    class="w-full rounded-xl border border-slate-300
                           bg-white px-4 py-3 text-slate-950
                           outline-none focus:border-indigo-500
                           focus:ring-2 focus:ring-indigo-500/20
                           dark:border-white/10 dark:bg-slate-900
                           dark:text-white"
                >

                @error('name')
                    <p class="mt-1 text-sm text-red-500">
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- Slug --}}
            <div>
                <label
                    for="slug"
                    class="mb-2 block text-sm font-semibold
                           text-slate-700 dark:text-slate-300"
                >
                    Slug
                </label>

                <input
                    id="slug"
                    type="text"
                    name="slug"
                    value="{{ old('slug', $brand->slug) }}"
                    maxlength="180"
                    placeholder="Generated automatically"
                    class="w-full rounded-xl border border-slate-300
                           bg-white px-4 py-3 text-slate-950
                           outline-none focus:border-indigo-500
                           focus:ring-2 focus:ring-indigo-500/20
                           dark:border-white/10 dark:bg-slate-900
                           dark:text-white"
                >

                @error('slug')
                    <p class="mt-1 text-sm text-red-500">
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- Website --}}
            <div>
                <label
                    for="website_url"
                    class="mb-2 block text-sm font-semibold
                           text-slate-700 dark:text-slate-300"
                >
                    Website URL
                </label>

                <input
                    id="website_url"
                    type="url"
                    name="website_url"
                    value="{{ old(
                        'website_url',
                        $brand->website_url
                    ) }}"
                    placeholder="https://example.com"
                    class="w-full rounded-xl border border-slate-300
                           bg-white px-4 py-3 text-slate-950
                           outline-none focus:border-indigo-500
                           focus:ring-2 focus:ring-indigo-500/20
                           dark:border-white/10 dark:bg-slate-900
                           dark:text-white"
                >

                @error('website_url')
                    <p class="mt-1 text-sm text-red-500">
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- Sort order --}}
            <div>
                <label
                    for="sort_order"
                    class="mb-2 block text-sm font-semibold
                           text-slate-700 dark:text-slate-300"
                >
                    Sort order
                </label>

                <input
                    id="sort_order"
                    type="number"
                    name="sort_order"
                    min="0"
                    max="99999"
                    value="{{ old(
                        'sort_order',
                        $brand->sort_order ?? 0
                    ) }}"
                    class="w-full rounded-xl border border-slate-300
                           bg-white px-4 py-3 text-slate-950
                           outline-none focus:border-indigo-500
                           focus:ring-2 focus:ring-indigo-500/20
                           dark:border-white/10 dark:bg-slate-900
                           dark:text-white"
                >

                @error('sort_order')
                    <p class="mt-1 text-sm text-red-500">
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- Description --}}
            <div class="md:col-span-2">
                <label
                    for="description"
                    class="mb-2 block text-sm font-semibold
                           text-slate-700 dark:text-slate-300"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    name="description"
                    rows="5"
                    maxlength="3000"
                    class="w-full rounded-xl border border-slate-300
                           bg-white px-4 py-3 text-slate-950
                           outline-none focus:border-indigo-500
                           focus:ring-2 focus:ring-indigo-500/20
                           dark:border-white/10 dark:bg-slate-900
                           dark:text-white"
                >{{ old(
                    'description',
                    $brand->description
                ) }}</textarea>

                @error('description')
                    <p class="mt-1 text-sm text-red-500">
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- Logo --}}
            <div class="md:col-span-2">
                <label
                    for="logo"
                    class="mb-2 block text-sm font-semibold
                           text-slate-700 dark:text-slate-300"
                >
                    Brand logo
                </label>

                @if ($brand->logo_url)
                    <div class="mb-4">
                        <img
                            src="{{ $brand->logo_url }}"
                            alt="{{ $brand->name }}"
                            class="h-28 w-40 rounded-xl border
                                   border-slate-200 bg-white
                                   object-contain p-3
                                   dark:border-white/10"
                        >
                    </div>
                @endif

                <input
                    id="logo"
                    type="file"
                    name="logo"
                    accept=".jpg,.jpeg,.png,.webp,.svg"
                    class="block w-full rounded-xl border
                           border-slate-300 bg-white px-4 py-3
                           text-sm dark:border-white/10
                           dark:bg-slate-900"
                >

                <p
                    class="mt-2 text-xs text-slate-500
                           dark:text-slate-400"
                >
                    JPG, PNG, WebP or SVG. Maximum 2 MB.
                </p>

                @error('logo')
                    <p class="mt-1 text-sm text-red-500">
                        {{ $message }}
                    </p>
                @enderror

                @if ($brand->exists)
                    <input
                        type="hidden"
                        name="remove_logo"
                        value="0"
                    >

                    @if ($brand->logo)
                        <label
                            class="mt-4 flex items-center gap-2"
                        >
                            <input
                                type="checkbox"
                                name="remove_logo"
                                value="1"
                                @checked(old('remove_logo'))
                                class="rounded border-slate-300"
                            >

                            <span class="text-sm text-red-500">
                                Remove current logo
                            </span>
                        </label>
                    @endif
                @endif
            </div>

            {{-- Featured --}}
            <div>
                <input
                    type="hidden"
                    name="is_featured"
                    value="0"
                >

                <label
                    class="flex items-start gap-3 rounded-xl
                           border border-slate-200 p-4
                           dark:border-white/10"
                >
                    <input
                        type="checkbox"
                        name="is_featured"
                        value="1"
                        @checked(
                            (bool) old(
                                'is_featured',
                                $brand->is_featured
                            )
                        )
                        class="mt-1 rounded border-slate-300"
                    >

                    <span>
                        <span
                            class="block text-sm font-semibold
                                   text-slate-800 dark:text-white"
                        >
                            Featured brand
                        </span>

                        <span
                            class="block text-xs text-slate-500
                                   dark:text-slate-400"
                        >
                            Show this brand in featured sections.
                        </span>
                    </span>
                </label>
            </div>

            {{-- Status --}}
            <div>
                <input
                    type="hidden"
                    name="status"
                    value="0"
                >

                <label
                    class="flex items-start gap-3 rounded-xl
                           border border-slate-200 p-4
                           dark:border-white/10"
                >
                    <input
                        type="checkbox"
                        name="status"
                        value="1"
                        @checked(
                            (bool) old(
                                'status',
                                $brand->exists
                                    ? $brand->status
                                    : true
                            )
                        )
                        class="mt-1 rounded border-slate-300"
                    >

                    <span>
                        <span
                            class="block text-sm font-semibold
                                   text-slate-800 dark:text-white"
                        >
                            Active brand
                        </span>

                        <span
                            class="block text-xs text-slate-500
                                   dark:text-slate-400"
                        >
                            Customers can see products from this brand.
                        </span>
                    </span>
                </label>
            </div>
        </div>

        <div
            class="flex items-center justify-end gap-3
                   border-t border-slate-200 px-6 py-4
                   dark:border-white/10"
        >
            <a
                href="{{ route('admin.brands.index') }}"
                class="rounded-xl border border-slate-300
                       px-5 py-2.5 text-sm font-semibold
                       text-slate-700 hover:bg-slate-100
                       dark:border-white/10 dark:text-slate-300
                       dark:hover:bg-white/10"
            >
                Cancel
            </a>

            <button
                type="submit"
                class="rounded-xl bg-indigo-600 px-5 py-2.5
                       text-sm font-semibold text-white
                       hover:bg-indigo-700"
            >
                {{ $brand->exists
                    ? 'Update Brand'
                    : 'Create Brand' }}
            </button>
        </div>
    </div>
</form>
