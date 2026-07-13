<?php

namespace Database\Factories;

use App\Models\Vendor;
use App\Models\VendorReviewEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VendorReviewEvent>
 */
class VendorReviewEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vendor_id' => Vendor::factory(),
            'action' => 'application_submitted',
            'from_status' => null,
            'to_status' => 'pending',
            'notes' => fake()->sentence(),
            'metadata' => [],
        ];
    }
}
