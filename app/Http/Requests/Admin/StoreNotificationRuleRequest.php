<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNotificationRuleRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'event' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9._-]+$/'],
            'audience' => ['required', Rule::in(['admin', 'seller', 'customer'])],
            'channels' => ['required', 'array', 'min:1'],
            'channels.*' => ['required', Rule::in(['database', 'mail', 'sms', 'push', 'whatsapp'])],
            'templates' => ['present', 'array'],
            'templates.*' => ['nullable', 'integer', 'exists:notification_templates,id'],
            'conditions' => ['present', 'array'],
            'enabled' => ['required', 'boolean'],
        ];
    }
}
