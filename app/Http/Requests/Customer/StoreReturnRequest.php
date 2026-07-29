<?php

namespace App\Http\Requests\Customer;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReturnRequest extends FormRequest
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
            'order_item_id' => ['required', 'integer', 'exists:order_items,id'],
            'type' => ['required', Rule::in(['return', 'replacement', 'size_exchange', 'color_exchange'])],
            'reason_code' => ['required', Rule::in(['damaged', 'defective', 'wrong_item', 'not_as_described', 'size_issue', 'color_issue', 'changed_mind', 'other'])],
            'reason_details' => ['nullable', 'string', 'max:2000'],
            'exchange_value' => ['nullable', 'string', 'max:100', Rule::requiredIf(in_array($this->string('type')->toString(), ['size_exchange', 'color_exchange'], true))],
            'pickup_address_id' => ['required', 'integer', 'exists:addresses,id'],
            'pickup_slot_at' => ['required', 'date', 'after:now'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'video' => ['nullable', 'file', 'mimes:mp4,mov,webm', 'mimetypes:video/mp4,video/quicktime,video/webm', 'max:51200'],
        ];
    }
}
