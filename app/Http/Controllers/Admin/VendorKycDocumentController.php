<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReviewVendorKycDocumentRequest;
use App\Http\Requests\Admin\StoreVendorKycDocumentRequest;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorKycDocument;
use App\Services\Admin\VendorManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VendorKycDocumentController extends Controller
{
    public function __construct(private readonly VendorManagementService $service) {}

    public function store(StoreVendorKycDocumentRequest $request, Vendor $vendor): RedirectResponse
    {
        $file = $request->file('document');
        abort_unless($file instanceof UploadedFile, 422);
        /** @var User $actor */
        $actor = $request->user();
        $this->service->storeDocument($vendor, $actor, $file, $request->safe()->except('document'));

        return back()->with('success', 'KYC document uploaded for review.');
    }

    public function update(ReviewVendorKycDocumentRequest $request, Vendor $vendor, VendorKycDocument $kycDocument): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $this->service->reviewDocument($vendor, $kycDocument, $actor, $request->validated());

        return back()->with('success', 'KYC document review saved.');
    }

    public function download(Request $request, Vendor $vendor, VendorKycDocument $kycDocument): StreamedResponse
    {
        abort_unless($request->user()?->can('vendors.manage'), 403);
        abort_unless($kycDocument->vendor_id === $vendor->id && Storage::disk('local')->exists($kycDocument->file_path), 404);

        return Storage::disk('local')->download($kycDocument->file_path, $kycDocument->original_name, ['Content-Type' => $kycDocument->mime_type]);
    }
}
