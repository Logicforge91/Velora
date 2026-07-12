<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;

Route::inertia('/', 'welcome')->name('home');

// Route::prefix('{current_team}')
//     ->middleware(['auth', 'verified', EnsureTeamMembership::class])
//     ->group(function () {
//         Route::get('dashboard', DashboardController::class)->name('dashboard');
//     });

Route::middleware(['auth'])
    ->get('/dashboard', function () {
        $user = request()->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return view('dashboard');
    })
    ->name('dashboard');

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function (): void {
        Route::get('/dashboard', DashboardController::class)
            ->name('dashboard');
    });

// Route::middleware(['auth'])->group(function () {
//     Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
//     Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
// });

require __DIR__.'/settings.php';
