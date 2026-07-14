<?php

namespace App\Services\Admin;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class BrandManagementService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, Brand>
     */
    public function getBrands(
        array $filters = []
    ): LengthAwarePaginator {
        $search = trim(
            (string) ($filters['search'] ?? '')
        );

        $status = (string) ($filters['status'] ?? '');
        $featured = (string) ($filters['featured'] ?? '');

        return Brand::query()
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
                                )
                                ->orWhere(
                                    'website_url',
                                    'like',
                                    "%{$search}%"
                                );
                        }
                    );
                }
            )
            ->when(
                $status === 'active',
                fn (Builder $query): Builder => $query->where('status', true)
            )
            ->when(
                $status === 'inactive',
                fn (Builder $query): Builder => $query->where('status', false)
            )
            ->when(
                $featured === 'yes',
                fn (Builder $query): Builder => $query->where('is_featured', true)
            )
            ->when(
                $featured === 'no',
                fn (Builder $query): Builder => $query->where('is_featured', false)
            )
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();
    }

    /** @return array{all: int, active: int, inactive: int, featured: int} */
    public function getCounts(): array
    {
        $counts = Brand::query()
            ->selectRaw(
                'COUNT(*) as total,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as inactive,
                SUM(CASE WHEN is_featured = ? THEN 1 ELSE 0 END) as featured',
                [true, false, true],
            )
            ->toBase()
            ->firstOrFail();

        return [
            'all' => (int) $counts->total,
            'active' => (int) $counts->active,
            'inactive' => (int) $counts->inactive,
            'featured' => (int) $counts->featured,
        ];
    }

    /** @param array<string, mixed> $data */
    public function create(array $data): Brand
    {
        $logoPath = null;
        $uploadedLogo = $data['logo'] ?? null;

        if ($uploadedLogo instanceof UploadedFile) {
            $logoPath = $uploadedLogo->store(
                'brands',
                'public'
            );
        }

        $payload = Arr::except($data, [
            'logo',
        ]);

        $payload['slug'] = $this->generateUniqueSlug(
            preferredSlug: $payload['slug'] ?? null,
            name: $payload['name'],
        );

        $payload['logo'] = $logoPath;

        try {
            return DB::transaction(
                fn (): Brand => Brand::query()->create(
                    $payload
                )
            );
        } catch (Throwable $exception) {
            if ($logoPath) {
                Storage::disk('public')->delete(
                    $logoPath
                );
            }

            throw $exception;
        }
    }

    /** @param array<string, mixed> $data */
    public function update(
        Brand $brand,
        array $data
    ): Brand {
        $oldLogoPath = $brand->logo;
        $newLogoPath = null;

        $uploadedLogo = $data['logo'] ?? null;
        $removeLogo = (bool) ($data['remove_logo'] ?? false);

        if ($uploadedLogo instanceof UploadedFile) {
            $newLogoPath = $uploadedLogo->store(
                'brands',
                'public'
            );
        }

        $payload = Arr::except($data, [
            'logo',
            'remove_logo',
        ]);

        $payload['slug'] = $this->generateUniqueSlug(
            preferredSlug: $payload['slug'] ?? null,
            name: $payload['name'],
            ignoreBrandId: $brand->id,
        );

        if ($newLogoPath) {
            $payload['logo'] = $newLogoPath;
        } elseif ($removeLogo) {
            $payload['logo'] = null;
        }

        try {
            $updatedBrand = DB::transaction(
                function () use (
                    $brand,
                    $payload
                ): Brand {
                    $brand->update($payload);

                    return $brand->fresh();
                }
            );
        } catch (Throwable $exception) {
            if ($newLogoPath) {
                Storage::disk('public')->delete(
                    $newLogoPath
                );
            }

            throw $exception;
        }

        if (
            $oldLogoPath &&
            ($newLogoPath || $removeLogo)
        ) {
            Storage::disk('public')->delete(
                $oldLogoPath
            );
        }

        return $updatedBrand;
    }

    public function delete(Brand $brand): void
    {
        $logoPath = $brand->logo;

        DB::transaction(
            fn () => $brand->delete()
        );

        if ($logoPath) {
            Storage::disk('public')->delete(
                $logoPath
            );
        }
    }

    private function generateUniqueSlug(
        ?string $preferredSlug,
        string $name,
        ?int $ignoreBrandId = null
    ): string {
        $baseSlug = Str::slug(
            $preferredSlug ?: $name
        );

        if ($baseSlug === '') {
            $baseSlug = 'brand';
        }

        $slug = $baseSlug;
        $counter = 2;

        while (
            Brand::query()
                ->where('slug', $slug)
                ->when(
                    $ignoreBrandId,
                    fn (Builder $query): Builder => $query->where(
                        'id',
                        '!=',
                        $ignoreBrandId
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
