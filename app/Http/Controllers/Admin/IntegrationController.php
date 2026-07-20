<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateIntegrationRequest;
use App\Services\Admin\IntegrationManagementService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class IntegrationController extends Controller
{
    public function __construct(private readonly IntegrationManagementService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/integrations/index', [
            'definitions' => $this->service->definitions(),
            'integrations' => $this->service->integrations(),
            'logs' => $this->service->logs(),
        ]);
    }

    public function update(UpdateIntegrationRequest $request, string $category): RedirectResponse
    {
        $this->service->update($category, $request->validated(), $request->user());

        return back()->with('success', 'Integration settings updated successfully.');
    }
}
