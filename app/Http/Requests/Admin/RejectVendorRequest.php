<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class RejectVendorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'rejection_reason' => [
                'required',
                'string',
                'min:10',
                'max:1000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'rejection_reason.required' =>
                'Please enter a reason for rejecting this vendor.',

            'rejection_reason.min' =>
                'The rejection reason must contain at least 10 characters.',

            'rejection_reason.max' =>
                'The rejection reason cannot exceed 1000 characters.',
        ];
    }
}
