<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use App\Models\Product;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageCatalogue) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_featured' => $this->boolean('is_featured'),
            'stock' => $this->filled('stock') ? $this->input('stock') : 0,
            'low_stock_threshold' => $this->filled('low_stock_threshold') ? $this->input('low_stock_threshold') : 5,
        ]);
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'vendor_id' => ['nullable', 'integer', 'exists:vendors,id'],
            'name' => ['required', 'string', 'max:180'],
            'slug' => ['nullable', 'string', 'max:200'],
            'sku' => ['required', 'string', 'max:80', 'unique:products,sku'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:10000'],
            'price' => ['required', 'numeric', 'min:0', 'max:999999999.99'],
            'compare_at_price' => ['nullable', 'numeric', 'gt:price', 'max:999999999.99'],
            'stock' => ['required', 'integer', 'min:0', 'max:999999999'],
            'low_stock_threshold' => ['required', 'integer', 'min:0', 'max:999999999'],
            'status' => ['required', Rule::in(Product::statuses())],
            'is_featured' => ['required', 'boolean'],
            'primary_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ];
    }
}
