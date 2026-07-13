<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use App\Models\SupportTicket;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSupportTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::HandleSupportRequests) ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return ['customer_id' => ['required', 'integer', 'exists:users,id'], 'order_id' => ['nullable', 'integer', 'exists:orders,id'], 'assigned_to' => ['nullable', 'integer', 'exists:users,id'], 'subject' => ['required', 'string', 'max:255'], 'category' => ['required', Rule::in(['order', 'delivery', 'payment', 'return_refund', 'account', 'product', 'seller', 'other'])], 'channel' => ['required', Rule::in(['admin', 'email', 'phone', 'chat', 'social'])], 'priority' => ['required', Rule::in(SupportTicket::priorities())], 'description' => ['required', 'string', 'max:10000']];
    }
}
