<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Services\Admin\OrderManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderManagementService $orderService
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/orders/index', [
            'orders' => $this->orderService->getOrders($request->only(['search', 'status', 'payment_status'])),
            'counts' => $this->orderService->getCounts(),
            'statuses' => Order::statuses(),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user:id,name,email', 'items.product.primaryImage']);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'statuses' => Order::statuses(),
        ]);
    }

    public function update(UpdateOrderStatusRequest $request, Order $order): RedirectResponse
    {
        $data = $request->validated();
        $this->orderService->updateStatus($order, $request->user(), $data['status'], $data['payment_status']);

        return to_route('admin.orders.show', $order)->with('success', 'Order status updated successfully.');
    }
}
