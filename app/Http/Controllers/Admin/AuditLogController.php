<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AccountPermission;
use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\User;
use App\Services\Admin\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function __construct(private readonly AuditLogService $service) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()?->hasPermission(AccountPermission::ViewReports), 403);

        return Inertia::render('admin/audit-logs/index', [
            'logs' => $this->service->paginate($request->only(['search', 'category', 'severity', 'actor_id', 'date_from', 'date_to'])),
            'counts' => $this->service->counts(),
            'categories' => AdminAuditLog::query()->distinct()->orderBy('category')->pluck('category'),
            'actors' => User::query()->select(['id', 'name', 'email'])->whereHas('adminAuditLogs')->orderBy('name')->get(),
        ]);
    }

    public function show(Request $request, AdminAuditLog $auditLog): Response
    {
        abort_unless($request->user()?->hasPermission(AccountPermission::ViewReports), 403);
        $auditLog->load('actor:id,name,email');

        return Inertia::render('admin/audit-logs/show', ['log' => $auditLog, 'isAuthentic' => $this->service->isAuthentic($auditLog)]);
    }
}
