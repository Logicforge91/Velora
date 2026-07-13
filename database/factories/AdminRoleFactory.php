<?php

namespace Database\Factories;

use App\Enums\AccountPermission;
use App\Models\AdminRole;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AdminRole>
 */
class AdminRoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->jobTitle(),
            'slug' => fake()->unique()->slug(2),
            'description' => fake()->sentence(),
            'permissions' => [
                AccountPermission::AccessAdminDashboard->value,
                fake()->randomElement(AccountPermission::assignableToAdmin())->value,
            ],
            'is_system' => false,
        ];
    }
}
