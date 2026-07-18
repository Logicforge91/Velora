<?php

namespace App\Http\Requests\Admin;

use App\Models\ServiceArea;
use Illuminate\Contracts\Validation\ValidationRule;

class UpdateServiceAreaRequest extends StoreServiceAreaRequest
{
    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        $serviceArea = $this->route('service_area');

        return $this->rulesForServiceArea($serviceArea instanceof ServiceArea ? $serviceArea->id : null);
    }
}
