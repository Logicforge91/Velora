<?php

namespace App\Services\Admin;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WarehouseOperationsService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, Store>
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');

        return Store::query()
            ->withCount('inventories')
            ->withSum('inventories as units_on_hand', 'on_hand')
            ->withSum('inventories as units_reserved', 'reserved')
            ->when($search !== '', fn (Builder $query): Builder => $query->where(
                fn (Builder $query): Builder => $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
            ))
            ->when($status !== '', fn (Builder $query): Builder => $query->where('status', $status === 'active'))
            ->orderBy('priority')->latest('id')->paginate(15)->withQueryString();
    }

    /** @return array<string, int> */
    public function counts(): array
    {
        return [
            'total' => Store::query()->count(),
            'active' => Store::query()->where('status', true)->count(),
            'units' => (int) Inventory::query()->sum('on_hand'),
            'low_stock' => Inventory::query()->whereColumn('on_hand', '<=', 'reorder_level')->count(),
        ];
    }

    /** @param array<string, mixed> $data */
    public function create(array $data): Store
    {
        return Store::query()->create($data);
    }

    /** @param array<string, mixed> $data */
    public function update(Store $warehouse, array $data): Store
    {
        $warehouse->update($data);

        return $warehouse->fresh();
    }

    /** @param array<string, mixed> $data */
    public function adjust(Store $warehouse, User $actor, array $data): Inventory
    {
        return DB::transaction(function () use ($warehouse, $actor, $data): Inventory {
            $product = Product::query()->lockForUpdate()->findOrFail((int) $data['product_id']);
            $inventory = Inventory::query()->lockForUpdate()->firstOrNew([
                'store_id' => $warehouse->id,
                'product_id' => $product->id,
            ]);
            $beforeQuantity = (int) $inventory->on_hand;

            if ((int) $data['reserved'] > (int) $data['on_hand']) {
                throw ValidationException::withMessages(['reserved' => 'Reserved stock cannot exceed on-hand stock.']);
            }

            $inventory->fill([...$data, 'updated_by' => $actor->id])->save();

            if ($beforeQuantity !== (int) $inventory->on_hand) {
                $inventory->movements()->create([
                    'type' => 'adjustment',
                    'quantity' => (int) $inventory->on_hand - $beforeQuantity,
                    'before_quantity' => $beforeQuantity,
                    'after_quantity' => (int) $inventory->on_hand,
                    'reason' => 'Manual warehouse adjustment',
                    'created_by' => $actor->id,
                    'occurred_at' => now(),
                ]);
            }

            $product->update([
                'stock' => (int) Inventory::query()->where('product_id', $product->id)->sum('on_hand'),
            ]);

            return $inventory->fresh(['product', 'updatedBy']);
        });
    }

    public function delete(Store $warehouse): void
    {
        if ($warehouse->inventories()->where('on_hand', '>', 0)->exists()) {
            throw ValidationException::withMessages(['warehouse' => 'Move all on-hand inventory before deleting this warehouse.']);
        }

        $warehouse->delete();
    }
}
