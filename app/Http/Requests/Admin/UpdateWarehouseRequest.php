<?php

namespace App\Http\Requests\Admin;

use Illuminate\Validation\Rule;

class UpdateWarehouseRequest extends StoreWarehouseRequest
{
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'code' => ['required', 'string', 'max:30', Rule::unique('stores')->ignore($this->route('warehouse'))],
        ];
    }
}
