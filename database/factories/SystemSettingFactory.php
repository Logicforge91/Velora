<?php

namespace Database\Factories;

use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SystemSetting>
 */
class SystemSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group' => fake()->unique()->slug(2),
            'values' => ['enabled' => true],
            'updated_by' => User::factory()->admin(),
        ];
    }
}
