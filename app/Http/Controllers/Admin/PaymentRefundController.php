<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePaymentRefundRequest;
use App\Models\PaymentRefund;
use App\Services\Admin\MarketplaceOperationsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentRefundController extends Controller
{
    public function __construct(private readonly MarketplaceOperationsService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/payment-refunds/index', [
            'refunds' => $this->service->paymentRefunds($request->only(['search', 'status'])),
            'counts' => $this->service->paymentRefundCounts(),
        ]);
    }

    public function update(UpdatePaymentRefundRequest $request, PaymentRefund $paymentRefund): RedirectResponse
    {
        $this->service->updatePaymentRefund($paymentRefund, $request->user(), $request->validated());

        return back()->with('success', 'Refund workflow updated successfully.');
    }
}
