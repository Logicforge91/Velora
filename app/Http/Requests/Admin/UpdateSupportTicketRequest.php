<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use App\Models\SupportTicket;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupportTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::HandleSupportRequests) ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return ['assigned_to' => ['nullable', 'integer', 'exists:users,id'], 'status' => ['required', Rule::in(SupportTicket::statuses())], 'priority' => ['required', Rule::in(SupportTicket::priorities())]];
    }
}
