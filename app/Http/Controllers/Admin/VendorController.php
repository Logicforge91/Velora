<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectVendorRequest;
use App\Http\Requests\Admin\StoreVendorRequest;
use App\Http\Requests\Admin\UpdateVendorRiskRequest;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorKycDocument;
use App\Services\Admin\VendorManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function __construct(
        private readonly VendorManagementService $vendorService
    ) {}

    public function create(): Response
    {
        return Inertia::render('admin/vendors/create');
    }

    public function store(StoreVendorRequest $request): RedirectResponse
    {
        /** @var User $admin */
        $admin = $request->user();
        $vendor = $this->vendorService->create($request->validated(), $admin);

        return redirect()
            ->route('admin.vendors.show', $vendor)
            ->with('success', 'Seller application created successfully.');
    }

    public function index(Request $request): Response
    {
        return Inertia::render('admin/vendors/index', [
            'vendors' => $this->vendorService->getVendors(
                $request->only([
                    'search',
                    'status',
                    'kyc_status',
                    'risk_level',
                ])
            ),

            'counts' => $this->vendorService->getStatusCounts(),
        ]);
    }

    public function show(Vendor $vendor): Response
    {
        $vendor->load([
            'user:id,name,email,status,role,created_at',
            'approvedBy:id,name,email',
            'kycVerifiedBy:id,name,email',
            'kycDocuments.uploader:id,name,email',
            'kycDocuments.reviewer:id,name,email',
            'reviewEvents.actor:id,name,email',
        ]);

        return Inertia::render('admin/vendors/show', [
            'vendor' => $vendor,
            'documentTypes' => VendorKycDocument::types(),
            'requiredDocumentTypes' => VendorManagementService::REQUIRED_KYC_TYPES,
        ]);
    }

    public function updateRisk(UpdateVendorRiskRequest $request, Vendor $vendor): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $this->vendorService->updateRisk($vendor, $actor, $request->validated());

        return back()->with('success', 'Seller risk assessment updated.');
    }

    public function approve(
        Request $request,
        Vendor $vendor
    ): RedirectResponse {
        $this->vendorService->approve(
            vendor: $vendor,
            admin: $request->user(),
        );

        return redirect()
            ->route('admin.vendors.show', $vendor)
            ->with(
                'success',
                'Vendor application approved successfully.'
            );
    }

    public function reject(
        RejectVendorRequest $request,
        Vendor $vendor
    ): RedirectResponse {
        $this->vendorService->reject(
            vendor: $vendor,
            admin: $request->user(),
            rejectionReason: $request->validated('rejection_reason'),
        );

        return redirect()
            ->route('admin.vendors.show', $vendor)
            ->with(
                'success',
                'Vendor application rejected successfully.'
            );
    }
}
