<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBrandRequest;
use App\Http\Requests\Admin\UpdateBrandRequest;
use App\Models\Brand;
use App\Services\Admin\BrandManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function __construct(
        private readonly BrandManagementService $brandService
    ) {}

    public function index(Request $request): Response
    {
        $brands = $this->brandService->getBrands(
            $request->only(['search', 'status', 'featured'])
        );

        $brands->through(fn (Brand $brand): Brand => $brand->append('logo_url'));

        return Inertia::render('admin/brands/index', [
            'brands' => $brands,

            'counts' => $this->brandService->getCounts(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/brands/form', [
            'brand' => new Brand([
                'status' => true,
                'is_featured' => false,
                'sort_order' => 0,
            ]),
        ]);
    }

    public function store(
        StoreBrandRequest $request
    ): RedirectResponse {
        $brand = $this->brandService->create(
            $request->validated()
        );

        return redirect()
            ->route('admin.brands.edit', $brand)
            ->with(
                'success',
                'Brand created successfully.'
            );
    }

    public function edit(Brand $brand): Response
    {
        return Inertia::render('admin/brands/form', [
            'brand' => $brand->append('logo_url'),
        ]);
    }

    public function update(
        UpdateBrandRequest $request,
        Brand $brand
    ): RedirectResponse {
        $this->brandService->update(
            brand: $brand,
            data: $request->validated(),
        );

        return redirect()
            ->route('admin.brands.edit', $brand)
            ->with(
                'success',
                'Brand updated successfully.'
            );
    }

    public function destroy(
        Brand $brand
    ): RedirectResponse {
        $this->brandService->delete($brand);

        return redirect()
            ->route('admin.brands.index')
            ->with(
                'success',
                'Brand deleted successfully.'
            );
    }
}
