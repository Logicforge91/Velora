<?php

namespace App\Models;

use App\Concerns\HasTeams;
use App\Enums\AccountPermission;
use App\Enums\AccountRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use HasTeams;
    use Notifiable;

    public const ROLE_ADMIN = 'admin';

    public const ROLE_VENDOR = 'vendor';

    public const ROLE_CUSTOMER = 'customer';

    public const ROLE_DELIVERY_AGENT = 'delivery_agent';

    public const ROLE_SUPPORT_AGENT = 'support_agent';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'current_team_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(AccountRole::Admin);
    }

    public function isVendor(): bool
    {
        return $this->hasRole(AccountRole::Vendor);
    }

    public function isCustomer(): bool
    {
        return $this->hasRole(AccountRole::Customer);
    }

    public function accountRole(): ?AccountRole
    {
        return AccountRole::tryFrom($this->role);
    }

    public function hasRole(AccountRole|string $role): bool
    {
        $role = is_string($role) ? AccountRole::tryFrom($role) : $role;

        return $role !== null && $this->accountRole() === $role;
    }

    /** @return list<AccountPermission> */
    public function permissions(): array
    {
        return $this->accountRole()?->permissions() ?? [];
    }

    public function hasPermission(AccountPermission|string $permission): bool
    {
        $permission = is_string($permission) ? AccountPermission::tryFrom($permission) : $permission;

        return $permission !== null && $this->accountRole()?->hasPermission($permission) === true;
    }

    public function isActive(): bool
    {
        return $this->status === true;
    }
}
