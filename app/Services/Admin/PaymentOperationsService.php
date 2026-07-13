<?php
namespace App\Services\Admin;
use App\Models\Payment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
class PaymentOperationsService
{
    /** @param array<string, mixed> $filters @return LengthAwarePaginator<int, Payment> */
    public function paginate(array $filters): LengthAwarePaginator { $search = trim((string) ($filters['search'] ?? '')); $status = (string) ($filters['status'] ?? ''); return Payment::query()->with(['order.user:id,name,email'])->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query->where('transaction_id', 'like', "%{$search}%")->orWhereHas('order', fn (Builder $query): Builder => $query->where('number', 'like', "%{$search}%"))))->when($status !== '', fn (Builder $query): Builder => $query->where('status', $status))->latest()->paginate(15)->withQueryString(); }
    /** @return array<string, int|float> */
    public function counts(): array { $row = Payment::query()->selectRaw('COUNT(*) total')->selectRaw("SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) paid")->selectRaw("SUM(CASE WHEN status IN ('refunded','partially_refunded') THEN 1 ELSE 0 END) refunded")->selectRaw("COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) collected")->toBase()->firstOrFail(); return ['total' => (int) $row->total, 'paid' => (int) $row->paid, 'refunded' => (int) $row->refunded, 'collected' => (float) $row->collected]; }
    /** @param array<string, mixed> $data */
    public function update(Payment $payment, array $data): Payment
    {
        if ((float) $data['refunded_amount'] > (float) $payment->amount) { throw ValidationException::withMessages(['refunded_amount' => 'The refund cannot exceed the captured payment.']); }
        DB::transaction(function () use ($payment, $data): void { $payment->update([...$data, 'paid_at' => $data['status'] === 'paid' ? ($payment->paid_at ?? now()) : $payment->paid_at, 'refunded_at' => in_array($data['status'], ['refunded', 'partially_refunded'], true) ? now() : null]); $payment->order()->update(['payment_status' => match ($data['status']) { 'paid' => 'paid', 'refunded', 'partially_refunded' => 'refunded', 'failed' => 'failed', default => 'pending' }]); });
        return $payment->fresh('order.user');
    }
}
