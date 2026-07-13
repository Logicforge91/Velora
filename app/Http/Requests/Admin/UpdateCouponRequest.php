<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCouponRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission(AccountPermission::ManageCatalogue) ?? false; }
    protected function prepareForValidation(): void { $this->merge(['status' => $this->boolean('status'), 'code' => mb_strtoupper(trim((string) $this->input('code')))]); }
    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return ['code' => ['required', 'string', 'max:50', Rule::unique('coupons', 'code')->ignore($this->route('coupon'))], 'name' => ['required', 'string', 'max:150'], 'description' => ['nullable', 'string', 'max:3000'], 'type' => ['required', Rule::in(['percentage', 'fixed'])], 'value' => ['required', 'numeric', 'min:0.01', 'max:999999999.99'], 'minimum_order_amount' => ['required', 'numeric', 'min:0'], 'maximum_discount_amount' => ['nullable', 'numeric', 'min:0.01'], 'usage_limit' => ['nullable', 'integer', 'min:1'], 'starts_at' => ['nullable', 'date'], 'expires_at' => ['nullable', 'date', 'after:starts_at'], 'status' => ['required', 'boolean']];
    }
}
