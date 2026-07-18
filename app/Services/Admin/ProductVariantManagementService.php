<?php

namespace App\Services\Admin;

use App\Models\ProductVariant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ProductVariantManagementService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, ProductVariant>
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');
        $productId = $filters['product_id'] ?? null;

        return ProductVariant::query()
            ->with('product:id,name,sku')
            ->when($search !== '', fn (Builder $query): Builder => $query->where(
                fn (Builder $query): Builder => $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhereHas('product', fn (Builder $query): Builder => $query->where('name', 'like', "%{$search}%"))
            ))
            ->when($productId, fn (Builder $query): Builder => $query->where('product_id', $productId))
            ->when($status === 'active', fn (Builder $query): Builder => $query->where('status', true))
            ->when($status === 'inactive', fn (Builder $query): Builder => $query->where('status', false))
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }

    /** @return array<string, int> */
    public function counts(): array
    {
        $counts = ProductVariant::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active')
            ->selectRaw('SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as out_of_stock')
            ->selectRaw('SUM(CASE WHEN stock > 0 AND stock <= low_stock_threshold THEN 1 ELSE 0 END) as low_stock')
            ->toBase()
            ->firstOrFail();

        return [
            'total' => (int) $counts->total,
            'active' => (int) $counts->active,
            'out_of_stock' => (int) $counts->out_of_stock,
            'low_stock' => (int) $counts->low_stock,
        ];
    }

    /** @param array<string, mixed> $data */
    public function create(array $data): ProductVariant
    {
        return DB::transaction(function () use ($data): ProductVariant {
            if ($data['is_default']) {
                ProductVariant::query()->where('product_id', $data['product_id'])->update(['is_default' => false]);
            }

            return ProductVariant::query()->create($data);
        });
    }

    /** @param array<string, mixed> $data */
    public function update(ProductVariant $productVariant, array $data): ProductVariant
    {
        return DB::transaction(function () use ($productVariant, $data): ProductVariant {
            if ($data['is_default']) {
                ProductVariant::query()
                    ->where('product_id', $data['product_id'])
                    ->whereKeyNot($productVariant->getKey())
                    ->update(['is_default' => false]);
            }

            $productVariant->update($data);

            return $productVariant->fresh('product');
        });
    }

    public function delete(ProductVariant $productVariant): void
    {
        DB::transaction(function () use ($productVariant): void {
            $productId = $productVariant->product_id;
            $wasDefault = $productVariant->is_default;
            $productVariant->delete();

            if ($wasDefault) {
                ProductVariant::query()
                    ->where('product_id', $productId)
                    ->where('status', true)
                    ->oldest()
                    ->first()?->update(['is_default' => true]);
            }
        });
    }
}
