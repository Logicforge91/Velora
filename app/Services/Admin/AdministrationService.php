<?php

namespace App\Services\Admin;

use App\Enums\AccountPermission;
use App\Enums\AccountRole;
use App\Models\AdminAuditLog;
use App\Models\AdminRole;
use App\Models\ReturnCase;
use App\Models\SellerListing;
use App\Models\Team;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdministrationService
{
    /** @return array<string, int> */
    public function metrics(): array
    {
        $userCounts = User::query()
            ->selectRaw('SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) administrators', [AccountRole::Admin->value])
            ->selectRaw('SUM(CASE WHEN two_factor_confirmed_at IS NOT NULL THEN 1 ELSE 0 END) two_factor')
            ->toBase()
            ->firstOrFail();
        $approvalWorkflows = Vendor::query()->where('status', Vendor::STATUS_PENDING)->count()
            + SellerListing::query()->where('status', 'pending')->count()
            + ReturnCase::query()->where('status', 'requested')->count();
        $accessTokens = Schema::hasTable('personal_access_tokens') ? DB::table('personal_access_tokens')->count() : 0;
        $apiUsers = Schema::hasTable('personal_access_tokens')
            ? DB::table('personal_access_tokens')->where('tokenable_type', User::class)->distinct()->count('tokenable_id')
            : 0;
        $auditLogs = AdminAuditLog::query()->count();

        return [
            'admin_users' => (int) $userCounts->administrators,
            'teams' => Team::query()->count(),
            'departments' => 0,
            'roles' => AdminRole::query()->count(),
            'permissions' => count(AccountPermission::assignableToAdmin()),
            'approval_workflows' => $approvalWorkflows,
            'activity_logs' => $auditLogs,
            'login_history' => AdminAuditLog::query()->where(fn ($query) => $query->where('category', 'authentication')->orWhere('action', 'like', '%login%'))->count(),
            'audit_logs' => $auditLogs,
            'api_users' => $apiUsers,
            'access_tokens' => $accessTokens,
            'two_factor_authentication' => (int) $userCounts->two_factor,
            'ip_restrictions' => 0,
        ];
    }
}
