<?php

namespace App\Http\Requests\Customer;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRefundRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isCustomer() === true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'refund_type' => ['required', Rule::in(['full', 'partial'])],
            'amount' => ['nullable', 'numeric', 'min:1', 'required_if:refund_type,partial'],
            'refund_method' => ['required', Rule::in(['original_payment', 'wallet', 'bank_account'])],
            'reason' => ['required', 'string', 'max:1000'],
        ];
    }
}
