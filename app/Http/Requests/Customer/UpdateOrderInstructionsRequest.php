<?php

namespace App\Http\Requests\Customer;

use App\Models\Order;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderInstructionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = $this->route('order');

        return $order instanceof Order && $this->user()?->can('update', $order) === true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'delivery_instructions' => ['required', 'string', 'max:1000'],
        ];
    }
}
