<?php

namespace App\Http\Requests\Customer;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProcessPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isCustomer() === true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'payment_method' => [
                'required',
                Rule::in([
                    'credit_card',
                    'debit_card',
                    'upi',
                    'net_banking',
                    'wallet',
                    'cash_on_delivery',
                    'emi',
                    'buy_now_pay_later',
                    'gift_card',
                    'reward_points',
                    'saved_card',
                ]),
            ],
            'idempotency_key' => ['required', 'uuid'],
            'authentication_code' => [
                Rule::requiredIf(fn (): bool => ! in_array($this->string('payment_method')->toString(), [
                    'cash_on_delivery',
                    'gift_card',
                    'reward_points',
                ], true)),
                'nullable',
                'string',
                'regex:/^\d{6}$/',
            ],
            'save_payment_method' => ['boolean'],
        ];
    }
}
