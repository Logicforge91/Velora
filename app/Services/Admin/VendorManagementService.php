<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorKycDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class VendorManagementService
{
    /** @var list<string> */
    public const REQUIRED_KYC_TYPES = ['pan', 'gst_registration', 'bank_proof', 'address_proof', 'identity_proof'];

    public function getVendors(array $filters = []): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');
        $kycStatus = (string) ($filters['kyc_status'] ?? '');
        $riskLevel = (string) ($filters['risk_level'] ?? '');

        return Vendor::query()
            ->with([
                'user:id,name,email,status,created_at',
                'approvedBy:id,name,email',
            ])
            ->withCount(['kycDocuments', 'kycDocuments as verified_documents_count' => fn (Builder $query): Builder => $query->where('status', VendorKycDocument::STATUS_VERIFIED)])
            ->when(
                $search !== '',
                function (Builder $query) use ($search): void {
                    $query->where(
                        function (Builder $query) use ($search): void {
                            $query
                                ->where(
                                    'business_name',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'business_email',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'business_phone',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'tax_number',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhereHas(
                                    'user',
                                    function (Builder $userQuery) use ($search): void {
                                        $userQuery
                                            ->where(
                                                'name',
                                                'like',
                                                "%{$search}%"
                                            )
                                            ->orWhere(
                                                'email',
                                                'like',
                                                "%{$search}%"
                                            );
                                    }
                                );
                        }
                    );
                }
            )
            ->when(
                in_array($status, Vendor::statuses(), true),
                fn (Builder $query): Builder => $query->where('status', $status)
            )
            ->when(in_array($kycStatus, ['pending', 'in_review', 'verified', 'rejected'], true), fn (Builder $query): Builder => $query->where('kyc_status', $kycStatus))
            ->when(in_array($riskLevel, ['unassessed', 'low', 'medium', 'high'], true), fn (Builder $query): Builder => $query->where('risk_level', $riskLevel))
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }

    public function getStatusCounts(): array
    {
        $counts = Vendor::query()
            ->selectRaw(
                'COUNT(*) as total,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as rejected',
                [
                    Vendor::STATUS_PENDING,
                    Vendor::STATUS_APPROVED,
                    Vendor::STATUS_REJECTED,
                ],
            )
            ->toBase()
            ->firstOrFail();

        return [
            'all' => (int) $counts->total,
            'pending' => (int) $counts->pending,
            'approved' => (int) $counts->approved,
            'rejected' => (int) $counts->rejected,
            'kyc_review' => Vendor::query()->where('kyc_status', 'in_review')->count(),
            'high_risk' => Vendor::query()->where('risk_level', 'high')->count(),
        ];
    }

    public function approve(
        Vendor $vendor,
        User $admin
    ): Vendor {
        return DB::transaction(
            function () use ($vendor, $admin): Vendor {
                $lockedVendor = Vendor::query()
                    ->lockForUpdate()
                    ->findOrFail($vendor->getKey());

                if (! $lockedVendor->isPending()) {
                    throw ValidationException::withMessages([
                        'vendor' => 'Only pending vendor applications can be approved.',
                    ]);
                }

                if ($lockedVendor->kyc_status !== 'verified') {
                    throw ValidationException::withMessages(['vendor' => 'Complete and verify all required KYC documents before approval.']);
                }

                if ($lockedVendor->risk_level === 'high') {
                    throw ValidationException::withMessages(['vendor' => 'High-risk applications require risk remediation before approval.']);
                }

                $lockedVendor->update([
                    'status' => Vendor::STATUS_APPROVED,
                    'rejection_reason' => null,
                    'approved_at' => now(),
                    'approved_by' => $admin->id,
                ]);

                $lockedVendor->user()->update([
                    'role' => User::ROLE_VENDOR,
                    'status' => true,
                ]);

                $this->recordEvent($lockedVendor, $admin, 'application_approved', Vendor::STATUS_PENDING, Vendor::STATUS_APPROVED);

                return $lockedVendor->fresh([
                    'user',
                    'approvedBy',
                ]);
            }
        );
    }

    public function reject(
        Vendor $vendor,
        User $admin,
        string $rejectionReason
    ): Vendor {
        return DB::transaction(
            function () use (
                $vendor,
                $admin,
                $rejectionReason
            ): Vendor {
                $lockedVendor = Vendor::query()
                    ->lockForUpdate()
                    ->findOrFail($vendor->getKey());

                if (! $lockedVendor->isPending()) {
                    throw ValidationException::withMessages([
                        'vendor' => 'Only pending vendor applications can be rejected.',
                    ]);
                }

                $lockedVendor->update([
                    'status' => Vendor::STATUS_REJECTED,
                    'rejection_reason' => trim($rejectionReason),
                    'approved_at' => null,
                    'approved_by' => $admin->id,
                ]);

                $lockedVendor->user()->update([
                    'role' => User::ROLE_CUSTOMER,
                ]);

                $this->recordEvent($lockedVendor, $admin, 'application_rejected', Vendor::STATUS_PENDING, Vendor::STATUS_REJECTED, $rejectionReason);

                return $lockedVendor->fresh([
                    'user',
                    'approvedBy',
                ]);
            }
        );
    }

    public function storeDocument(Vendor $vendor, User $actor, UploadedFile $file, array $data): VendorKycDocument
    {
        $path = $file->store("vendor-kyc/{$vendor->id}", 'local');

        try {
            return DB::transaction(function () use ($vendor, $actor, $file, $data, $path): VendorKycDocument {
                $existing = VendorKycDocument::query()->whereBelongsTo($vendor)->where('type', $data['type'])->lockForUpdate()->first();
                $oldPath = $existing?->file_path;
                $document = VendorKycDocument::query()->updateOrCreate(
                    ['vendor_id' => $vendor->id, 'type' => $data['type']],
                    ['document_number' => $data['document_number'] ?? null, 'file_path' => $path, 'original_name' => basename($file->getClientOriginalName()), 'mime_type' => (string) $file->getMimeType(), 'size' => $file->getSize(), 'status' => VendorKycDocument::STATUS_PENDING, 'rejection_reason' => null, 'expires_on' => $data['expires_on'] ?? null, 'uploaded_by' => $actor->id, 'reviewed_by' => null, 'reviewed_at' => null]
                );

                $this->refreshKycStatus($vendor, $actor, 'document_uploaded', ['document_type' => $document->type]);

                if ($oldPath && $oldPath !== $path) {
                    Storage::disk('local')->delete($oldPath);
                }

                return $document->fresh(['uploader', 'reviewer']);
            });
        } catch (\Throwable $exception) {
            Storage::disk('local')->delete($path);
            throw $exception;
        }
    }

    public function reviewDocument(Vendor $vendor, VendorKycDocument $document, User $actor, array $data): VendorKycDocument
    {
        return DB::transaction(function () use ($vendor, $document, $actor, $data): VendorKycDocument {
            $locked = VendorKycDocument::query()->whereBelongsTo($vendor)->lockForUpdate()->findOrFail($document->id);
            $locked->update(['status' => $data['status'], 'rejection_reason' => $data['status'] === VendorKycDocument::STATUS_REJECTED ? trim((string) $data['rejection_reason']) : null, 'reviewed_by' => $actor->id, 'reviewed_at' => now()]);
            $this->refreshKycStatus($vendor, $actor, 'document_'.$data['status'], ['document_type' => $locked->type]);

            return $locked->fresh(['uploader', 'reviewer']);
        });
    }

    public function updateRisk(Vendor $vendor, User $actor, array $data): Vendor
    {
        return DB::transaction(function () use ($vendor, $actor, $data): Vendor {
            $locked = Vendor::query()->lockForUpdate()->findOrFail($vendor->id);
            $previous = $locked->risk_level;
            $locked->update(['risk_level' => $data['risk_level'], 'risk_score' => $data['risk_score'], 'risk_flags' => $data['risk_flags']]);
            $this->recordEvent($locked, $actor, 'risk_assessed', $previous, $locked->risk_level, $data['notes'] ?? null, ['score' => $locked->risk_score, 'flags' => $locked->risk_flags]);

            return $locked->fresh();
        });
    }

    private function refreshKycStatus(Vendor $vendor, User $actor, string $action, array $metadata): void
    {
        $documents = VendorKycDocument::query()->whereBelongsTo($vendor)->get(['type', 'status']);
        $verifiedTypes = $documents->where('status', VendorKycDocument::STATUS_VERIFIED)->pluck('type');
        $status = $documents->contains('status', VendorKycDocument::STATUS_REJECTED)
            ? 'rejected'
            : (collect(self::REQUIRED_KYC_TYPES)->every(fn (string $type): bool => $verifiedTypes->contains($type)) ? 'verified' : ($documents->isEmpty() ? 'pending' : 'in_review'));
        $previous = $vendor->kyc_status;
        $vendor->update(['kyc_status' => $status, 'onboarding_stage' => $status === 'verified' ? 'approval' : 'kyc_review', 'submitted_at' => $vendor->submitted_at ?? now(), 'kyc_verified_at' => $status === 'verified' ? now() : null, 'kyc_verified_by' => $status === 'verified' ? $actor->id : null]);
        $this->recordEvent($vendor, $actor, $action, $previous, $status, metadata: $metadata);
    }

    private function recordEvent(Vendor $vendor, User $actor, string $action, ?string $fromStatus = null, ?string $toStatus = null, ?string $notes = null, ?array $metadata = null): void
    {
        $vendor->reviewEvents()->create(['actor_id' => $actor->id, 'action' => $action, 'from_status' => $fromStatus, 'to_status' => $toStatus, 'notes' => $notes, 'metadata' => $metadata]);
    }
}
