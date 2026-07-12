<?php

namespace App\Http\Middleware;

use App\Enums\AccountPermission;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $requiredPermission = AccountPermission::tryFrom($permission);

        abort_if($requiredPermission === null, 403);
        abort_unless($request->user()?->hasPermission($requiredPermission), 403);

        return $next($request);
    }
}
