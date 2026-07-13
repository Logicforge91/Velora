<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateShipmentRequest;
use App\Models\Shipment;
use App\Services\Admin\ShipmentOperationsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShipmentController extends Controller
{
    public function __construct(private readonly ShipmentOperationsService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/shipments/index', ['shipments' => $this->service->paginate($request->only(['search', 'status'])), 'counts' => $this->service->counts()]);
    }

    public function update(UpdateShipmentRequest $request, Shipment $shipment): RedirectResponse
    {
        $this->service->update($shipment, $request->validated());

        return back()->with('success', 'Shipment updated successfully.');
    }
}
