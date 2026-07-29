<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AnalyticsReportRequest;
use App\Services\Admin\AnalyticsService;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __invoke(AnalyticsReportRequest $request, AnalyticsService $analytics): Response
    {
        return Inertia::render('admin/analytics', $analytics->getReport($request->validated()));
    }
}
