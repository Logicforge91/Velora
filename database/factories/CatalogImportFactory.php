<?php

namespace Database\Factories;

use App\Models\CatalogImport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<CatalogImport>
 */
class CatalogImportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => (string) Str::uuid(), 'uploaded_by' => User::factory()->admin(), 'original_name' => 'catalog.csv',
            'file_path' => 'catalog-imports/catalog.csv', 'status' => 'queued', 'dry_run' => false,
        ];
    }
}
