<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceAreaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageCatalogue) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'prepaid_available' => $this->boolean('prepaid_available'),
            'cod_available' => $this->boolean('cod_available'),
            'express_available' => $this->boolean('express_available'),
            'country_code' => mb_strtoupper((string) ($this->input('country_code') ?: 'IN')),
        ]);
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return $this->rulesForServiceArea();
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    protected function rulesForServiceArea(?int $ignoreId = null): array
    {
        return [
            'store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'postal_code' => ['required', 'string', 'max:20', Rule::unique('service_areas')->where(fn ($query) => $query->where('store_id', $this->input('store_id')))->ignore($ignoreId)],
            'city' => ['nullable', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'country_code' => ['required', 'string', 'size:2'],
            'prepaid_available' => ['required', 'boolean'],
            'cod_available' => ['required', 'boolean'],
            'express_available' => ['required', 'boolean'],
            'minimum_delivery_days' => ['required', 'integer', 'min:0', 'lte:maximum_delivery_days'],
            'maximum_delivery_days' => ['required', 'integer', 'gte:minimum_delivery_days', 'max:365'],
            'shipping_charge' => ['required', 'numeric', 'min:0'],
            'free_shipping_threshold' => ['nullable', 'numeric', 'min:0'],
            'cod_charge' => ['required', 'numeric', 'min:0'],
            'daily_capacity' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'cutoff_time' => ['nullable', 'date_format:H:i'],
        ];
    }
}
