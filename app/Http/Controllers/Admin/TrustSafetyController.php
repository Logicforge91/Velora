<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TrustSafetyIndexRequest;
use App\Http\Requests\Admin\UpdateTrustSafetyCaseRequest;
use App\Models\TrustSafetyCase;
use App\Models\User;
use App\Services\Admin\TrustSafetyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TrustSafetyController extends Controller
{
    public function __construct(private readonly TrustSafetyService $service) {}

    public function __invoke(TrustSafetyIndexRequest $request): Response
    {
        return Inertia::render('admin/trust-safety/index', $this->service->workspace($request->validated()));
    }

    public function update(UpdateTrustSafetyCaseRequest $request, TrustSafetyCase $trustSafetyCase): RedirectResponse
    {
        $reviewer = $request->user();

        abort_unless($reviewer instanceof User, 403);

        $this->service->review($trustSafetyCase, $request->validated(), $reviewer);

        return back()->with('success', 'Trust and safety case updated.');
    }
}
