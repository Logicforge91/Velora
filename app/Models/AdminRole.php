<?php

namespace App\Models;

use App\Enums\AccountPermission;
use Database\Factories\AdminRoleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AdminRole extends Model
{
    /** @use HasFactory<AdminRoleFactory> */
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'permissions', 'is_system'];

    protected $attributes = ['is_system' => false];

    protected function casts(): array
    {
        return ['permissions' => 'array', 'is_system' => 'boolean'];
    }

    /** @return list<AccountPermission> */
    public function permissionEnums(): array
    {
        return collect($this->permissions ?? [])
            ->map(fn (string $permission): ?AccountPermission => AccountPermission::tryFrom($permission))
            ->filter()
            ->values()
            ->all();
    }

    /** @return BelongsToMany<User, $this> */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}
