<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectVendorRequest;
use App\Models\Vendor;
use App\Services\Admin\VendorManagementService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function __construct(
        private readonly VendorManagementService $vendorService
    ) {
    }

    public function index(Request $request): View
    {
        return view('admin.vendors.index', [
            'vendors' => $this->vendorService->getVendors(
                $request->only([
                    'search',
                    'status',
                ])
            ),

            'counts' => $this->vendorService->getStatusCounts(),
        ]);
    }

    public function show(Vendor $vendor): View
    {
        $vendor->load([
            'user:id,name,email,status,role,created_at',
            'approvedBy:id,name,email',
        ]);

        return view('admin.vendors.show', [
            'vendor' => $vendor,
        ]);
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
            rejectionReason:
                $request->validated('rejection_reason'),
        );

        return redirect()
            ->route('admin.vendors.show', $vendor)
            ->with(
                'success',
                'Vendor application rejected successfully.'
            );
    }
}
