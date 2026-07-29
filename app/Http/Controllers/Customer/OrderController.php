<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\ReportOrderIssueRequest;
use App\Http\Requests\Customer\UpdateOrderInstructionsRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Customer\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $service) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Order::class);

        return Inertia::render('customer/orders/index', [
            'orders' => $request->user()->orders()
                ->with(['items.vendor:id,business_name,business_email', 'shipment', 'payment'])
                ->latest()
                ->paginate(10),
        ]);
    }

    public function show(Order $order): Response
    {
        Gate::authorize('view', $order);

        return Inertia::render('customer/orders/show', [
            'order' => $this->loadOrder($order),
        ]);
    }

    public function success(Order $order): Response
    {
        Gate::authorize('view', $order);

        return Inertia::render('customer/orders/success', [
            'order' => $this->loadOrder($order),
        ]);
    }

    public function reorder(Order $order): RedirectResponse
    {
        Gate::authorize('view', $order);
        $productSlug = $order->items()->with('product:id,slug')->first()?->product?->slug;

        return to_route('storefront.cart', $productSlug ? ['add' => $productSlug] : [])
            ->with('success', 'Available items were added to your cart.');
    }

    public function cancel(Order $order): RedirectResponse
    {
        Gate::authorize('delete', $order);
        $this->service->cancel($order);

        return back()->with('success', 'Order cancelled.');
    }

    public function cancelItem(Order $order, OrderItem $orderItem): RedirectResponse
    {
        Gate::authorize('update', $order);
        $this->service->cancelItem($order, $orderItem);

        return back()->with('success', 'Order item cancelled.');
    }

    public function updateInstructions(UpdateOrderInstructionsRequest $request, Order $order): RedirectResponse
    {
        $this->service->updateInstructions($order, $request->validated('delivery_instructions'));

        return back()->with('success', 'Delivery instructions updated.');
    }

    public function reportIssue(ReportOrderIssueRequest $request, Order $order): RedirectResponse
    {
        $ticket = $this->service->reportIssue($request->user(), $order, $request->validated());

        return back()->with('success', "Support ticket {$ticket->number} created.");
    }

    public function invoice(Order $order): StreamedResponse
    {
        Gate::authorize('view', $order);

        return response()->streamDownload(
            fn () => print ($this->document($order, 'TAX INVOICE')),
            "{$order->number}-invoice.txt",
            ['Content-Type' => 'text/plain'],
        );
    }

    public function receipt(Order $order): StreamedResponse
    {
        Gate::authorize('view', $order);

        return response()->streamDownload(
            fn () => print ($this->document($order, 'PAYMENT RECEIPT')),
            "{$order->number}-receipt.txt",
            ['Content-Type' => 'text/plain'],
        );
    }

    private function loadOrder(Order $order): Order
    {
        return $order->load([
            'items.product:id,slug',
            'items.vendor:id,business_name,business_email',
            'shipment.events',
            'payment.transactions',
            'taxInvoices',
        ]);
    }

    private function document(Order $order, string $title): string
    {
        return implode(PHP_EOL, [
            "VELORA {$title}",
            "Order: {$order->number}",
            "Placed: {$order->placed_at?->toDateTimeString()}",
            "Payment: {$order->payment_status}",
            "Subtotal: INR {$order->subtotal}",
            "Shipping: INR {$order->shipping_total}",
            "Tax: INR {$order->tax_total}",
            "Total: INR {$order->total}",
        ]);
    }
}
