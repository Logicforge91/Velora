<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AdjustWarehouseInventoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageCatalogue) ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'on_hand' => ['required', 'integer', 'min:0'],
            'reserved' => ['required', 'integer', 'min:0', 'lte:on_hand'],
            'reorder_level' => ['required', 'integer', 'min:0'],
            'bin_location' => ['nullable', 'string', 'max:50'],
        ];
    }
}
