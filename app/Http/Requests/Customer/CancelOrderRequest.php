<?php

namespace App\Http\Requests\Customer;

use App\Models\Order;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CancelOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $order = $this->route('order');

        return $order instanceof Order && $this->user()?->can('update', $order) === true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reason' => ['required', Rule::in([
                'changed_mind',
                'ordered_by_mistake',
                'found_better_price',
                'delivery_too_late',
                'incorrect_address',
                'other',
            ])],
            'reason_details' => ['nullable', 'string', 'max:1000', Rule::requiredIf($this->string('reason')->toString() === 'other')],
            'refund_method' => ['required', Rule::in(['original_payment', 'store_credit', 'bank_transfer'])],
            'confirmed' => ['accepted'],
        ];
    }
}
