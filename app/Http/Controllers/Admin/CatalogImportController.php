<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AccountPermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCatalogImportRequest;
use App\Jobs\ProcessCatalogImport;
use App\Models\CatalogImport;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CatalogImportController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->hasPermission(AccountPermission::ManageCatalogue), 403);
        $imports = CatalogImport::query()->with('uploader:id,name,email')->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/catalog-imports/index', ['imports' => $imports, 'counts' => ['total' => CatalogImport::query()->count(), 'queued' => CatalogImport::query()->whereIn('status', ['queued', 'processing'])->count(), 'completed' => CatalogImport::query()->whereIn('status', ['completed', 'completed_errors'])->count(), 'failed_rows' => CatalogImport::query()->sum('failed_rows')]]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()?->hasPermission(AccountPermission::ManageCatalogue), 403);

        return Inertia::render('admin/catalog-imports/create');
    }

    public function store(StoreCatalogImportRequest $request): RedirectResponse
    {
        $file = $request->file('file');
        abort_unless($file instanceof UploadedFile, 422);
        $path = $file->store('catalog-imports', 'local');
        abort_unless(is_string($path), 422);
        /** @var User $actor */ $actor = $request->user();
        $import = CatalogImport::query()->create(['uuid' => (string) Str::uuid(), 'uploaded_by' => $actor->id, 'original_name' => basename($file->getClientOriginalName()), 'file_path' => $path, 'dry_run' => $request->boolean('dry_run')]);
        ProcessCatalogImport::dispatch($import->id)->afterCommit();

        return to_route('admin.catalog-imports.show', $import)->with('success', 'Catalogue import queued successfully.');
    }

    public function show(Request $request, CatalogImport $catalogImport): Response
    {
        abort_unless($request->user()?->hasPermission(AccountPermission::ManageCatalogue), 403);

        return Inertia::render('admin/catalog-imports/show', ['import' => $catalogImport->load('uploader:id,name,email')]);
    }

    public function template(Request $request): StreamedResponse
    {
        abort_unless($request->user()?->hasPermission(AccountPermission::ManageCatalogue), 403);

        return response()->streamDownload(function (): void {
            $stream = fopen('php://output', 'w');
            if ($stream === false) {
                return;
            } fputcsv($stream, ['sku', 'name', 'price', 'stock', 'status', 'category_slug', 'brand_slug', 'vendor_id', 'short_description', 'description']);
            fputcsv($stream, ['VEL-SAMPLE-001', 'Sample Product', '999.00', '25', 'draft', 'electronics', 'sample-brand', '', 'Short description', 'Detailed product description']);
            fclose($stream);
        }, 'catalog-import-template.csv', ['Content-Type' => 'text/csv']);
    }
}
