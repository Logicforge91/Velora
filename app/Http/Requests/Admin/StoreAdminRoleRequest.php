<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use App\Enums\AccountRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAdminRoleRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:100', Rule::unique('admin_roles', 'name')],
            'slug' => ['required', 'alpha_dash:ascii', 'max:100', Rule::unique('admin_roles', 'slug')],
            'description' => ['nullable', 'string', 'max:1000'],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['required', 'distinct', Rule::enum(AccountPermission::class), Rule::in(array_column(AccountPermission::assignableToAdmin(), 'value'))],
            'user_ids' => ['present', 'array'],
            'user_ids.*' => [
                'integer',
                'distinct',
                Rule::notIn([$this->user()?->id]),
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('role', AccountRole::Admin->value)->whereNull('deleted_at')),
            ],
        ];
    }
}
