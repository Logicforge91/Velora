<?php

use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorKycDocument;
use App\Services\Admin\VendorManagementService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('verified KYC and acceptable risk unlock seller approval', function () {
    Storage::fake('local');
    $admin = User::factory()->admin()->create();
    $vendor = Vendor::factory()->create();

    foreach (VendorManagementService::REQUIRED_KYC_TYPES as $type) {
        $this->actingAs($admin)->post(route('admin.vendors.kyc-documents.store', $vendor), [
            'type' => $type,
            'document_number' => 'DOC-'.$type,
            'document' => UploadedFile::fake()->create($type.'.pdf', 100, 'application/pdf'),
        ])->assertRedirect();

        $document = VendorKycDocument::query()->whereBelongsTo($vendor)->where('type', $type)->firstOrFail();
        $this->patch(route('admin.vendors.kyc-documents.update', [$vendor, $document]), [
            'status' => 'verified',
        ])->assertRedirect();
    }

    $this->patch(route('admin.vendors.risk.update', $vendor), [
        'risk_level' => 'low',
        'risk_score' => 12,
        'risk_flags' => [],
        'notes' => 'Identity and bank ownership checks passed.',
    ])->assertRedirect();
    $this->patch(route('admin.vendors.approve', $vendor))->assertRedirect();

    expect($vendor->fresh()->kyc_status)->toBe('verified')
        ->and($vendor->fresh()->status)->toBe(Vendor::STATUS_APPROVED)
        ->and($vendor->fresh()->reviewEvents()->count())->toBeGreaterThanOrEqual(11);
});

test('seller approval is blocked until required KYC is verified', function () {
    $admin = User::factory()->admin()->create();
    $vendor = Vendor::factory()->create(['risk_level' => 'low']);

    $this->actingAs($admin)
        ->from(route('admin.vendors.show', $vendor))
        ->patch(route('admin.vendors.approve', $vendor))
        ->assertSessionHasErrors('vendor');

    expect($vendor->fresh()->status)->toBe(Vendor::STATUS_PENDING);
});

test('KYC files remain private and are downloadable only by authorized administrators', function () {
    Storage::fake('local');
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->customer()->create();
    $vendor = Vendor::factory()->create();

    $this->actingAs($admin)->post(route('admin.vendors.kyc-documents.store', $vendor), [
        'type' => 'pan',
        'document' => UploadedFile::fake()->create('pan.pdf', 50, 'application/pdf'),
    ]);
    $document = VendorKycDocument::query()->whereBelongsTo($vendor)->firstOrFail();

    Storage::disk('local')->assertExists($document->file_path);
    $this->actingAs($admin)->get(route('admin.vendors.kyc-documents.download', [$vendor, $document]))->assertOk();
    $this->actingAs($customer)->get(route('admin.vendors.kyc-documents.download', [$vendor, $document]))->assertForbidden();
});
