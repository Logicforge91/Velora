<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReleaseInventoryReservationRequest;
use App\Models\InventoryReservation;
use App\Services\Admin\MarketplaceOperationsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryOperationController extends Controller
{
    public function __construct(private readonly MarketplaceOperationsService $service) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'type', 'reservation_status']);

        return Inertia::render('admin/inventory-operations/index', [
            'movements' => $this->service->inventoryMovements($filters),
            'reservations' => $this->service->inventoryReservations($filters),
        ]);
    }

    public function release(ReleaseInventoryReservationRequest $request, InventoryReservation $inventoryReservation): RedirectResponse
    {
        $this->service->releaseReservation($inventoryReservation, $request->validated('release_reason'));

        return back()->with('success', 'Inventory reservation released successfully.');
    }
}
