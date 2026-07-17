<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\TeamInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()->isAdmin()) {
            return to_route('admin.dashboard');
        }

        $user = $request->user();
        $email = Str::lower($user->email);

        $orders = $user->orders();
        $activeStatuses = [
            Order::STATUS_PENDING,
            Order::STATUS_PROCESSING,
            Order::STATUS_SHIPPED,
        ];

        $pendingInvitations = TeamInvitation::query()
            ->with(['inviter', 'team'])
            ->whereRaw('LOWER(email) = ?', [$email])
            ->whereNull('accepted_at')
            ->where(fn ($query) => $query
                ->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now()))
            ->latest()
            ->get()
            ->map(fn (TeamInvitation $invitation) => [
                'code' => $invitation->code,
                'inviterName' => $invitation->inviter->name,
                'team' => [
                    'name' => $invitation->team->name,
                    'slug' => $invitation->team->slug,
                ],
            ]);

        return Inertia::render('dashboard', [
            'pendingInvitations' => $pendingInvitations,
            'orderSummary' => [
                'total' => (clone $orders)->count(),
                'active' => (clone $orders)->whereIn('status', $activeStatuses)->count(),
                'delivered' => (clone $orders)->where('status', Order::STATUS_DELIVERED)->count(),
                'spent' => (float) (clone $orders)
                    ->where('status', Order::STATUS_DELIVERED)
                    ->sum('total'),
            ],
            'recentOrders' => (clone $orders)
                ->select(['id', 'user_id', 'number', 'status', 'total', 'placed_at', 'created_at'])
                ->with([
                    'items:id,order_id,product_name,quantity',
                    'shipment:id,order_id,status,estimated_delivery_at',
                ])
                ->latest('placed_at')
                ->limit(4)
                ->get()
                ->map(fn (Order $order) => [
                    'id' => $order->id,
                    'number' => $order->number,
                    'status' => $order->status,
                    'total' => (float) $order->total,
                    'placedAt' => ($order->placed_at ?? $order->created_at)->toDateString(),
                    'itemCount' => $order->items->sum('quantity'),
                    'itemPreview' => $order->items->first()?->product_name ?? 'Velora order',
                    'shipment' => $order->shipment ? [
                        'status' => $order->shipment->status,
                        'estimatedDelivery' => $order->shipment->estimated_delivery_at?->toDateString(),
                    ] : null,
                ]),
        ]);
    }
}
