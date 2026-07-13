<?php

namespace Database\Seeders;

use App\Models\VendorReviewEvent;
use Illuminate\Database\Seeder;

class VendorReviewEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VendorReviewEvent::factory()->count(10)->create();
    }
}
