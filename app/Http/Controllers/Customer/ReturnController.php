<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\CancelReturnRequest;
use App\Http\Requests\Customer\StoreReturnRequest;
use App\Models\ReturnCase;
use App\Services\Customer\ReturnService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReturnController extends Controller
{
    public function __construct(private readonly ReturnService $service) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('customer/returns/index', [
            'returns' => ReturnCase::query()
                ->with(['order:id,number', 'orderItem:id,product_name,variant_name,total', 'paymentRefunds:id,return_case_id,number,amount,status,requested_at,processed_at'])
                ->whereBelongsTo($user, 'customer')
                ->latest()
                ->get(),
            'eligibleItems' => $user->orders()
                ->with(['items' => fn ($query) => $query->whereNot('fulfilment_status', 'cancelled')])
                ->where('status', 'delivered')
                ->latest()
                ->get(['id', 'number'])
                ->flatMap(fn ($order) => $order->items->map(fn ($item): array => [
                    'id' => $item->id,
                    'order_number' => $order->number,
                    'product_name' => $item->product_name,
                    'variant_name' => $item->variant_name,
                    'return_eligible_until' => $item->return_eligible_until,
                ]))
                ->values(),
            'addresses' => $user->addresses()->where('is_serviceable', true)->get(),
        ]);
    }

    public function store(StoreReturnRequest $request): RedirectResponse
    {
        $this->service->create(
            $request->user(),
            $request->validated(),
            $request->file('images', []),
            $request->file('video'),
        );

        return back()->with('success', 'Your request was submitted and pickup tracking is ready.');
    }

    public function cancel(CancelReturnRequest $request, ReturnCase $returnCase): RedirectResponse
    {
        $this->service->cancel($returnCase);

        return back()->with('success', 'Return request cancelled.');
    }
}
