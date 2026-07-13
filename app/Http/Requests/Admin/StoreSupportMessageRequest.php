<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSupportMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::HandleSupportRequests) ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return ['body' => ['required', 'string', 'max:10000'], 'is_internal' => ['required', 'boolean']];
    }
}
