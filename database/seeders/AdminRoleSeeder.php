<?php

namespace Database\Seeders;

use App\Enums\AccountPermission;
use App\Models\AdminRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            AdminRole::SUPER_ADMINISTRATOR_SLUG => ['Super Administrator', AccountPermission::assignableToAdmin()],
            'catalogue-manager' => ['Catalogue Manager', [AccountPermission::AccessAdminDashboard, AccountPermission::ManageCatalogue]],
            'operations-manager' => ['Operations Manager', [AccountPermission::AccessAdminDashboard, AccountPermission::ManageOrders, AccountPermission::HandleSupportRequests]],
            'finance-manager' => ['Finance Manager', [AccountPermission::AccessAdminDashboard, AccountPermission::ManagePayments, AccountPermission::ViewReports]],
            'user-administrator' => ['User Administrator', [AccountPermission::AccessAdminDashboard, AccountPermission::ManageUsers, AccountPermission::ManageRoles]],
        ];

        foreach ($roles as $slug => [$name, $permissions]) {
            AdminRole::query()->updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'permissions' => array_map(fn (AccountPermission $permission): string => $permission->value, $permissions), 'is_system' => true],
            );
        }

        $superAdministrator = AdminRole::query()->where('slug', AdminRole::SUPER_ADMINISTRATOR_SLUG)->firstOrFail();

        User::query()
            ->where('role', User::ROLE_ADMIN)
            ->whereDoesntHave('adminRoles')
            ->chunkById(200, function ($administrators) use ($superAdministrator): void {
                foreach ($administrators as $administrator) {
                    $administrator->adminRoles()->attach($superAdministrator);
                }
            });
    }
}
