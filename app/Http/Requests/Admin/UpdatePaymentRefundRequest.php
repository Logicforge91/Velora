<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePaymentRefundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManagePayments) ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['requested', 'approved', 'processing', 'completed', 'failed', 'rejected'])],
            'provider_reference' => ['nullable', 'string', 'max:255', Rule::unique('payment_refunds', 'provider_reference')->ignore($this->route('payment_refund'))],
            'failure_reason' => ['nullable', 'required_if:status,failed', 'string', 'max:2000'],
        ];
    }
}
