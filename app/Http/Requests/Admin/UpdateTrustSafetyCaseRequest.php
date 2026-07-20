<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTrustSafetyCaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ViewReports) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['open', 'in_review', 'resolved', 'dismissed'])],
            'severity' => ['required', Rule::in(['low', 'medium', 'high', 'critical'])],
            'resolution_notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
