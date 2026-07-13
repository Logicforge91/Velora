<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use App\Models\Settlement;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettlementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManagePayments) ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return ['status' => ['required', Rule::in(Settlement::statuses())], 'transaction_reference' => ['nullable', 'string', 'max:150', Rule::unique('settlements')->ignore($this->route('settlement'))], 'notes' => ['nullable', 'string', 'max:3000']];
    }
}
