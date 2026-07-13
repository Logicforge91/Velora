<?php

use App\Jobs\ProcessCatalogImport;
use App\Models\CatalogImport;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

test('administrators can securely queue catalogue CSV imports', function () {
    Storage::fake('local');
    Bus::fake();
    $admin = User::factory()->admin()->create();
    $file = UploadedFile::fake()->createWithContent('catalog.csv', "sku,name,price,stock\nVEL-100,Imported Product,499.00,20\n");
    $this->actingAs($admin)->post(route('admin.catalog-imports.store'), ['file' => $file, 'dry_run' => true])->assertRedirect();
    $import = CatalogImport::query()->firstOrFail();
    Storage::disk('local')->assertExists($import->file_path);
    Bus::assertDispatched(ProcessCatalogImport::class, fn (ProcessCatalogImport $job): bool => $job->catalogImportId === $import->id);
});

test('catalogue import jobs create and update products while reporting row errors', function () {
    Storage::fake('local');
    $admin = User::factory()->admin()->create();
    $path = 'catalog-imports/live.csv';
    Storage::disk('local')->put($path, "sku,name,price,stock,status\nVEL-NEW-1,New Product,799.00,15,active\n,Invalid Product,99.00,2,draft\n");
    $import = CatalogImport::query()->create(['uuid' => (string) Str::uuid(), 'uploaded_by' => $admin->id, 'original_name' => 'live.csv', 'file_path' => $path, 'dry_run' => false]);
    (new ProcessCatalogImport($import->id))->handle();
    expect(Product::query()->where('sku', 'VEL-NEW-1')->where('stock', 15)->exists())->toBeTrue()
        ->and($import->fresh()->status)->toBe('completed_errors')->and($import->fresh()->failed_rows)->toBe(1);
});

test('dry runs calculate changes without mutating the catalogue', function () {
    Storage::fake('local');
    $admin = User::factory()->admin()->create();
    $path = 'catalog-imports/dry.csv';
    Storage::disk('local')->put($path, "sku,name,price,stock\nVEL-DRY-1,Dry Product,299.00,9\n");
    $import = CatalogImport::query()->create(['uuid' => (string) Str::uuid(), 'uploaded_by' => $admin->id, 'original_name' => 'dry.csv', 'file_path' => $path, 'dry_run' => true]);
    (new ProcessCatalogImport($import->id))->handle();
    expect(Product::query()->where('sku', 'VEL-DRY-1')->exists())->toBeFalse()->and($import->fresh()->created_rows)->toBe(1);
});
