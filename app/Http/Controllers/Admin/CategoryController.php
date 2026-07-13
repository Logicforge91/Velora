<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\Admin\CategoryManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryManagementService $categoryService
    ) {}

    public function index(Request $request): Response
    {
        $categories = $this->categoryService->getCategories(
            $request->only(['search', 'status', 'parent'])
        );

        $categories->through(fn (Category $category): Category => $category->append('image_url'));

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,

            'counts' => $this->categoryService->getCounts(),

            'parentOptions' => $this->categoryService->getParentOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/categories/form', [
            'category' => new Category([
                'status' => true,
                'sort_order' => 0,
            ]),

            'parentOptions' => $this->categoryService->getParentOptions(),
        ]);
    }

    public function store(
        StoreCategoryRequest $request
    ): RedirectResponse {
        $category = $this->categoryService->create(
            $request->validated()
        );

        return redirect()
            ->route(
                'admin.categories.edit',
                $category
            )
            ->with(
                'success',
                'Category created successfully.'
            );
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('admin/categories/form', [
            'category' => $category->append('image_url'),

            'parentOptions' => $this->categoryService->getParentOptions(
                $category
            ),
        ]);
    }

    public function update(
        UpdateCategoryRequest $request,
        Category $category
    ): RedirectResponse {
        $this->categoryService->update(
            category: $category,
            data: $request->validated(),
        );

        return redirect()
            ->route(
                'admin.categories.edit',
                $category
            )
            ->with(
                'success',
                'Category updated successfully.'
            );
    }

    public function destroy(
        Category $category
    ): RedirectResponse {
        $this->categoryService->delete(
            $category
        );

        return redirect()
            ->route('admin.categories.index')
            ->with(
                'success',
                'Category deleted successfully.'
            );
    }
}
