<?php

use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorKycDocument;
use App\Services\Admin\VendorManagementService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('administrators can create pending seller applications', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('admin.vendors.store'), [
            'owner_name' => 'Aarav Mehta',
            'owner_email' => 'aarav@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
            'business_name' => 'Mehta Retail',
            'business_email' => 'commerce@mehta.example',
            'business_phone' => '9876543210',
            'tax_number' => '29ABCDE1234F1Z5',
            'address' => 'Bengaluru, Karnataka',
            'bank_account_name' => 'Mehta Retail',
            'bank_account_number' => '1234567890',
            'bank_ifsc' => 'HDFC0001234',
            'commission_rate' => 12.5,
            'settlement_cycle' => 'weekly',
        ])
        ->assertRedirect();

    $vendor = Vendor::query()->where('business_email', 'commerce@mehta.example')->firstOrFail();

    expect($vendor)
        ->status->toBe(Vendor::STATUS_PENDING)
        ->commission_rate->toBe('12.50')
        ->and($vendor->user)
        ->name->toBe('Aarav Mehta')
        ->role->toBe(User::ROLE_CUSTOMER)
        ->and(Hash::check('SecurePassword123!', $vendor->user->password))->toBeTrue()
        ->and($vendor->reviewEvents()->where('action', 'application_created')->exists())->toBeTrue();
});

test('seller management filters applications by KYC and risk state', function () {
    $admin = User::factory()->admin()->create();
    $matchingVendor = Vendor::factory()->create([
        'kyc_status' => 'in_review',
        'risk_level' => 'high',
    ]);
    Vendor::factory()->create([
        'kyc_status' => 'verified',
        'risk_level' => 'low',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.vendors.index', [
            'kyc_status' => 'in_review',
            'risk_level' => 'high',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/vendors/index')
            ->has('vendors.data', 1)
            ->where('vendors.data.0.id', $matchingVendor->id));
});

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
