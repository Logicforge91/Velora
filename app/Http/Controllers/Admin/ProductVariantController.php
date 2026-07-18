<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductVariantRequest;
use App\Http\Requests\Admin\UpdateProductVariantRequest;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\Admin\ProductVariantManagementService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductVariantController extends Controller
{
    public function __construct(private readonly ProductVariantManagementService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/product-variants/index', [
            'variants' => $this->service->paginate($request->only(['search', 'status', 'product_id'])),
            'counts' => $this->service->counts(),
            'products' => $this->products(),
        ]);
    }

    public function create(): Response
    {
        return $this->form(new ProductVariant);
    }

    public function store(StoreProductVariantRequest $request): RedirectResponse
    {
        $productVariant = $this->service->create($request->validated());

        return to_route('admin.product-variants.edit', $productVariant)->with('success', 'Product variant created successfully.');
    }

    public function edit(ProductVariant $productVariant): Response
    {
        return $this->form($productVariant);
    }

    public function update(UpdateProductVariantRequest $request, ProductVariant $productVariant): RedirectResponse
    {
        $this->service->update($productVariant, $request->validated());

        return to_route('admin.product-variants.edit', $productVariant)->with('success', 'Product variant updated successfully.');
    }

    public function destroy(ProductVariant $productVariant): RedirectResponse
    {
        $this->service->delete($productVariant);

        return to_route('admin.product-variants.index')->with('success', 'Product variant deleted successfully.');
    }

    private function form(ProductVariant $productVariant): Response
    {
        return Inertia::render('admin/product-variants/form', [
            'variant' => $productVariant,
            'products' => $this->products(),
        ]);
    }

    /** @return Collection<int, Product> */
    private function products(): Collection
    {
        return Product::query()->select(['id', 'name', 'sku'])->orderBy('name')->get();
    }
}
