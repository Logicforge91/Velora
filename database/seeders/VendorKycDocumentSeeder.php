<?php

namespace Database\Seeders;

use App\Models\VendorKycDocument;
use Illuminate\Database\Seeder;

class VendorKycDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VendorKycDocument::factory()->count(10)->create();
    }
}
