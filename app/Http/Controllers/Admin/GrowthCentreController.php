<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\GrowthCentreService;
use Inertia\Inertia;
use Inertia\Response;

class GrowthCentreController extends Controller
{
    public function __invoke(GrowthCentreService $service): Response
    {
        return Inertia::render('admin/growth-centre', [
            'overview' => $service->overview(),
            'sellerPerformance' => $service->sellerPerformance(),
            'priceRecommendations' => $service->priceRecommendations(),
            'catalogueAlerts' => $service->catalogueAlerts(),
        ]);
    }
}
