<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\Admin\CategoryManagementService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryManagementService $categoryService
    ) {
    }

    public function index(Request $request): View
    {
        return view('admin.categories.index', [
            'categories' =>
                $this->categoryService->getCategories(
                    $request->only([
                        'search',
                        'status',
                        'parent',
                    ])
                ),

            'counts' =>
                $this->categoryService->getCounts(),

            'parentOptions' =>
                $this->categoryService->getParentOptions(),
        ]);
    }

    public function create(): View
    {
        return view('admin.categories.create', [
            'category' => new Category([
                'status' => true,
                'sort_order' => 0,
            ]),

            'parentOptions' =>
                $this->categoryService->getParentOptions(),
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

    public function edit(Category $category): View
    {
        return view('admin.categories.edit', [
            'category' => $category,

            'parentOptions' =>
                $this->categoryService->getParentOptions(
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
