<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSellerListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageCatalogue) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['is_buy_box_winner' => $this->boolean('is_buy_box_winner')]);
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['draft', 'pending', 'active', 'suspended', 'rejected'])],
            'selling_price' => ['required', 'numeric', 'min:0', 'lte:mrp'],
            'mrp' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'commission_rate' => ['required', 'numeric', 'between:0,100'],
            'is_buy_box_winner' => ['required', 'boolean'],
            'rejection_reason' => ['nullable', 'required_if:status,rejected', 'string', 'max:2000'],
        ];
    }
}
