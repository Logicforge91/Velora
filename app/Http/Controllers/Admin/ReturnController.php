<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreReturnRequest;
use App\Http\Requests\Admin\UpdateReturnRequest;
use App\Models\Order;
use App\Models\ReturnCase;
use App\Models\User;
use App\Services\Admin\ReturnOperationsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReturnController extends Controller
{
    public function __construct(private readonly ReturnOperationsService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/returns/index', [
            'returns' => $this->service->paginate($request->only(['search', 'status', 'type'])),
            'counts' => $this->service->counts(),
            'statuses' => ReturnCase::statuses(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/returns/create', [
            'orders' => Order::query()
                ->select(['id', 'user_id', 'number', 'total', 'placed_at'])
                ->with([
                    'user:id,name,email',
                    'items:id,order_id,product_name,sku,quantity,total',
                ])
                ->latest('placed_at')
                ->limit(100)
                ->get(),
        ]);
    }

    public function store(StoreReturnRequest $request): RedirectResponse
    {
        $returnCase = $this->service->create($request->validated());

        return to_route('admin.returns.show', $returnCase)
            ->with('success', 'Return case created successfully.');
    }

    public function show(ReturnCase $return): Response
    {
        $return->load([
            'order.payment',
            'order.shipment',
            'customer',
            'orderItem.product.primaryImage',
            'processor',
        ]);

        return Inertia::render('admin/returns/show', [
            'returnCase' => $return,
            'statuses' => ReturnCase::statuses(),
        ]);
    }

    public function update(UpdateReturnRequest $request, ReturnCase $return): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $this->service->update($return, $actor, $request->validated());

        return back()->with('success', 'Return case updated successfully.');
    }
}
