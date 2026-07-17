<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ApplyPriceRecommendationRequest;
use App\Models\Product;
use App\Services\Admin\GrowthCentreService;
use Illuminate\Http\RedirectResponse;

class ApplyPriceRecommendationController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        ApplyPriceRecommendationRequest $request,
        Product $product,
        GrowthCentreService $service,
    ): RedirectResponse {
        $service->applyPriceRecommendation($product);

        return back()->with('success', 'Recommended price applied successfully.');
    }
}
