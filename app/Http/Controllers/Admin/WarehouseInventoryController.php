<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdjustWarehouseInventoryRequest;
use App\Models\Store;
use App\Models\User;
use App\Services\Admin\WarehouseOperationsService;
use Illuminate\Http\RedirectResponse;

class WarehouseInventoryController extends Controller
{
    public function __invoke(AdjustWarehouseInventoryRequest $request, Store $warehouse): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $this->service->adjust($warehouse, $actor, $request->validated());

        return back()->with('success', 'Warehouse inventory updated successfully.');
    }

    public function __construct(private readonly WarehouseOperationsService $service) {}
}
