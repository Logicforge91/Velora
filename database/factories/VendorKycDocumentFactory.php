<?php

namespace Database\Factories;

use App\Models\Vendor;
use App\Models\VendorKycDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VendorKycDocument>
 */
class VendorKycDocumentFactory extends Factory
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
            'type' => fake()->randomElement(VendorKycDocument::types()),
            'document_number' => fake()->bothify('????######'),
            'file_path' => 'vendor-kyc/fixture/document.pdf',
            'original_name' => 'verification-document.pdf',
            'mime_type' => 'application/pdf',
            'size' => 1024,
            'status' => VendorKycDocument::STATUS_PENDING,
        ];
    }
}
