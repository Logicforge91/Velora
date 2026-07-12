<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AdminDashboardService;
use Illuminate\Contracts\View\View;

class DashboardController extends Controller
{
    public function __invoke(
        AdminDashboardService $dashboardService
    ): View {
        return view('admin.dashboard', [
            'statistics' => $dashboardService->getStatistics(),
            'recentUsers' => $dashboardService->getRecentUsers(),
        ]);
    }
}
