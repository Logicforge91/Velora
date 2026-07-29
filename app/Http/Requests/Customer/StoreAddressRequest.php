<?php

namespace App\Http\Requests\Customer;

use App\Models\Address;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isCustomer() === true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(Address::types())],
            'label' => ['nullable', 'string', 'max:60'],
            'recipient_name' => ['required', 'string', 'max:150'],
            'phone' => ['required', 'string', 'regex:/^[6-9]\d{9}$/'],
            'alternate_phone' => ['nullable', 'string', 'regex:/^[6-9]\d{9}$/'],
            'line_1' => ['required', 'string', 'max:255'],
            'line_2' => ['nullable', 'string', 'max:255'],
            'landmark' => ['nullable', 'string', 'max:150'],
            'city' => ['required', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'regex:/^\d{6}$/'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'delivery_instructions' => ['nullable', 'string', 'max:1000'],
            'is_default_shipping' => ['boolean'],
        ];
    }
}
