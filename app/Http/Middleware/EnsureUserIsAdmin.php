<?php

namespace App\Http\Middleware;

use App\Enums\AccountPermission;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('admin.login');
        }

        if (! $user->hasPermission(AccountPermission::AccessAdminDashboard)) {
            abort(403, 'You are not authorized to access the admin panel.');
        }

        if (! $user->isActive()) {
            auth()->logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()
                ->route('admin.login')
                ->withErrors([
                    'email' => 'Your account has been disabled.',
                ]);
        }

        return $next($request);
    }
}
