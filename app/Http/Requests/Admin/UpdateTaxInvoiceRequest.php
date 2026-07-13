<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use App\Models\TaxInvoice;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaxInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManagePayments) ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return ['status' => ['required', Rule::in(TaxInvoice::statuses())], 'notes' => ['nullable', 'string', 'max:3000']];
    }
}
