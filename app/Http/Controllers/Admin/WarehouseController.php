<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreWarehouseRequest;
use App\Http\Requests\Admin\UpdateWarehouseRequest;
use App\Models\Product;
use App\Models\Store;
use App\Services\Admin\WarehouseOperationsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    public function __construct(private readonly WarehouseOperationsService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/warehouses/index', [
            'warehouses' => $this->service->paginate($request->only(['search', 'status'])),
            'counts' => $this->service->counts(),
        ]);
    }

    public function create(): Response
    {
        return $this->form(new Store);
    }

    public function store(StoreWarehouseRequest $request): RedirectResponse
    {
        $warehouse = $this->service->create($request->validated());

        return to_route('admin.warehouses.show', $warehouse)->with('success', 'Warehouse created successfully.');
    }

    public function show(Store $warehouse): Response
    {
        $warehouse->load(['inventories' => fn ($query) => $query->with(['product:id,name,sku,stock', 'updatedBy:id,name'])->orderBy('bin_location')]);

        return Inertia::render('admin/warehouses/show', [
            'warehouse' => $warehouse,
            'products' => Product::query()->select(['id', 'name', 'sku'])->orderBy('name')->get(),
        ]);
    }

    public function edit(Store $warehouse): Response
    {
        return $this->form($warehouse);
    }

    public function update(UpdateWarehouseRequest $request, Store $warehouse): RedirectResponse
    {
        $this->service->update($warehouse, $request->validated());

        return to_route('admin.warehouses.show', $warehouse)->with('success', 'Warehouse updated successfully.');
    }

    public function destroy(Store $warehouse): RedirectResponse
    {
        $this->service->delete($warehouse);

        return to_route('admin.warehouses.index')->with('success', 'Warehouse deleted successfully.');
    }

    private function form(Store $warehouse): Response
    {
        return Inertia::render('admin/warehouses/form', ['warehouse' => $warehouse]);
    }
}
