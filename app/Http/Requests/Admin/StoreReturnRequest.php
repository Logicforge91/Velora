<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReturnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageOrders) ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'order_item_id' => ['nullable', 'integer', 'exists:order_items,id'],
            'type' => ['required', Rule::in(['return', 'rto'])],
            'reason_code' => ['required', Rule::in(['damaged', 'defective', 'wrong_item', 'not_as_described', 'customer_refused', 'undeliverable', 'other'])],
            'reason_details' => ['nullable', 'string', 'max:3000'],
            'requested_quantity' => ['required', 'integer', 'min:1'],
            'refund_amount' => ['required', 'numeric', 'min:0'],
            'resolution' => ['nullable', 'string', 'max:255'],
        ];
    }
}
