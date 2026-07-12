<?php

namespace App\Services\Admin;

use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

class CategoryManagementService
{
    public function getCategories(
        array $filters = []
    ): LengthAwarePaginator {
        $search = trim(
            (string) ($filters['search'] ?? '')
        );

        $status = (string) ($filters['status'] ?? '');
        $parent = (string) ($filters['parent'] ?? '');

        return Category::query()
            ->with([
                'parent:id,name',
            ])
            ->withCount('children')
            ->when(
                $search !== '',
                function (Builder $query) use ($search): void {
                    $query->where(
                        function (Builder $query) use ($search): void {
                            $query
                                ->where(
                                    'name',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'slug',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'description',
                                    'like',
                                    "%{$search}%"
                                );
                        }
                    );
                }
            )
            ->when(
                $status === 'active',
                fn (Builder $query): Builder =>
                    $query->where('status', true)
            )
            ->when(
                $status === 'inactive',
                fn (Builder $query): Builder =>
                    $query->where('status', false)
            )
            ->when(
                $parent === 'root',
                fn (Builder $query): Builder =>
                    $query->whereNull('parent_id')
            )
            ->when(
                ctype_digit($parent),
                fn (Builder $query): Builder =>
                    $query->where(
                        'parent_id',
                        (int) $parent
                    )
            )
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();
    }

    public function getCounts(): array
    {
        return [
            'all' => Category::query()->count(),

            'active' => Category::query()
                ->where('status', true)
                ->count(),

            'inactive' => Category::query()
                ->where('status', false)
                ->count(),

            'root' => Category::query()
                ->whereNull('parent_id')
                ->count(),
        ];
    }

    public function getParentOptions(
        ?Category $currentCategory = null
    ): Collection {
        $query = Category::query()
            ->select([
                'id',
                'parent_id',
                'name',
                'status',
            ])
            ->with('parent:id,name')
            ->orderBy('name');

        if ($currentCategory) {
            $excludedIds = array_merge(
                [$currentCategory->id],
                $this->getDescendantIds($currentCategory)
            );

            $query->whereNotIn('id', $excludedIds);
        }

        return $query->get();
    }

    public function create(array $data): Category
    {
        $imagePath = null;

        $uploadedImage = $data['image'] ?? null;

        if ($uploadedImage instanceof UploadedFile) {
            $imagePath = $uploadedImage->store(
                'categories',
                'public'
            );
        }

        $payload = Arr::except($data, [
            'image',
        ]);

        $payload['parent_id'] =
            $payload['parent_id'] ?? null;

        $payload['slug'] = $this->generateUniqueSlug(
            preferredSlug: $payload['slug'] ?? null,
            name: $payload['name'],
        );

        $payload['image'] = $imagePath;

        try {
            return DB::transaction(
                fn (): Category => Category::query()->create(
                    $payload
                )
            );
        } catch (Throwable $exception) {
            if ($imagePath) {
                Storage::disk('public')->delete(
                    $imagePath
                );
            }

            throw $exception;
        }
    }

    public function update(
        Category $category,
        array $data
    ): Category {
        $this->validateParentCategory(
            category: $category,
            parentId: isset($data['parent_id'])
                ? (int) $data['parent_id']
                : null,
        );

        $oldImagePath = $category->image;
        $newImagePath = null;

        $uploadedImage = $data['image'] ?? null;

        if ($uploadedImage instanceof UploadedFile) {
            $newImagePath = $uploadedImage->store(
                'categories',
                'public'
            );
        }

        $removeImage = (bool) (
            $data['remove_image'] ?? false
        );

        $payload = Arr::except($data, [
            'image',
            'remove_image',
        ]);

        $payload['parent_id'] =
            $payload['parent_id'] ?? null;

        $payload['slug'] = $this->generateUniqueSlug(
            preferredSlug: $payload['slug'] ?? null,
            name: $payload['name'],
            ignoreCategoryId: $category->id,
        );

        if ($newImagePath) {
            $payload['image'] = $newImagePath;
        } elseif ($removeImage) {
            $payload['image'] = null;
        }

        try {
            $updatedCategory = DB::transaction(
                function () use (
                    $category,
                    $payload
                ): Category {
                    $category->update($payload);

                    return $category->fresh([
                        'parent',
                    ]);
                }
            );
        } catch (Throwable $exception) {
            if ($newImagePath) {
                Storage::disk('public')->delete(
                    $newImagePath
                );
            }

            throw $exception;
        }

        if (
            $oldImagePath &&
            ($newImagePath || $removeImage)
        ) {
            Storage::disk('public')->delete(
                $oldImagePath
            );
        }

        return $updatedCategory;
    }

    public function delete(Category $category): void
    {
        if ($category->children()->exists()) {
            throw ValidationException::withMessages([
                'category' =>
                    'Delete or move the child categories before deleting this category.',
            ]);
        }

        $imagePath = $category->image;

        DB::transaction(
            fn () => $category->delete()
        );

        if ($imagePath) {
            Storage::disk('public')->delete(
                $imagePath
            );
        }
    }

    private function validateParentCategory(
        Category $category,
        ?int $parentId
    ): void {
        if (!$parentId) {
            return;
        }

        if ($parentId === $category->id) {
            throw ValidationException::withMessages([
                'parent_id' =>
                    'A category cannot be its own parent.',
            ]);
        }

        $descendantIds = $this->getDescendantIds(
            $category
        );

        if (in_array(
            $parentId,
            $descendantIds,
            true
        )) {
            throw ValidationException::withMessages([
                'parent_id' =>
                    'A child category cannot be selected as the parent.',
            ]);
        }
    }

    private function getDescendantIds(
        Category $category
    ): array {
        $descendantIds = [];
        $parentIds = [$category->id];

        while ($parentIds !== []) {
            $childIds = Category::query()
                ->whereIn('parent_id', $parentIds)
                ->pluck('id')
                ->map(
                    fn ($id): int => (int) $id
                )
                ->all();

            $childIds = array_values(
                array_diff(
                    $childIds,
                    $descendantIds
                )
            );

            if ($childIds === []) {
                break;
            }

            $descendantIds = array_merge(
                $descendantIds,
                $childIds
            );

            $parentIds = $childIds;
        }

        return $descendantIds;
    }

    private function generateUniqueSlug(
        ?string $preferredSlug,
        string $name,
        ?int $ignoreCategoryId = null
    ): string {
        $baseSlug = Str::slug(
            $preferredSlug ?: $name
        );

        if ($baseSlug === '') {
            $baseSlug = 'category';
        }

        $slug = $baseSlug;
        $counter = 2;

        while (
            Category::query()
                ->where('slug', $slug)
                ->when(
                    $ignoreCategoryId,
                    fn (Builder $query): Builder =>
                        $query->where(
                            'id',
                            '!=',
                            $ignoreCategoryId
                        )
                )
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
