<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageCatalogue) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'status' => $this->boolean('status'),
            'is_featured' => $this->boolean('is_featured'),
            'remove_logo' => $this->boolean('remove_logo'),

            'sort_order' => $this->filled('sort_order')
                ? $this->input('sort_order')
                : 0,
        ]);
    }

    public function rules(): array
    {
        return [
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

            'logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'website_url' => [
                'nullable',
                'url',
                'max:255',
            ],

            'sort_order' => [
                'required',
                'integer',
                'min:0',
                'max:99999',
            ],

            'is_featured' => [
                'required',
                'boolean',
            ],

            'status' => [
                'required',
                'boolean',
            ],

            'remove_logo' => [
                'required',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please enter the brand name.',

            'website_url.url' => 'Please enter a valid website URL.',

            'logo.image' => 'The brand logo must be an image.',

            'logo.mimes' => 'The logo must be a JPG, JPEG, PNG or WebP file.',

            'logo.max' => 'The brand logo cannot exceed 2 MB.',
        ];
    }
}
