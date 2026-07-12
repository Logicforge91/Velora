<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
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
    }
}
