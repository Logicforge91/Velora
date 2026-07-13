<?php

namespace App\Services\Admin;

use App\Enums\AccountRole;
use App\Models\User;
use App\Models\UserHistory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UserManagementService
{
    /**
     * @param  array{search?: mixed, role?: mixed, status?: mixed}  $filters
     * @return LengthAwarePaginator<int, User>
     */
    public function getUsers(array $filters = []): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $role = (string) ($filters['role'] ?? '');
        $status = (string) ($filters['status'] ?? '');

        return User::query()
            ->select(['id', 'name', 'email', 'role', 'status', 'email_verified_at', 'created_at', 'updated_at'])
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(AccountRole::tryFrom($role), fn (Builder $query): Builder => $query->where('role', $role))
            ->when($status === 'active', fn (Builder $query): Builder => $query->where('status', true))
            ->when($status === 'inactive', fn (Builder $query): Builder => $query->where('status', false))
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }

    /** @return array{all: int, active: int, inactive: int, administrators: int} */
    public function getCounts(): array
    {
        $counts = User::query()
            ->selectRaw(
                'COUNT(*) as total,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as inactive,
                SUM(CASE WHEN role = ? THEN 1 ELSE 0 END) as administrators',
                [true, false, AccountRole::Admin->value],
            )
            ->toBase()
            ->firstOrFail();

        return [
            'all' => (int) $counts->total,
            'active' => (int) $counts->active,
            'inactive' => (int) $counts->inactive,
            'administrators' => (int) $counts->administrators,
        ];
    }

    /** @return list<array{value: string, label: string}> */
    public function getRoles(): array
    {
        return array_map(
            fn (AccountRole $role): array => ['value' => $role->value, 'label' => $role->label()],
            AccountRole::cases(),
        );
    }

    /** @param array<string, mixed> $data */
    public function create(array $data, User $actor, ?string $ipAddress): User
    {
        return DB::transaction(function () use ($data, $actor, $ipAddress): User {
            $user = User::query()->create($data);

            $this->recordHistory($user, $actor, 'created', null, $ipAddress);

            return $user;
        });
    }

    /** @param array<string, mixed> $data */
    public function update(User $user, array $data, User $actor, ?string $ipAddress): User
    {
        if ($user->is($actor) && (($data['role'] ?? null) !== AccountRole::Admin->value || ! ($data['status'] ?? false))) {
            throw ValidationException::withMessages([
                'user' => 'You cannot deactivate or remove the administrator role from your own account.',
            ]);
        }

        return DB::transaction(function () use ($user, $data, $actor, $ipAddress): User {
            $trackedAttributes = ['name', 'email', 'role', 'status'];
            $before = Arr::only($user->getAttributes(), $trackedAttributes);

            if (($data['password'] ?? '') === '') {
                unset($data['password']);
            }

            $user->update($data);
            $after = Arr::only($user->getAttributes(), $trackedAttributes);
            $changes = [];

            foreach ($trackedAttributes as $attribute) {
                if ($before[$attribute] !== $after[$attribute]) {
                    $changes[$attribute] = ['from' => $before[$attribute], 'to' => $after[$attribute]];
                }
            }

            if (array_key_exists('password', $data)) {
                $changes['password'] = ['from' => null, 'to' => 'updated'];
            }

            if ($changes !== []) {
                $this->recordHistory($user, $actor, 'updated', $changes, $ipAddress);
            }

            return $user->fresh();
        });
    }

    public function delete(User $user, User $actor, ?string $ipAddress): void
    {
        if ($user->is($actor)) {
            throw ValidationException::withMessages(['user' => 'You cannot delete your own administrator account.']);
        }

        if ($user->hasRole(AccountRole::Admin) && $user->isActive() && $this->activeAdministratorCount() <= 1) {
            throw ValidationException::withMessages(['user' => 'The final active administrator cannot be deleted.']);
        }

        DB::transaction(function () use ($user, $actor, $ipAddress): void {
            $this->recordHistory($user, $actor, 'deleted', null, $ipAddress);
            $user->delete();
        });
    }

    /** @return LengthAwarePaginator<int, UserHistory> */
    public function getHistory(User $user): LengthAwarePaginator
    {
        return $user->histories()
            ->with('actor:id,name,email')
            ->latest()
            ->paginate(20);
    }

    private function activeAdministratorCount(): int
    {
        return User::query()
            ->where('role', AccountRole::Admin->value)
            ->where('status', true)
            ->count();
    }

    /** @param array<string, array{from: mixed, to: mixed}>|null $changes */
    private function recordHistory(
        User $user,
        User $actor,
        string $action,
        ?array $changes,
        ?string $ipAddress,
    ): UserHistory {
        return $user->histories()->create([
            'actor_id' => $actor->id,
            'action' => $action,
            'changes' => $changes,
            'snapshot' => $user->only(['id', 'name', 'email', 'role', 'status']),
            'ip_address' => $ipAddress,
        ]);
    }
}
