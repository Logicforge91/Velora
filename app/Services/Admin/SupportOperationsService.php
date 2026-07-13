<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SupportOperationsService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, SupportTicket>
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');
        $priority = (string) ($filters['priority'] ?? '');

        return SupportTicket::query()->with(['customer:id,name,email', 'order:id,number', 'assignee:id,name'])->withCount('messages')->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query->where('number', 'like', "%{$search}%")->orWhere('subject', 'like', "%{$search}%")->orWhereHas('customer', fn (Builder $query): Builder => $query->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))))->when(in_array($status, SupportTicket::statuses(), true), fn (Builder $query): Builder => $query->where('status', $status))->when(in_array($priority, SupportTicket::priorities(), true), fn (Builder $query): Builder => $query->where('priority', $priority))->orderByRaw("FIELD(priority, 'urgent', 'high', 'medium', 'low')")->latest()->paginate(20)->withQueryString();
    }

    /** @return array<string, int> */
    public function counts(): array
    {
        return ['open' => SupportTicket::query()->whereIn('status', ['open', 'in_progress'])->count(), 'unassigned' => SupportTicket::query()->whereNull('assigned_to')->whereNotIn('status', ['resolved', 'closed'])->count(), 'overdue' => SupportTicket::query()->whereNotIn('status', ['resolved', 'closed'])->where('resolution_due_at', '<', now())->count(), 'resolved_today' => SupportTicket::query()->whereDate('resolved_at', today())->count()];
    }

    /** @param array<string, mixed> $data */
    public function create(array $data): SupportTicket
    {
        if (! empty($data['order_id']) && ! Order::query()->whereKey($data['order_id'])->where('user_id', $data['customer_id'])->exists()) {
            throw ValidationException::withMessages(['order_id' => 'The selected order does not belong to this customer.']);
        }
        $hours = match ($data['priority']) {
            'urgent' => 4, 'high' => 12, 'medium' => 24, default => 48
        };

        return DB::transaction(function () use ($data, $hours): SupportTicket {
            $ticket = SupportTicket::query()->create([...$data, 'number' => 'TKT-'.now()->format('Ym').'-'.Str::upper(Str::random(8)), 'first_response_due_at' => now()->addHours(max(1, intdiv($hours, 4))), 'resolution_due_at' => now()->addHours($hours)]);
            $ticket->messages()->create(['user_id' => $ticket->customer_id, 'body' => $ticket->description, 'is_internal' => false]);

            return $ticket;
        });
    }

    /** @param array<string, mixed> $data */
    public function update(SupportTicket $ticket, array $data): SupportTicket
    {
        $transitions = ['open' => ['open', 'in_progress', 'waiting_customer', 'resolved'], 'in_progress' => ['in_progress', 'waiting_customer', 'resolved'], 'waiting_customer' => ['waiting_customer', 'in_progress', 'resolved'], 'resolved' => ['resolved', 'in_progress', 'closed'], 'closed' => ['closed']];
        if (! in_array($data['status'], $transitions[$ticket->status] ?? [], true)) {
            throw ValidationException::withMessages(['status' => "Ticket cannot move from {$ticket->status} to {$data['status']}."]);
        }
        $ticket->update([...$data, 'resolved_at' => $data['status'] === 'resolved' ? now() : ($data['status'] === 'in_progress' ? null : $ticket->resolved_at), 'closed_at' => $data['status'] === 'closed' ? now() : null]);

        return $ticket->fresh(['customer', 'order', 'assignee']);
    }

    /** @param array<string, mixed> $data */
    public function addMessage(SupportTicket $ticket, User $actor, array $data): SupportMessage
    {
        return DB::transaction(function () use ($ticket, $actor, $data): SupportMessage {
            $message = $ticket->messages()->create([...$data, 'user_id' => $actor->id]);
            if (! $data['is_internal'] && ! $ticket->first_responded_at) {
                $ticket->update(['first_responded_at' => now(), 'status' => $ticket->status === 'open' ? 'in_progress' : $ticket->status]);
            }

            return $message->load('user');
        });
    }
}
