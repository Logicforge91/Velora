<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use App\Services\Admin\SystemSettingsService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSystemSettingRequest extends FormRequest
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
        $group = (string) $this->route('group');
        $fields = app(SystemSettingsService::class)->definitions()[$group]['fields'] ?? [];
        $rules = ['settings' => ['required', 'array']];

        foreach ($fields as $key => $field) {
            if ($field['type'] === 'number') {
                $numberRules = ['required', 'numeric', 'min:'.($field['min'] ?? 0)];

                if (isset($field['max'])) {
                    $numberRules[] = 'max:'.$field['max'];
                }

                $rules["settings.{$key}"] = $numberRules;

                continue;
            }

            $rules["settings.{$key}"] = match ($field['type']) {
                'boolean' => ['required', 'boolean'],
                'email' => ['required', 'email', 'max:255'],
                'textarea' => ['required', 'string', 'max:1000'],
                default => ['nullable', 'string', 'max:255'],
            };
        }

        return $rules;
    }
}
