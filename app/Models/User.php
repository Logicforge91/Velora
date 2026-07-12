<?php

namespace App\Models;

use App\Concerns\HasTeams;
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
        return $this->role === self::ROLE_ADMIN;
    }

    public function isVendor(): bool
    {
        return $this->role === self::ROLE_VENDOR;
    }

    public function isCustomer(): bool
    {
        return $this->role === self::ROLE_CUSTOMER;
    }

    public function isActive(): bool
    {
        return $this->status === true;
    }
}
