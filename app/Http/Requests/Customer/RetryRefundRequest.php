<?php

namespace App\Http\Requests\Customer;

use App\Models\PaymentRefund;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RetryRefundRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $refund = $this->route('paymentRefund');

        return $refund instanceof PaymentRefund
            && $refund->payment()->whereHas('order', fn ($query) => $query->where('user_id', $this->user()?->id))->exists();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'refund_method' => ['required', 'in:original_payment,wallet,bank_account'],
        ];
    }
}
