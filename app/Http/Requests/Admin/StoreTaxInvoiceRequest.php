<?php

namespace App\Http\Requests\Admin;

use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaxInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission(AccountPermission::ManagePayments) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['reverse_charge' => $this->boolean('reverse_charge'), 'prices_include_tax' => $this->boolean('prices_include_tax')]);
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        $gstin = ['nullable', 'string', 'size:15', 'regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/'];

        return ['order_id' => ['required', 'integer', 'exists:orders,id'], 'vendor_id' => ['nullable', 'integer', 'exists:vendors,id'], 'parent_invoice_id' => ['nullable', 'integer', 'exists:tax_invoices,id'], 'type' => ['required', Rule::in(['invoice', 'credit_note'])], 'issued_on' => ['required', 'date'], 'supplier_name' => ['required', 'string', 'max:255'], 'supplier_address' => ['required', 'string', 'max:2000'], 'supplier_gstin' => $gstin, 'supplier_state_code' => ['required', 'digits:2'], 'recipient_gstin' => $gstin, 'place_of_supply_state' => ['required', 'string', 'max:100'], 'place_of_supply_code' => ['required', 'digits:2'], 'reverse_charge' => ['required', 'boolean'], 'gst_rate' => ['required', 'numeric', Rule::in([0, 0.25, 3, 5, 12, 18, 28])], 'cess_rate' => ['required', 'numeric', 'min:0', 'max:100'], 'hsn_code' => ['nullable', 'string', 'max:20'], 'prices_include_tax' => ['required', 'boolean'], 'credit_amount' => ['nullable', 'required_if:type,credit_note', 'numeric', 'gt:0'], 'notes' => ['nullable', 'string', 'max:3000']];
    }
}
