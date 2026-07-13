<?php
namespace App\Http\Requests\Admin;
use App\Enums\AccountPermission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ModerateReviewRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission(AccountPermission::ManageCatalogue) ?? false; }
    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array { return ['status' => ['required', Rule::in(['pending', 'approved', 'rejected'])]]; }
}
