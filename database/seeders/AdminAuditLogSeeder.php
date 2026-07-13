<?php

namespace Database\Seeders;

use App\Models\AdminAuditLog;
use Illuminate\Database\Seeder;

class AdminAuditLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AdminAuditLog::factory()->count(25)->create();
    }
}
