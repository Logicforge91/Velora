<?php
namespace App\Http\Requests\Admin;
use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission(AccountPermission::ManagePayments) ?? false; }
    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array { return ['status' => ['required', Rule::in(['pending', 'paid', 'failed', 'partially_refunded', 'refunded'])], 'refunded_amount' => ['required', 'numeric', 'min:0'], 'transaction_id' => ['nullable', 'string', 'max:150']]; }
}
