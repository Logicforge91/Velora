<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\ProcessPaymentRequest;
use App\Services\Customer\CheckoutPaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(private readonly CheckoutPaymentService $service) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('customer/payments/index', [
            'amount' => CheckoutPaymentService::CHECKOUT_TOTAL,
            'paymentSessionId' => (string) Str::uuid(),
            'recentTransactions' => $this->service->recentTransactions($user),
            'receipt' => $this->service->ownedTransaction(
                $user,
                $request->string('receipt')->toString() ?: null,
            ),
        ]);
    }

    public function store(ProcessPaymentRequest $request): RedirectResponse
    {
        $transaction = $this->service->process($request->user(), $request->validated());

        if ($transaction->status !== 'failed') {
            return to_route('customer.orders.success', $transaction->payment->order)
                ->with('success', 'Order placed successfully.');
        }

        return to_route('customer.payments.index', ['receipt' => $transaction->uuid])
            ->with('error', 'Payment authentication failed. You can safely retry.');
    }
}
