<form
    method="POST"
    enctype="multipart/form-data"
    action="{{ $category->exists
        ? route('admin.categories.update', $category)
        : route('admin.categories.store') }}"
>
    @csrf

    @if ($category->exists)
        @method('PUT')
    @endif

    <div class="rounded-xl bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
            <h2 class="text-lg font-bold text-slate-900">
                Category Information
            </h2>

            <p class="mt-1 text-sm text-slate-500">
                Enter the category details and hierarchy.
            </p>
        </div>

        <div class="grid gap-6 p-6 md:grid-cols-2">
            {{-- Name --}}
            <div>
                <label
                    for="name"
                    class="mb-2 block text-sm font-medium text-slate-700"
                >
                    Category name
                    <span class="text-red-600">*</span>
                </label>

                <input
                    id="name"
                    type="text"
                    name="name"
                    value="{{ old('name', $category->name) }}"
                    required
                    maxlength="150"
                    class="w-full rounded-lg border border-slate-300
                           px-4 py-2.5 outline-none
                           focus:border-indigo-500"
                >

                @error('name')
                    <p class="mt-1 text-sm text-red-600">
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- Slug --}}
            <div>
                <label
                    for="slug"
                    class="mb-2 block text-sm font-medium text-slate-700"
                >
                    Slug
                </label>

                <input
                    id="slug"
                    type="text"
                    name="slug"
                    value="{{ old('slug', $category->slug) }}"
                    maxlength="180"
                    placeholder="Generated automatically when empty"
                    class="w-full rounded-lg border border-slate-300
                           px-4 py-2.5 outline-none
                           focus:border-indigo-500"
                >

                @error('slug')
                    <p class="mt-1 text-sm text-red-600">
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- Parent --}}
            <div>
                <label
                    for="parent_id"
                    class="mb-2 block text-sm font-medium text-slate-700"
                >
                    Parent category
                </label>

                <select
                    id="parent_id"
                    name="parent_id"
                    class="w-full rounded-lg border border-slate-300
                           px-4 py-2.5 outline-none
                           focus:border-indigo-500"
                >
                    <option value="">
                        No parent — root category
                    </option>

                    @foreach ($parentOptions as $parent)
                        <option
                            value="{{ $parent->id }}"
                            @selected(
                                (string) old(
                                    'parent_id',
                                    $category->parent_id
                                ) === (string) $parent->id
                            )
                        >
                            {{ $parent->name }}

                            @if ($parent->parent)
                                — {{ $parent->parent->name }}
                            @endif
                        </option>
                    @endforeach
                </select>

                @error('parent_id')
                    <p class="mt-1 text-sm text-red-600">
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- Sort order --}}
            <div>
                <label
                    for="sort_order"
                    class="mb-2 block text-sm font-medium text-slate-700"
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
                        $category->sort_order ?? 0
                    ) }}"
                    class="w-full rounded-lg border border-slate-300
                           px-4 py-2.5 outline-none
                           focus:border-indigo-500"
                >

                @error('sort_order')
                    <p class="mt-1 text-sm text-red-600">
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- Description --}}
            <div class="md:col-span-2">
                <label
                    for="description"
                    class="mb-2 block text-sm font-medium text-slate-700"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    name="description"
                    rows="5"
                    maxlength="3000"
                    class="w-full rounded-lg border border-slate-300
                           px-4 py-3 outline-none
                           focus:border-indigo-500"
                >{{ old(
                    'description',
                    $category->description
                ) }}</textarea>

                @error('description')
                    <p class="mt-1 text-sm text-red-600">
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- Image --}}
            <div class="md:col-span-2">
                <label
                    for="image"
                    class="mb-2 block text-sm font-medium text-slate-700"
                >
                    Category image
                </label>

                @if ($category->image_url)
                    <div class="mb-4">
                        <img
                            src="{{ $category->image_url }}"
                            alt="{{ $category->name }}"
                            class="h-28 w-28 rounded-lg border
                                   border-slate-200 object-cover"
                        >
                    </div>
                @endif

                <input
                    id="image"
                    type="file"
                    name="image"
                    accept=".jpg,.jpeg,.png,.webp"
                    class="block w-full rounded-lg border
                           border-slate-300 px-4 py-2.5 text-sm"
                >

                <p class="mt-1 text-xs text-slate-500">
                    JPG, JPEG, PNG or WebP. Maximum 2 MB.
                </p>

                @error('image')
                    <p class="mt-1 text-sm text-red-600">
                        {{ $message }}
                    </p>
                @enderror

                @if ($category->exists && $category->image)
                    <input
                        type="hidden"
                        name="remove_image"
                        value="0"
                    >

                    <label class="mt-4 flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="remove_image"
                            value="1"
                            @checked(old('remove_image'))
                            class="rounded border-slate-300"
                        >

                        <span class="text-sm text-red-700">
                            Remove current image
                        </span>
                    </label>
                @elseif ($category->exists)
                    <input
                        type="hidden"
                        name="remove_image"
                        value="0"
                    >
                @endif
            </div>

            {{-- Status --}}
            <div class="md:col-span-2">
                <input
                    type="hidden"
                    name="status"
                    value="0"
                >

                <label class="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="status"
                        value="1"
                        @checked(
                            (bool) old(
                                'status',
                                $category->exists
                                    ? $category->status
                                    : true
                            )
                        )
                        class="rounded border-slate-300"
                    >

                    <span>
                        <span class="block text-sm font-medium text-slate-800">
                            Active category
                        </span>

                        <span class="block text-xs text-slate-500">
                            Inactive categories will not be shown to customers.
                        </span>
                    </span>
                </label>

                @error('status')
                    <p class="mt-1 text-sm text-red-600">
                        {{ $message }}
                    </p>
                @enderror
            </div>
        </div>

        <div class="flex items-center justify-end gap-3
                    border-t border-slate-200 px-6 py-4">
            <a
                href="{{ route('admin.categories.index') }}"
                class="rounded-lg border border-slate-300
                       px-5 py-2.5 text-sm font-semibold
                       text-slate-700 hover:bg-slate-100"
            >
                Cancel
            </a>

            <button
                type="submit"
                class="rounded-lg bg-indigo-600 px-5 py-2.5
                       text-sm font-semibold text-white
                       hover:bg-indigo-700"
            >
                {{ $category->exists
                    ? 'Update Category'
                    : 'Create Category' }}
            </button>
        </div>
    </div>
</form>
