<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SupportTicket extends Model
{
    protected $fillable = ['customer_id', 'order_id', 'assigned_to', 'number', 'subject', 'category', 'channel', 'priority', 'status', 'description', 'first_response_due_at', 'resolution_due_at', 'first_responded_at', 'resolved_at', 'closed_at'];

    protected $attributes = ['channel' => 'admin', 'priority' => 'medium', 'status' => 'open'];

    protected function casts(): array
    {
        return ['first_response_due_at' => 'datetime', 'resolution_due_at' => 'datetime', 'first_responded_at' => 'datetime', 'resolved_at' => 'datetime', 'closed_at' => 'datetime'];
    }

    /** @return BelongsTo<User, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id')->withTrashed();
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return BelongsTo<User, $this> */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to')->withTrashed();
    }

    /** @return HasMany<SupportMessage, $this> */
    public function messages(): HasMany
    {
        return $this->hasMany(SupportMessage::class);
    }

    /** @return list<string> */
    public static function statuses(): array
    {
        return ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'];
    }

    /** @return list<string> */
    public static function priorities(): array
    {
        return ['low', 'medium', 'high', 'urgent'];
    }
}
