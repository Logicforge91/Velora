<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Address> */
class AddressFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(Address::types()),
            'label' => null,
            'recipient_name' => fake()->name(),
            'phone' => fake()->numerify('9#########'),
            'alternate_phone' => null,
            'line_1' => fake()->streetAddress(),
            'line_2' => null,
            'landmark' => fake()->optional()->streetName(),
            'city' => fake()->city(),
            'district' => null,
            'state' => fake()->randomElement([
                'Delhi',
                'Gujarat',
                'Karnataka',
                'Maharashtra',
                'Tamil Nadu',
                'Uttar Pradesh',
                'West Bengal',
            ]),
            'state_code' => fake()->lexify('??'),
            'postal_code' => fake()->numerify('######'),
            'country_code' => 'IN',
            'latitude' => fake()->latitude(8, 37),
            'longitude' => fake()->longitude(68, 97),
            'delivery_instructions' => null,
            'is_default_shipping' => false,
            'is_default_billing' => false,
            'is_serviceable' => true,
            'verified_at' => null,
        ];
    }

    public function defaultShipping(): static
    {
        return $this->state(fn (): array => ['is_default_shipping' => true]);
    }
}
