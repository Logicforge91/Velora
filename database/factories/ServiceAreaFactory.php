<?php

namespace Database\Factories;

use App\Models\ServiceArea;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ServiceArea> */
class ServiceAreaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'store_id' => Store::factory(),
            'postal_code' => fake()->numerify('######'),
            'city' => fake()->city(),
            'state' => 'Karnataka',
            'country_code' => 'IN',
            'prepaid_available' => true,
            'cod_available' => true,
            'express_available' => false,
            'minimum_delivery_days' => 2,
            'maximum_delivery_days' => 7,
            'shipping_charge' => 0,
            'cod_charge' => 0,
            'status' => 'active',
        ];
    }
}
