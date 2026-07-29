<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreNotificationRuleRequest;
use App\Http\Requests\Admin\StoreNotificationTemplateRequest;
use App\Services\Admin\NotificationManagementService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NotificationManagementController extends Controller
{
    public function __construct(private readonly NotificationManagementService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/notifications/index', [
            'counts' => $this->service->counts(),
            'templates' => $this->service->templates(),
            'rules' => $this->service->rules(),
            'history' => $this->service->deliveries(),
            'failed' => $this->service->deliveries(true),
        ]);
    }

    public function storeTemplate(StoreNotificationTemplateRequest $request): RedirectResponse
    {
        $this->service->saveTemplate($request->validated(), $request->user());

        return back()->with('success', 'Notification template saved successfully.');
    }

    public function storeRule(StoreNotificationRuleRequest $request): RedirectResponse
    {
        $this->service->saveRule($request->validated(), $request->user());

        return back()->with('success', 'Notification rule saved successfully.');
    }
}
