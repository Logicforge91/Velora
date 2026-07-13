<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('auth')
    ->get('/dashboard', DashboardController::class)
    ->name('dashboard');

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function (): void {
        Route::get('dashboard', AdminDashboardController::class)
            ->name('dashboard');

        Route::resource('brands', BrandController::class)
            ->except('show');

        Route::controller(VendorController::class)
            ->prefix('vendors')
            ->name('vendors.')
            ->group(function (): void {
                Route::get('/', 'index')->name('index');
                Route::get('{vendor}', 'show')->name('show');
                Route::patch('{vendor}/approve', 'approve')->name('approve');
                Route::patch('{vendor}/reject', 'reject')->name('reject');
            });

        Route::resource('categories', CategoryController::class)
            ->except('show');

        Route::get('users/{user}/history', [UserController::class, 'history'])
            ->name('users.history');

        Route::resource('users', UserController::class);
    });

Route::middleware('auth')->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
