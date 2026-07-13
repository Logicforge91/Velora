<?php

namespace App\Services\Admin;

use App\Models\AdminAuditLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class AuditLogService
{
    /** @var list<string> */
    private const SENSITIVE_KEYS = ['password', 'password_confirmation', 'current_password', 'token', 'secret', 'two_factor_secret', 'two_factor_recovery_codes', 'bank_account_number', 'document_number', 'api_key', 'authorization', 'cookie'];

    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, AdminAuditLog>
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));

        return AdminAuditLog::query()
            ->with('actor:id,name,email')
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('description', 'like', "%{$search}%")
                        ->orWhere('event_uuid', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhereHas('actor', fn (Builder $query): Builder => $query->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->when(filled($filters['category'] ?? null), fn (Builder $query): Builder => $query->where('category', $filters['category']))
            ->when(filled($filters['severity'] ?? null), fn (Builder $query): Builder => $query->where('severity', $filters['severity']))
            ->when(filled($filters['actor_id'] ?? null), fn (Builder $query): Builder => $query->where('actor_id', $filters['actor_id']))
            ->when(filled($filters['date_from'] ?? null), fn (Builder $query): Builder => $query->whereDate('occurred_at', '>=', $filters['date_from']))
            ->when(filled($filters['date_to'] ?? null), fn (Builder $query): Builder => $query->whereDate('occurred_at', '<=', $filters['date_to']))
            ->latest('occurred_at')
            ->paginate(25)
            ->withQueryString();
    }

    /** @return array<string, int> */
    public function counts(): array
    {
        return [
            'total' => AdminAuditLog::query()->count(),
            'today' => AdminAuditLog::query()->whereDate('occurred_at', today())->count(),
            'warnings' => AdminAuditLog::query()->whereIn('severity', ['warning', 'critical'])->count(),
            'failed' => AdminAuditLog::query()->where('succeeded', false)->count(),
        ];
    }

    /**
     * @param  array<string, mixed>|null  $before
     * @param  array<string, mixed>|null  $after
     */
    public function record(Request $request, int $status, int $durationMs, ?Model $auditable, ?array $before, ?array $after, ?\Throwable $exception = null): AdminAuditLog
    {
        $routeName = $request->route()?->getName();
        $segments = explode('.', (string) $routeName);
        $category = $segments[1] ?? 'admin';
        $action = (string) end($segments);
        $severity = $status >= 500 ? 'critical' : ($status >= 400 ? 'warning' : (in_array($request->method(), ['DELETE', 'PATCH', 'PUT'], true) ? 'notice' : 'info'));
        $eventUuid = (string) Str::uuid();
        $payload = [
            'event_uuid' => $eventUuid,
            'actor_id' => $request->user()?->getAuthIdentifier(),
            'category' => Str::limit($category, 50, ''),
            'action' => Str::limit($action, 80, ''),
            'severity' => $severity,
            'description' => $this->description($category, $action, $status),
            'auditable_type' => $auditable?->getMorphClass(),
            'auditable_id' => $auditable?->getKey(),
            'route_name' => $routeName,
            'method' => $request->method(),
            'path' => Str::limit($request->path(), 500, ''),
            'response_status' => $status,
            'succeeded' => $status < 400,
            'duration_ms' => max(0, $durationMs),
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 2000, ''),
            'before_values' => $this->sanitize($before),
            'after_values' => $this->sanitize($after),
            'metadata' => $this->sanitize(['request' => $request->except(self::SENSITIVE_KEYS), 'exception' => $exception ? class_basename($exception) : null]),
            'occurred_at' => now()->startOfSecond(),
        ];
        $payload['record_hash'] = hash('sha256', $eventUuid);
        $log = AdminAuditLog::query()->create($payload);
        $log->refresh();
        $recordHash = $this->hashLog($log);
        AdminAuditLog::query()->whereKey($log->id)->update(['record_hash' => $recordHash]);

        return $log->forceFill(['record_hash' => $recordHash]);
    }

    public function isAuthentic(AdminAuditLog $log): bool
    {
        return hash_equals($log->record_hash, $this->hashLog($log));
    }

    /** @param array<string, mixed> $payload */
    private function hash(array $payload): string
    {
        $normalized = $payload;
        ksort($normalized);

        return hash_hmac('sha256', json_encode($normalized, JSON_THROW_ON_ERROR), (string) config('app.key'));
    }

    private function hashLog(AdminAuditLog $log): string
    {
        return $this->hash(Arr::except($log->attributesToArray(), ['id', 'record_hash']));
    }

    private function description(string $category, string $action, int $status): string
    {
        return Str::headline($category).' · '.Str::headline($action).' (HTTP '.$status.')';
    }

    private function sanitize(mixed $value, ?string $key = null): mixed
    {
        if ($key !== null && in_array(Str::lower($key), self::SENSITIVE_KEYS, true)) {
            return '[REDACTED]';
        }

        if ($value instanceof UploadedFile) {
            return ['name' => basename($value->getClientOriginalName()), 'mime' => $value->getMimeType(), 'size' => $value->getSize()];
        }

        if (is_array($value)) {
            return collect($value)->mapWithKeys(fn (mixed $item, string|int $itemKey): array => [$itemKey => $this->sanitize($item, (string) $itemKey)])->all();
        }

        return is_scalar($value) || $value === null ? $value : get_debug_type($value);
    }
}
