<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSettlementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManagePayments) ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return ['vendor_id' => ['required', 'integer', 'exists:vendors,id'], 'period_start' => ['required', 'date'], 'period_end' => ['required', 'date', 'after_or_equal:period_start', 'before_or_equal:today'], 'shipping_fee' => ['required', 'numeric', 'min:0'], 'tax_withheld' => ['required', 'numeric', 'min:0'], 'adjustments' => ['required', 'numeric'], 'notes' => ['nullable', 'string', 'max:3000']];
    }
}
