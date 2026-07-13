<?php

namespace Database\Seeders;

use App\Models\CatalogImport;
use Illuminate\Database\Seeder;

class CatalogImportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CatalogImport::factory()->count(5)->create();
    }
}
