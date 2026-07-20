<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreVendorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageVendors) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'owner_email' => $this->string('owner_email')->trim()->lower()->toString(),
            'business_email' => $this->string('business_email')->trim()->lower()->toString(),
            'tax_number' => $this->string('tax_number')->trim()->upper()->toString() ?: null,
        ]);
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'owner_name' => ['required', 'string', 'max:255'],
            'owner_email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'confirmed', Password::defaults()],
            'business_name' => ['required', 'string', 'max:255'],
            'business_email' => ['required', 'email', 'max:255', Rule::unique('vendors', 'business_email')],
            'business_phone' => ['nullable', 'string', 'max:30'],
            'tax_number' => ['nullable', 'string', 'max:50', Rule::unique('vendors', 'tax_number')],
            'address' => ['nullable', 'string', 'max:2000'],
            'bank_account_name' => ['nullable', 'string', 'max:255'],
            'bank_account_number' => ['nullable', 'string', 'max:50'],
            'bank_ifsc' => ['nullable', 'string', 'max:20'],
            'commission_rate' => ['required', 'numeric', 'between:0,100'],
            'settlement_cycle' => ['required', Rule::in(['daily', 'weekly', 'fortnightly', 'monthly'])],
        ];
    }
}
