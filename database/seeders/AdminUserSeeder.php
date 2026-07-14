<?php

namespace Database\Seeders;

use App\Models\AdminRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $administrator = User::query()->updateOrCreate(
            [
                'email' => 'admin@vendora.test',
            ],
            [
                'name' => 'Vendora Admin',
                'password' => 'Admin@12345',
                'role' => User::ROLE_ADMIN,
                'status' => true,
                'email_verified_at' => now(),
            ]
        );

        $superAdministrator = AdminRole::query()->where('slug', AdminRole::SUPER_ADMINISTRATOR_SLUG)->firstOrFail();
        $administrator->adminRoles()->sync([$superAdministrator->id]);
    }
}
