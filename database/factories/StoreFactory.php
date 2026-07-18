<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Store> */
class StoreFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => Str::upper(fake()->unique()->bothify('WH-??-###')),
            'name' => fake()->city().' Fulfilment Centre',
            'type' => 'fulfilment_center',
            'contact_name' => fake()->name(),
            'contact_phone' => fake()->numerify('9#########'),
            'address' => ['line_1' => fake()->streetAddress()],
            'city' => fake()->city(),
            'state' => 'Karnataka',
            'postal_code' => fake()->numerify('######'),
            'capacity' => 10000,
            'priority' => 100,
            'status' => true,
        ];
    }
}
