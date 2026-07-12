<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\VendorController;

Route::inertia('/', 'welcome')->name('home');

// Route::prefix('{current_team}')
//     ->middleware(['auth', 'verified', EnsureTeamMembership::class])
//     ->group(function () {
//         Route::get('dashboard', DashboardController::class)->name('dashboard');
//     });

Route::middleware('auth')
    ->get('/dashboard', DashboardController::class)
    ->name('dashboard');

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function (): void {
        Route::get('/dashboard', AdminDashboardController::class)
            ->name('dashboard');


              Route::get(
            '/vendors',
            [VendorController::class, 'index']
        )->name('vendors.index');

        Route::get(
            '/vendors/{vendor}',
            [VendorController::class, 'show']
        )->name('vendors.show');

        Route::patch(
            '/vendors/{vendor}/approve',
            [VendorController::class, 'approve']
        )->name('vendors.approve');

        Route::patch(
            '/vendors/{vendor}/reject',
            [VendorController::class, 'reject']
        )->name('vendors.reject');
    });



Route::middleware('auth')->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
