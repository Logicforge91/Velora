<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use App\Services\Admin\IntegrationManagementService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIntegrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManageRoles) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $category = (string) $this->route('category');
        $definition = app(IntegrationManagementService::class)->definitions()[$category] ?? null;

        return [
            'provider' => ['required', 'string', Rule::in(array_keys($definition['providers'] ?? []))],
            'enabled' => ['required', 'boolean'],
            'configuration' => ['required', 'array'],
            'configuration.*' => ['nullable', 'string', 'max:2048'],
            'credentials' => ['required', 'array'],
            'credentials.*' => ['nullable', 'string', 'max:4096'],
        ];
    }
}
