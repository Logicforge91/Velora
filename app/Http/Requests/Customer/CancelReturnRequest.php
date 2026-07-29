<?php

namespace App\Http\Requests\Customer;

use App\Models\ReturnCase;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CancelReturnRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $returnCase = $this->route('returnCase');

        return $returnCase instanceof ReturnCase
            && $returnCase->customer_id === $this->user()?->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'confirmed' => ['accepted'],
        ];
    }
}
