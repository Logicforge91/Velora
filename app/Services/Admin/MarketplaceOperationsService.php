<?php

namespace App\Services\Admin;

use App\Models\InventoryMovement;
use App\Models\InventoryReservation;
use App\Models\PaymentRefund;
use App\Models\SellerListing;
use App\Models\ServiceArea;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MarketplaceOperationsService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, SellerListing>
     */
    public function sellerListings(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');

        return SellerListing::query()
            ->with(['vendor:id,business_name', 'product:id,name,sku', 'variant:id,name,sku', 'store:id,name,code'])
            ->when($search !== '', fn (Builder $query): Builder => $query->where(
                fn (Builder $query): Builder => $query
                    ->where('seller_sku', 'like', "%{$search}%")
                    ->orWhereHas('product', fn (Builder $query): Builder => $query->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('vendor', fn (Builder $query): Builder => $query->where('business_name', 'like', "%{$search}%"))
            ))
            ->when($status !== '', fn (Builder $query): Builder => $query->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }

    /** @return array<string, int> */
    public function sellerListingCounts(): array
    {
        return [
            'total' => SellerListing::query()->count(),
            'active' => SellerListing::query()->where('status', 'active')->count(),
            'pending' => SellerListing::query()->whereIn('status', ['draft', 'pending'])->count(),
            'suspended' => SellerListing::query()->where('status', 'suspended')->count(),
        ];
    }

    /** @param array<string, mixed> $data */
    public function updateSellerListing(SellerListing $listing, User $actor, array $data): SellerListing
    {
        return DB::transaction(function () use ($listing, $actor, $data): SellerListing {
            $listing = SellerListing::query()->lockForUpdate()->findOrFail($listing->id);
            $oldPrice = $listing->selling_price;
            $status = $data['status'];

            if ($data['is_buy_box_winner']) {
                SellerListing::query()
                    ->where('product_id', $listing->product_id)
                    ->whereKeyNot($listing->id)
                    ->update(['is_buy_box_winner' => false]);
            }

            $listing->update([
                ...$data,
                'published_at' => $status === 'active' ? ($listing->published_at ?? now()) : $listing->published_at,
                'suspended_at' => $status === 'suspended' ? now() : null,
                'rejection_reason' => $status === 'rejected' ? $data['rejection_reason'] : null,
            ]);

            if ((string) $oldPrice !== (string) $data['selling_price']) {
                $listing->priceHistories()->create([
                    'product_id' => $listing->product_id,
                    'product_variant_id' => $listing->product_variant_id,
                    'old_price' => $oldPrice,
                    'new_price' => $data['selling_price'],
                    'change_source' => 'admin',
                    'reason' => 'Seller listing updated from the admin panel.',
                    'changed_by' => $actor->id,
                    'effective_from' => now(),
                ]);
            }

            return $listing->fresh(['vendor', 'product', 'variant', 'store']);
        });
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, InventoryMovement>
     */
    public function inventoryMovements(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $type = (string) ($filters['type'] ?? '');

        return InventoryMovement::query()
            ->with(['inventory.product:id,name,sku', 'inventory.variant:id,name,sku', 'inventory.store:id,name,code', 'creator:id,name'])
            ->when($search !== '', fn (Builder $query): Builder => $query->where(
                fn (Builder $query): Builder => $query
                    ->where('uuid', 'like', "%{$search}%")
                    ->orWhereHas('inventory.product', fn (Builder $query): Builder => $query->where('name', 'like', "%{$search}%")->orWhere('sku', 'like', "%{$search}%"))
            ))
            ->when($type !== '', fn (Builder $query): Builder => $query->where('type', $type))
            ->latest('occurred_at')
            ->paginate(12, ['*'], 'movements_page')
            ->withQueryString();
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, InventoryReservation>
     */
    public function inventoryReservations(array $filters): LengthAwarePaginator
    {
        $status = (string) ($filters['reservation_status'] ?? '');

        return InventoryReservation::query()
            ->with(['inventory.product:id,name,sku', 'inventory.variant:id,name,sku', 'inventory.store:id,name,code', 'order:id,number'])
            ->when($status !== '', fn (Builder $query): Builder => $query->where('status', $status))
            ->latest()
            ->paginate(12, ['*'], 'reservations_page')
            ->withQueryString();
    }

    public function releaseReservation(InventoryReservation $reservation, string $reason): InventoryReservation
    {
        return DB::transaction(function () use ($reservation, $reason): InventoryReservation {
            $reservation = InventoryReservation::query()->lockForUpdate()->findOrFail($reservation->id);

            if ($reservation->status !== 'active') {
                throw ValidationException::withMessages(['reservation' => 'Only active reservations can be released.']);
            }

            $inventory = $reservation->inventory()->lockForUpdate()->firstOrFail();
            $inventory->update(['reserved' => max(0, $inventory->reserved - $reservation->quantity)]);
            $reservation->update(['status' => 'released', 'released_at' => now(), 'release_reason' => $reason]);

            return $reservation->fresh(['inventory.product', 'inventory.variant', 'inventory.store', 'order']);
        });
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, PaymentRefund>
     */
    public function paymentRefunds(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');

        return PaymentRefund::query()
            ->with(['payment.order.user:id,name,email', 'returnCase:id,number', 'requester:id,name', 'processor:id,name'])
            ->when($search !== '', fn (Builder $query): Builder => $query->where(
                fn (Builder $query): Builder => $query
                    ->where('number', 'like', "%{$search}%")
                    ->orWhere('provider_reference', 'like', "%{$search}%")
                    ->orWhereHas('payment.order', fn (Builder $query): Builder => $query->where('number', 'like', "%{$search}%"))
            ))
            ->when($status !== '', fn (Builder $query): Builder => $query->where('status', $status))
            ->latest('requested_at')
            ->paginate(15)
            ->withQueryString();
    }

    /** @return array<string, int|float> */
    public function paymentRefundCounts(): array
    {
        return [
            'total' => PaymentRefund::query()->count(),
            'requested' => PaymentRefund::query()->where('status', 'requested')->count(),
            'processing' => PaymentRefund::query()->whereIn('status', ['approved', 'processing'])->count(),
            'completed_amount' => (float) PaymentRefund::query()->where('status', 'completed')->sum('amount'),
        ];
    }

    /** @param array<string, mixed> $data */
    public function updatePaymentRefund(PaymentRefund $refund, User $actor, array $data): PaymentRefund
    {
        return DB::transaction(function () use ($refund, $actor, $data): PaymentRefund {
            $refund = PaymentRefund::query()->lockForUpdate()->findOrFail($refund->id);
            $payment = $refund->payment()->lockForUpdate()->firstOrFail();
            $transitions = [
                'requested' => ['requested', 'approved', 'rejected'],
                'approved' => ['approved', 'processing', 'rejected'],
                'processing' => ['processing', 'completed', 'failed'],
                'failed' => ['failed', 'processing'],
                'completed' => ['completed'],
                'rejected' => ['rejected'],
            ];

            if (! in_array($data['status'], $transitions[$refund->status] ?? [], true)) {
                throw ValidationException::withMessages(['status' => "A refund cannot move from {$refund->status} to {$data['status']}."]);
            }

            $refund->update([
                ...$data,
                'processed_by' => in_array($data['status'], ['completed', 'failed', 'rejected'], true) ? $actor->id : $refund->processed_by,
                'processed_at' => in_array($data['status'], ['completed', 'failed', 'rejected'], true) ? now() : $refund->processed_at,
                'failure_reason' => $data['status'] === 'failed' ? $data['failure_reason'] : null,
            ]);

            if ($data['status'] === 'completed') {
                $refundedAmount = (float) $payment->refunds()->where('status', 'completed')->sum('amount');

                if ($refundedAmount > (float) $payment->amount) {
                    throw ValidationException::withMessages(['status' => 'Completed refunds cannot exceed the captured payment.']);
                }

                $paymentStatus = $refundedAmount >= (float) $payment->amount ? 'refunded' : 'partially_refunded';
                $payment->update(['refunded_amount' => $refundedAmount, 'status' => $paymentStatus, 'refunded_at' => now()]);
                $payment->order()->update(['payment_status' => 'refunded']);
            }

            return $refund->fresh(['payment.order.user', 'returnCase', 'requester', 'processor']);
        });
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, ServiceArea>
     */
    public function serviceAreas(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');

        return ServiceArea::query()
            ->with('store:id,name,code')
            ->when($search !== '', fn (Builder $query): Builder => $query->where(
                fn (Builder $query): Builder => $query->where('postal_code', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%")
            ))
            ->when($status !== '', fn (Builder $query): Builder => $query->where('status', $status))
            ->orderBy('postal_code')
            ->paginate(15)
            ->withQueryString();
    }

    /** @param array<string, mixed> $data */
    public function createServiceArea(array $data): ServiceArea
    {
        return ServiceArea::query()->create($data);
    }

    /** @param array<string, mixed> $data */
    public function updateServiceArea(ServiceArea $serviceArea, array $data): ServiceArea
    {
        $serviceArea->update($data);

        return $serviceArea->fresh('store');
    }
}
