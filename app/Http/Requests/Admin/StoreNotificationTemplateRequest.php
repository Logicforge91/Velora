<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNotificationTemplateRequest extends FormRequest
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
            'slug' => ['nullable', 'string', 'max:255'],
            'channel' => ['required', Rule::in(['mail', 'sms', 'push', 'whatsapp'])],
            'audience' => ['required', Rule::in(['admin', 'seller', 'customer'])],
            'subject' => [Rule::requiredIf($this->input('channel') === 'mail'), 'nullable', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:10000'],
            'variables' => ['present', 'array', 'max:30'],
            'variables.*' => ['required', 'string', 'max:100'],
            'enabled' => ['required', 'boolean'],
        ];
    }
}
