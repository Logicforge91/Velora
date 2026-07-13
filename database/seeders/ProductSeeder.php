<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        if (Product::query()->exists()) {
            return;
        }

        Product::factory()->count(16)->create();
        Product::factory()->count(2)->lowStock()->create();
        Product::factory()->count(2)->draft()->create();
    }
}
