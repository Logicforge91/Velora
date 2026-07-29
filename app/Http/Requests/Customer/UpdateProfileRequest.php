<?php

namespace App\Http\Requests\Customer;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isCustomer() === true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            ...$this->profileRules($this->user()->id),
            'phone' => ['nullable', 'string', 'max:30'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', Rule::in(['female', 'male', 'non_binary', 'prefer_not_to_say'])],
            'locale' => ['required', Rule::in(['en', 'hi', 'ta', 'te', 'bn'])],
            'preferred_currency' => ['required', Rule::in(['INR', 'USD', 'EUR', 'GBP'])],
            'communication_preferences' => ['required', 'array'],
            'communication_preferences.email' => ['boolean'],
            'communication_preferences.sms' => ['boolean'],
            'communication_preferences.push' => ['boolean'],
            'communication_preferences.marketing' => ['boolean'],
            'privacy_settings' => ['required', 'array'],
            'privacy_settings.personalization' => ['boolean'],
            'privacy_settings.analytics' => ['boolean'],
            'privacy_settings.profile_visibility' => ['boolean'],
        ];
    }
}
