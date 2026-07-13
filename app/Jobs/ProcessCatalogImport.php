<?php

namespace App\Jobs;

use App\Models\Brand;
use App\Models\CatalogImport;
use App\Models\Category;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use SplFileObject;
use Throwable;

class ProcessCatalogImport implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 60;

    /** @var list<int> */
    public array $backoff = [5, 30, 60];

    public int $uniqueFor = 3600;

    public function __construct(public int $catalogImportId)
    {
        $this->onQueue('imports');
    }

    public function uniqueId(): string
    {
        return (string) $this->catalogImportId;
    }

    public function handle(): void
    {
        $import = CatalogImport::query()->findOrFail($this->catalogImportId);
        $import->update(['status' => 'processing', 'started_at' => now(), 'errors' => []]);
        $file = new SplFileObject(Storage::disk('local')->path($import->file_path));
        $file->setFlags(SplFileObject::READ_CSV | SplFileObject::SKIP_EMPTY | SplFileObject::DROP_NEW_LINE);
        $header = array_map(fn (mixed $value): string => Str::lower(trim((string) $value)), $file->fgetcsv() ?: []);
        $required = ['sku', 'name', 'price', 'stock'];
        if (array_diff($required, $header) !== []) {
            throw new \RuntimeException('CSV must contain: '.implode(', ', $required));
        }

        $errors = [];
        $processed = 0;
        $created = 0;
        $updated = 0;
        $failed = 0;
        while (! $file->eof() && $processed < 10000) {
            $values = $file->fgetcsv();
            if (! is_array($values) || $values === [null]) {
                continue;
            }
            $processed++;
            $normalizedValues = array_slice(array_pad($values, count($header), null), 0, count($header));
            $row = array_combine($header, $normalizedValues);
            $validator = Validator::make($row, ['sku' => ['required', 'string', 'max:100'], 'name' => ['required', 'string', 'max:255'], 'price' => ['required', 'numeric', 'min:0'], 'stock' => ['required', 'integer', 'min:0'], 'status' => ['nullable', Rule::in(Product::statuses())], 'vendor_id' => ['nullable', 'integer'], 'category_slug' => ['nullable', 'string'], 'brand_slug' => ['nullable', 'string']]);
            if ($validator->fails()) {
                $failed++;
                $errors[] = ['row' => $processed + 1, 'sku' => $row['sku'] ?? null, 'message' => $validator->errors()->first()];

                continue;
            }
            $data = $validator->validated();
            $categoryId = empty($data['category_slug']) ? null : Category::query()->where('slug', $data['category_slug'])->value('id');
            $brandId = empty($data['brand_slug']) ? null : Brand::query()->where('slug', $data['brand_slug'])->value('id');
            $vendorId = empty($data['vendor_id']) ? null : Vendor::query()->whereKey($data['vendor_id'])->where('status', Vendor::STATUS_APPROVED)->value('id');
            if ((! empty($data['category_slug']) && ! $categoryId) || (! empty($data['brand_slug']) && ! $brandId) || (! empty($data['vendor_id']) && ! $vendorId)) {
                $failed++;
                $errors[] = ['row' => $processed + 1, 'sku' => $data['sku'], 'message' => 'Category, brand, or approved seller mapping was not found.'];

                continue;
            }
            $exists = Product::query()->where('sku', $data['sku'])->exists();
            if (! $import->dry_run) {
                Product::query()->updateOrCreate(['sku' => $data['sku']], ['name' => $data['name'], 'slug' => Str::limit(Str::slug($data['name']).'-'.Str::lower($data['sku']), 255, ''), 'price' => $data['price'], 'stock' => $data['stock'], 'status' => $data['status'] ?? Product::STATUS_DRAFT, 'category_id' => $categoryId, 'brand_id' => $brandId, 'vendor_id' => $vendorId, 'description' => $row['description'] ?? null, 'short_description' => $row['short_description'] ?? null]);
            }
            $exists ? $updated++ : $created++;
            if ($processed % 25 === 0) {
                $import->update(['processed_rows' => $processed, 'created_rows' => $created, 'updated_rows' => $updated, 'failed_rows' => $failed]);
            }
        }
        $import->update(['status' => $failed > 0 ? 'completed_errors' : 'completed', 'total_rows' => $processed, 'processed_rows' => $processed, 'created_rows' => $created, 'updated_rows' => $updated, 'failed_rows' => $failed, 'errors' => array_slice($errors, 0, 500), 'completed_at' => now()]);
    }

    public function failed(?Throwable $exception): void
    {
        CatalogImport::query()->whereKey($this->catalogImportId)->update(['status' => 'failed', 'errors' => [['row' => null, 'sku' => null, 'message' => $exception?->getMessage() ?? 'Import failed.']], 'completed_at' => now()]);
    }
}
