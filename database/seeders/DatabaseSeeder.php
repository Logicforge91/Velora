<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminRoleSeeder::class,
            AdminUserSeeder::class,
            ProductSeeder::class,
            AdvancedMarketplaceSeeder::class,
        ]);
    }
}
