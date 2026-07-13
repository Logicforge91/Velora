<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReturnController as AdminReturnController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\ShipmentController as AdminShipmentController;
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

        Route::get('analytics', AnalyticsController::class)
            ->name('analytics');

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

        Route::resource('products', AdminProductController::class)
            ->except('show');

        Route::resource('orders', OrderController::class)
            ->only(['index', 'show', 'update']);

        Route::resource('coupons', CouponController::class)
            ->except('show');

        Route::resource('reviews', AdminReviewController::class)
            ->only(['index', 'update']);

        Route::resource('payments', AdminPaymentController::class)
            ->only(['index', 'update']);

        Route::resource('shipments', AdminShipmentController::class)
            ->only(['index', 'update']);

        Route::resource('returns', AdminReturnController::class)
            ->only(['index', 'create', 'store', 'show', 'update']);

        Route::get('users/{user}/history', [UserController::class, 'history'])
            ->name('users.history');

        Route::resource('users', UserController::class);
    });

Route::middleware('auth')->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
