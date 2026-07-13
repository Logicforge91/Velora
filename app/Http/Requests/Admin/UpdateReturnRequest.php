<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use App\Models\ReturnCase;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReturnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageOrders) ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(ReturnCase::statuses())],
            'refund_amount' => ['required', 'numeric', 'min:0'],
            'resolution' => ['nullable', 'string', 'max:255'],
            'reverse_carrier' => ['nullable', 'string', 'max:100'],
            'tracking_number' => ['nullable', 'string', 'max:150', Rule::unique('return_cases', 'tracking_number')->ignore($this->route('return'))],
        ];
    }
}
