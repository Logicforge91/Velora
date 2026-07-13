<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePaymentRequest;
use App\Models\Payment;
use App\Services\Admin\PaymentOperationsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentOperationsService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/payments/index', ['payments' => $this->service->paginate($request->only(['search', 'status'])), 'counts' => $this->service->counts()]);
    }

    public function update(UpdatePaymentRequest $request, Payment $payment): RedirectResponse
    {
        $this->service->update($payment, $request->validated());

        return back()->with('success', 'Payment record updated successfully.');
    }
}
