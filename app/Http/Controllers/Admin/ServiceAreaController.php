<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceAreaRequest;
use App\Http\Requests\Admin\UpdateServiceAreaRequest;
use App\Models\ServiceArea;
use App\Models\Store;
use App\Services\Admin\MarketplaceOperationsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceAreaController extends Controller
{
    public function __construct(private readonly MarketplaceOperationsService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/service-areas/index', [
            'serviceAreas' => $this->service->serviceAreas($request->only(['search', 'status'])),
            'stores' => Store::query()->select(['id', 'name', 'code'])->where('status', true)->orderBy('name')->get(),
        ]);
    }

    public function store(StoreServiceAreaRequest $request): RedirectResponse
    {
        $this->service->createServiceArea($request->validated());

        return back()->with('success', 'Delivery coverage added successfully.');
    }

    public function update(UpdateServiceAreaRequest $request, ServiceArea $serviceArea): RedirectResponse
    {
        $this->service->updateServiceArea($serviceArea, $request->validated());

        return back()->with('success', 'Delivery coverage updated successfully.');
    }

    public function destroy(ServiceArea $serviceArea): RedirectResponse
    {
        $serviceArea->delete();

        return back()->with('success', 'Delivery coverage removed successfully.');
    }
}
