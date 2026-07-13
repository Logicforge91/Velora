<?php

namespace App\Http\Middleware;

use App\Services\Admin\AuditLogService;
use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class CaptureAdminAuditLog
{
    public function __construct(private readonly AuditLogService $service) {}

    /** @param Closure(Request): Response $next */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->shouldCapture($request)) {
            return $next($request);
        }

        $startedAt = hrtime(true);
        $auditable = $this->auditable($request);
        $before = $auditable?->getAttributes();

        try {
            $response = $next($request);
            $status = $response->getStatusCode();
            if ($status >= 300 && $status < 400 && $request->hasSession() && $request->session()->has('errors')) {
                $status = 422;
            }
            $this->record($request, $status, $startedAt, $auditable, $before);

            return $response;
        } catch (\Throwable $exception) {
            $status = $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : 500;
            $this->record($request, $status, $startedAt, $auditable, $before, $exception);

            throw $exception;
        }
    }

    private function shouldCapture(Request $request): bool
    {
        $routeName = (string) $request->route()?->getName();

        return ! str_starts_with($routeName, 'admin.audit-logs.')
            && ($request->method() !== 'GET' || str_ends_with($routeName, '.download'));
    }

    private function auditable(Request $request): ?Model
    {
        foreach ($request->route()?->parameters() ?? [] as $parameter) {
            if ($parameter instanceof Model) {
                return $parameter;
            }
        }

        return null;
    }

    /** @param array<string, mixed>|null $before */
    private function record(Request $request, int $status, int $startedAt, ?Model $auditable, ?array $before, ?\Throwable $exception = null): void
    {
        try {
            $after = null;
            if ($auditable?->exists) {
                $fresh = $auditable->newQuery()->whereKey($auditable->getKey())->first();
                $after = $fresh?->getAttributes();
            }

            $this->service->record($request, $status, (int) round((hrtime(true) - $startedAt) / 1_000_000), $auditable, $before, $after, $exception);
        } catch (\Throwable $auditException) {
            Log::error('Unable to capture admin audit record.', ['exception' => $auditException, 'route' => $request->route()?->getName()]);
        }
    }
}
