<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AccountPermission;
use App\Enums\AccountRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminRoleRequest;
use App\Http\Requests\Admin\UpdateAdminRoleRequest;
use App\Models\AdminRole;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminRoleController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize(AccountPermission::ManageRoles->value);

        return Inertia::render('admin/admin-roles/index', [
            'roles' => AdminRole::query()
                ->with('users:id,name,email')
                ->withCount('users')
                ->latest()
                ->paginate(15),
            'counts' => [
                'roles' => AdminRole::query()->count(),
                'assigned_admins' => User::query()->where('role', AccountRole::Admin->value)->whereHas('adminRoles')->count(),
                'unassigned_admins' => User::query()->where('role', AccountRole::Admin->value)->whereDoesntHave('adminRoles')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize(AccountPermission::ManageRoles->value);

        return $this->formResponse(new AdminRole(['permissions' => [AccountPermission::AccessAdminDashboard->value]]));
    }

    public function store(StoreAdminRoleRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $role = DB::transaction(function () use ($data): AdminRole {
            $role = AdminRole::query()->create(collect($data)->except('user_ids')->all());
            $this->syncUsers($role, $data['user_ids']);

            return $role;
        });

        return to_route('admin.admin-roles.edit', $role)->with('success', 'Admin role created successfully.');
    }

    public function edit(AdminRole $adminRole): Response
    {
        Gate::authorize(AccountPermission::ManageRoles->value);

        return $this->formResponse($adminRole->load('users:id,name,email'));
    }

    public function update(UpdateAdminRoleRequest $request, AdminRole $adminRole): RedirectResponse
    {
        $data = $request->validated();
        DB::transaction(function () use ($adminRole, $data): void {
            $adminRole->update(collect($data)->except('user_ids')->all());
            $this->syncUsers($adminRole, $data['user_ids']);
        });

        return to_route('admin.admin-roles.edit', $adminRole)->with('success', 'Admin role updated successfully.');
    }

    public function destroy(AdminRole $adminRole): RedirectResponse
    {
        Gate::authorize(AccountPermission::ManageRoles->value);

        if ($adminRole->is_system || $adminRole->users()->exists()) {
            throw ValidationException::withMessages(['role' => 'System or assigned roles cannot be deleted.']);
        }

        $adminRole->delete();

        return to_route('admin.admin-roles.index')->with('success', 'Admin role deleted successfully.');
    }

    private function formResponse(AdminRole $adminRole): Response
    {
        return Inertia::render('admin/admin-roles/form', [
            'adminRole' => $adminRole,
            'permissions' => collect(AccountPermission::assignableToAdmin())->map(fn (AccountPermission $permission): array => [
                'value' => $permission->value,
                'label' => $permission->label(),
            ]),
            'admins' => User::query()
                ->select(['id', 'name', 'email'])
                ->where('role', AccountRole::Admin->value)
                ->whereKeyNot(auth()->id())
                ->orderBy('name')
                ->get(),
        ]);
    }

    /** @param list<int> $userIds */
    private function syncUsers(AdminRole $adminRole, array $userIds): void
    {
        $removedUserIds = $adminRole->users()->whereNotIn('users.id', $userIds)->pluck('users.id');
        $adminRole->users()->detach($removedUserIds);

        User::query()
            ->whereKey($userIds)
            ->each(fn (User $user) => $user->adminRoles()->sync([$adminRole->id]));
    }
}
