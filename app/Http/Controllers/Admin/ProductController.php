<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\Admin\ProductManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductManagementService $productService
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/products/index', [
            'products' => $this->productService->getProducts($request->only(['search', 'status', 'stock', 'category_id'])),
            'counts' => $this->productService->getCounts(),
            'categories' => Category::query()->select(['id', 'name'])->orderBy('name')->get(),
            'statuses' => Product::statuses(),
        ]);
    }

    public function create(): Response
    {
        return $this->form(new Product);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $product = $this->productService->create($request->validated());

        return to_route('admin.products.edit', $product)->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $product->load(['category', 'brand', 'primaryImage']);

        return $this->form($product);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->productService->update($product, $request->validated());

        return to_route('admin.products.edit', $product)->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->productService->delete($product);

        return to_route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    private function form(Product $product): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => $product,
            'categories' => Category::query()->select(['id', 'name'])->orderBy('name')->get(),
            'brands' => Brand::query()->select(['id', 'name'])->orderBy('name')->get(),
            'statuses' => Product::statuses(),
        ]);
    }
}
