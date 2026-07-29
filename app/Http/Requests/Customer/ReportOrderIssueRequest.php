<?php

namespace App\Http\Requests\Customer;

use App\Models\Order;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReportOrderIssueRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = $this->route('order');

        return $order instanceof Order && $this->user()?->can('view', $order) === true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'category' => ['required', Rule::in(['delivery', 'item', 'payment', 'seller', 'other'])],
            'description' => ['required', 'string', 'max:3000'],
        ];
    }
}
