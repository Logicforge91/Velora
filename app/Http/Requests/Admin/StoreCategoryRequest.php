<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageCatalogue) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'status' => $this->boolean('status'),

            'sort_order' => $this->filled('sort_order')
                ? $this->input('sort_order')
                : 0,
        ]);
    }

    public function rules(): array
    {
        return [
            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
            ],

            'name' => [
                'required',
                'string',
                'max:150',
            ],

            'slug' => [
                'nullable',
                'string',
                'max:180',
            ],

            'description' => [
                'nullable',
                'string',
                'max:3000',
            ],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'sort_order' => [
                'required',
                'integer',
                'min:0',
                'max:99999',
            ],

            'status' => [
                'required',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'parent_id.exists' => 'The selected parent category does not exist.',

            'name.required' => 'Please enter the category name.',

            'image.image' => 'The category image must be a valid image.',

            'image.mimes' => 'Only JPG, JPEG, PNG and WebP images are allowed.',

            'image.max' => 'The category image cannot exceed 2 MB.',
        ];
    }
}
