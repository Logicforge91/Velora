<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSellerListingRequest;
use App\Models\SellerListing;
use App\Services\Admin\MarketplaceOperationsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SellerListingController extends Controller
{
    public function __construct(private readonly MarketplaceOperationsService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/seller-listings/index', [
            'listings' => $this->service->sellerListings($request->only(['search', 'status'])),
            'counts' => $this->service->sellerListingCounts(),
        ]);
    }

    public function update(UpdateSellerListingRequest $request, SellerListing $sellerListing): RedirectResponse
    {
        $this->service->updateSellerListing($sellerListing, $request->user(), $request->validated());

        return back()->with('success', 'Seller listing updated successfully.');
    }
}
