<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VendorManagementService
{
    public function getVendors(array $filters = []): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = (string) ($filters['status'] ?? '');

        return Vendor::query()
            ->with([
                'user:id,name,email,status,created_at',
                'approvedBy:id,name,email',
            ])
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

                return $lockedVendor->fresh([
                    'user',
                    'approvedBy',
                ]);
            }
        );
    }
}
