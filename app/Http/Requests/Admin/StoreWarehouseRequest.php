<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWarehouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageCatalogue) ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:30', Rule::unique('stores')],
            'name' => ['required', 'string', 'max:150'],
            'type' => ['required', Rule::in(['warehouse', 'fulfilment_center', 'dark_store'])],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:30'],
            'address' => ['required', 'array'],
            'address.line_1' => ['required', 'string', 'max:255'],
            'address.line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'capacity' => ['required', 'integer', 'min:0'],
            'priority' => ['required', 'integer', 'min:1', 'max:999'],
            'status' => ['required', 'boolean'],
        ];
    }
}
