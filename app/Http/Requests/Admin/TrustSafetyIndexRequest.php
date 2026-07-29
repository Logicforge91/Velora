<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use App\Services\Admin\TrustSafetyService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TrustSafetyIndexRequest extends FormRequest
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
            'section' => ['sometimes', 'string', Rule::in(TrustSafetyService::sectionKeys())],
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'status' => ['sometimes', 'nullable', Rule::in(['open', 'in_review', 'resolved', 'dismissed'])],
            'severity' => ['sometimes', 'nullable', Rule::in(['low', 'medium', 'high', 'critical'])],
        ];
    }
}
