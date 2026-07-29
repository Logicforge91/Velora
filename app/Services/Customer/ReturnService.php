<?php

namespace App\Services\Customer;

use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ReturnCase;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReturnService
{
    /**
     * @param  array<string, mixed>  $data
     * @param  array<int, UploadedFile>  $images
     */
    public function create(User $user, array $data, array $images, ?UploadedFile $video): ReturnCase
    {
        $item = OrderItem::query()->with('order')->findOrFail($data['order_item_id']);
        $address = Address::query()->whereBelongsTo($user)->findOrFail($data['pickup_address_id']);

        if ($item->order->user_id !== $user->id || $item->order->status !== Order::STATUS_DELIVERED) {
            throw ValidationException::withMessages(['order_item_id' => 'This item is not eligible for return yet.']);
        }

        if ($item->return_eligible_until !== null && $item->return_eligible_until->isPast()) {
            throw ValidationException::withMessages(['order_item_id' => 'The return window for this item has closed.']);
        }

        if (ReturnCase::query()->where('order_item_id', $item->id)->whereNotIn('status', ['rejected', 'cancelled', 'refunded'])->exists()) {
            throw ValidationException::withMessages(['order_item_id' => 'An active request already exists for this item.']);
        }

        $returnCase = DB::transaction(fn (): ReturnCase => ReturnCase::query()->create([
            'order_id' => $item->order_id,
            'order_item_id' => $item->id,
            'customer_id' => $user->id,
            'number' => 'RET-'.Str::upper(Str::random(12)),
            'type' => $data['type'],
            'reason_code' => $data['reason_code'],
            'reason_details' => $data['reason_details'] ?? null,
            'requested_quantity' => $item->quantity,
            'refund_amount' => $data['type'] === 'return' ? $item->total : 0,
            'resolution' => $data['type'],
            'pickup_address' => $address->only([
                'recipient_name', 'phone', 'line_1', 'line_2', 'landmark',
                'city', 'state', 'postal_code',
            ]),
            'pickup_slot_at' => $data['pickup_slot_at'],
            'exchange_attributes' => in_array($data['type'], ['size_exchange', 'color_exchange'], true)
                ? [Str::before($data['type'], '_') => $data['exchange_value']]
                : null,
            'requested_at' => now(),
        ]));

        $mediaPaths = collect($images)
            ->map(fn (UploadedFile $image): string => $image->store("returns/{$returnCase->id}", 'public'))
            ->all();

        if ($video !== null) {
            $mediaPaths[] = $video->store("returns/{$returnCase->id}", 'public');
        }

        $returnCase->update(['media_paths' => $mediaPaths]);

        return $returnCase->fresh(['orderItem', 'paymentRefunds']);
    }

    public function cancel(ReturnCase $returnCase): void
    {
        if (! in_array($returnCase->status, ['requested', 'approved'], true)) {
            throw ValidationException::withMessages(['return' => 'This request can no longer be cancelled.']);
        }

        $returnCase->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);
    }
}
