<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSettlementRequest;
use App\Http\Requests\Admin\UpdateSettlementRequest;
use App\Models\Settlement;
use App\Models\User;
use App\Models\Vendor;
use App\Services\Admin\SettlementOperationsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettlementController extends Controller
{
    public function __construct(private readonly SettlementOperationsService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/settlements/index', ['settlements' => $this->service->paginate($request->only(['search', 'status'])), 'counts' => $this->service->counts(), 'statuses' => Settlement::statuses()]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/settlements/create', ['vendors' => Vendor::query()->select(['id', 'business_name', 'commission_rate', 'settlement_cycle'])->where('status', Vendor::STATUS_APPROVED)->orderBy('business_name')->get()]);
    }

    public function store(StoreSettlementRequest $request): RedirectResponse
    {
        $settlement = $this->service->create($request->validated());

        return to_route('admin.settlements.show', $settlement)->with('success', 'Seller settlement generated successfully.');
    }

    public function show(Settlement $settlement): Response
    {
        $settlement->load(['vendor.user:id,name,email', 'approver:id,name']);

        return Inertia::render('admin/settlements/show', ['settlement' => $settlement, 'statuses' => Settlement::statuses()]);
    }

    public function update(UpdateSettlementRequest $request, Settlement $settlement): RedirectResponse
    { /** @var User $actor */ $actor = $request->user();
        $this->service->update($settlement, $actor, $request->validated());

        return back()->with('success', 'Settlement workflow updated.');
    }
}
