<?php

namespace App\Services\Admin;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ProductManagementService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, Product>
     */
    public function getProducts(array $filters = []): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');
        $stock = (string) ($filters['stock'] ?? '');
        $categoryId = $filters['category_id'] ?? null;

        return Product::query()
            ->select([
                'id', 'category_id', 'brand_id', 'name', 'slug', 'sku',
                'price', 'compare_at_price', 'stock', 'low_stock_threshold',
                'status', 'is_featured', 'created_at',
            ])
            ->with(['category:id,name', 'brand:id,name', 'primaryImage'])
            ->when($search !== '', fn (Builder $query): Builder => $query->where(
                fn (Builder $query): Builder => $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
            ))
            ->when(in_array($status, Product::statuses(), true), fn (Builder $query): Builder => $query->where('status', $status))
            ->when($categoryId, fn (Builder $query): Builder => $query->where('category_id', $categoryId))
            ->when($stock === 'out', fn (Builder $query): Builder => $query->where('stock', 0))
            ->when($stock === 'low', fn (Builder $query): Builder => $query->whereColumn('stock', '<=', 'low_stock_threshold')->where('stock', '>', 0))
            ->when($stock === 'healthy', fn (Builder $query): Builder => $query->whereColumn('stock', '>', 'low_stock_threshold'))
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }

    /** @return array<string, int|float> */
    public function getCounts(): array
    {
        $counts = Product::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as active', [Product::STATUS_ACTIVE])
            ->selectRaw('SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as out_of_stock')
            ->selectRaw('SUM(CASE WHEN stock > 0 AND stock <= low_stock_threshold THEN 1 ELSE 0 END) as low_stock')
            ->selectRaw('COALESCE(SUM(price * stock), 0) as inventory_value')
            ->toBase()
            ->firstOrFail();

        return [
            'total' => (int) $counts->total,
            'active' => (int) $counts->active,
            'out_of_stock' => (int) $counts->out_of_stock,
            'low_stock' => (int) $counts->low_stock,
            'inventory_value' => (float) $counts->inventory_value,
        ];
    }

    /** @param array<string, mixed> $data */
    public function create(array $data): Product
    {
        $image = $data['primary_image'] ?? null;
        $imagePath = $image instanceof UploadedFile ? $image->store('products', 'public') : null;

        try {
            return DB::transaction(function () use ($data, $imagePath): Product {
                $product = Product::query()->create($this->payload($data));

                if ($imagePath) {
                    $product->images()->create([
                        'path' => $imagePath,
                        'alt_text' => $product->name,
                        'is_primary' => true,
                    ]);
                }

                return $product;
            });
        } catch (Throwable $exception) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $exception;
        }
    }

    /** @param array<string, mixed> $data */
    public function update(Product $product, array $data): Product
    {
        $image = $data['primary_image'] ?? null;
        $newImagePath = $image instanceof UploadedFile ? $image->store('products', 'public') : null;
        $oldImage = $product->primaryImage;

        try {
            DB::transaction(function () use ($product, $data, $newImagePath, $oldImage): void {
                $product->update($this->payload($data, $product));

                if ($newImagePath || ($data['remove_primary_image'] ?? false)) {
                    $oldImage?->delete();
                }

                if ($newImagePath) {
                    $product->images()->create([
                        'path' => $newImagePath,
                        'alt_text' => $product->name,
                        'is_primary' => true,
                    ]);
                }
            });
        } catch (Throwable $exception) {
            if ($newImagePath) {
                Storage::disk('public')->delete($newImagePath);
            }

            throw $exception;
        }

        if ($oldImage && ($newImagePath || ($data['remove_primary_image'] ?? false))) {
            Storage::disk('public')->delete($oldImage->path);
        }

        return $product->fresh(['category', 'brand', 'primaryImage']);
    }

    public function delete(Product $product): void
    {
        $paths = $product->images()->pluck('path');

        DB::transaction(fn () => $product->delete());

        Storage::disk('public')->delete($paths->all());
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function payload(array $data, ?Product $product = null): array
    {
        $payload = Arr::except($data, ['primary_image', 'remove_primary_image']);
        $baseSlug = Str::slug($payload['slug'] ?: $payload['name']) ?: 'product';
        $slug = $baseSlug;
        $counter = 2;

        while (Product::query()->where('slug', $slug)
            ->when($product, fn (Builder $query): Builder => $query->whereKeyNot($product->getKey()))
            ->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $payload['slug'] = $slug;
        $payload['sku'] = Str::upper(trim($payload['sku']));

        return $payload;
    }
}
