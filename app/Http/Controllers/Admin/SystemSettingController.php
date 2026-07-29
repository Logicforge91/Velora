<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AccountPermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSystemSettingRequest;
use App\Services\Admin\SystemSettingsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemSettingController extends Controller
{
    public function __construct(private readonly SystemSettingsService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/system-settings/index', [
            'definitions' => $this->service->definitions(),
            'settings' => $this->service->values(),
            'operations' => $this->service->operations(),
        ]);
    }

    public function update(UpdateSystemSettingRequest $request, string $group): RedirectResponse
    {
        $this->service->update($group, $request->validated('settings'), $request->user());

        return back()->with('success', 'System settings updated successfully.');
    }

    public function clearCache(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->hasPermission(AccountPermission::ManageRoles), 403);
        $this->service->clearCache();

        return back()->with('success', 'Application cache cleared successfully.');
    }

    public function backup(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->hasPermission(AccountPermission::ManageRoles), 403);
        $filename = $this->service->createDatabaseBackup();

        return back()->with('success', "Database backup {$filename} created successfully.");
    }
}
