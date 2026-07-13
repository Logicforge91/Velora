<?php
namespace App\Http\Requests\Admin;
use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateShipmentRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission(AccountPermission::ManageOrders) ?? false; }
    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array { return ['carrier' => ['nullable', 'string', 'max:100'], 'tracking_number' => ['nullable', 'string', 'max:150', Rule::unique('shipments', 'tracking_number')->ignore($this->route('shipment'))], 'status' => ['required', Rule::in(['pending', 'packed', 'shipped', 'in_transit', 'delivered', 'returned'])], 'estimated_delivery_at' => ['nullable', 'date'], 'notes' => ['nullable', 'string', 'max:3000']]; }
}
