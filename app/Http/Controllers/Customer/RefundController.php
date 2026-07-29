<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\RetryRefundRequest;
use App\Http\Requests\Customer\StoreRefundRequest;
use App\Models\PaymentRefund;
use App\Services\Customer\RefundService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RefundController extends Controller
{
    public function __construct(private readonly RefundService $service) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('customer/refunds/index', [
            'orders' => $user->orders()
                ->with(['payment.refunds'])
                ->whereHas('payment', fn ($query) => $query->whereIn('status', ['paid', 'partially_refunded']))
                ->latest()
                ->get(['id', 'number', 'total', 'payment_status']),
            'refunds' => PaymentRefund::query()
                ->with('payment.order:id,number,user_id')
                ->whereHas('payment.order', fn ($query) => $query->whereBelongsTo($user))
                ->latest()
                ->get(),
        ]);
    }

    public function store(StoreRefundRequest $request): RedirectResponse
    {
        $refund = $this->service->create($request->user(), $request->validated());

        return back()->with('success', "Refund {$refund->number} initiated.");
    }

    public function retry(RetryRefundRequest $request, PaymentRefund $paymentRefund): RedirectResponse
    {
        $refund = $this->service->retry($request->user(), $paymentRefund, $request->validated());

        return back()->with('success', "Refund retry {$refund->number} initiated.");
    }
}
