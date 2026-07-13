<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AnalyticsService;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __invoke(AnalyticsService $analytics): Response
    {
        return Inertia::render('admin/analytics', $analytics->getReport());
    }
}
