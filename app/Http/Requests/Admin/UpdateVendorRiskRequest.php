<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVendorRiskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageVendors) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'risk_level' => ['required', Rule::in(['low', 'medium', 'high'])],
            'risk_score' => ['required', 'integer', 'between:0,100'],
            'risk_flags' => ['present', 'array', 'max:10'],
            'risk_flags.*' => ['string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
