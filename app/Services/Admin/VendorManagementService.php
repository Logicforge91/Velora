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
                fn (Builder $query): Builder =>
                    $query->where('status', $status)
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }

    public function getStatusCounts(): array
    {
        $counts = Vendor::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return [
            'all' => Vendor::query()->count(),

            'pending' => (int) $counts->get(
                Vendor::STATUS_PENDING,
                0
            ),

            'approved' => (int) $counts->get(
                Vendor::STATUS_APPROVED,
                0
            ),

            'rejected' => (int) $counts->get(
                Vendor::STATUS_REJECTED,
                0
            ),
        ];
    }

    public function approve(
        Vendor $vendor,
        User $admin
    ): Vendor {
        if (!$vendor->isPending()) {
            throw ValidationException::withMessages([
                'vendor' =>
                    'Only pending vendor applications can be approved.',
            ]);
        }

        return DB::transaction(
            function () use ($vendor, $admin): Vendor {
                $vendor->update([
                    'status' => Vendor::STATUS_APPROVED,
                    'rejection_reason' => null,
                    'approved_at' => now(),
                    'approved_by' => $admin->id,
                ]);

                $vendor->user()->update([
                    'role' => User::ROLE_VENDOR,
                    'status' => true,
                ]);

                return $vendor->fresh([
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
        if (!$vendor->isPending()) {
            throw ValidationException::withMessages([
                'vendor' =>
                    'Only pending vendor applications can be rejected.',
            ]);
        }

        return DB::transaction(
            function () use (
                $vendor,
                $admin,
                $rejectionReason
            ): Vendor {
                $vendor->update([
                    'status' => Vendor::STATUS_REJECTED,
                    'rejection_reason' => trim($rejectionReason),
                    'approved_at' => null,
                    'approved_by' => $admin->id,
                ]);

                $vendor->user()->update([
                    'role' => User::ROLE_CUSTOMER,
                ]);

                return $vendor->fresh([
                    'user',
                    'approvedBy',
                ]);
            }
        );
    }
}
