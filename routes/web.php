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
use App\Http\Controllers\Admin\SettlementController;
use App\Http\Controllers\Admin\ShipmentController as AdminShipmentController;
use App\Http\Controllers\Admin\SupportMessageController;
use App\Http\Controllers\Admin\SupportTicketController;
use App\Http\Controllers\Admin\TaxInvoiceController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\VendorKycDocumentController;
use App\Http\Controllers\Admin\WarehouseController;
use App\Http\Controllers\Admin\WarehouseInventoryController;
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
                Route::patch('{vendor}/risk', 'updateRisk')->name('risk.update');
                Route::post('{vendor}/kyc-documents', [VendorKycDocumentController::class, 'store'])->name('kyc-documents.store');
                Route::patch('{vendor}/kyc-documents/{kycDocument}', [VendorKycDocumentController::class, 'update'])->scopeBindings()->name('kyc-documents.update');
                Route::get('{vendor}/kyc-documents/{kycDocument}/download', [VendorKycDocumentController::class, 'download'])->scopeBindings()->name('kyc-documents.download');
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

        Route::resource('settlements', SettlementController::class)
            ->only(['index', 'create', 'store', 'show', 'update']);

        Route::post('support/{support}/messages', SupportMessageController::class)->name('support.messages.store');
        Route::resource('support', SupportTicketController::class)->only(['index', 'create', 'store', 'show', 'update']);

        Route::resource('tax-invoices', TaxInvoiceController::class)->only(['index', 'create', 'store', 'show', 'update']);

        Route::put('warehouses/{warehouse}/inventory', WarehouseInventoryController::class)
            ->name('warehouses.inventory.update');
        Route::resource('warehouses', WarehouseController::class);

        Route::get('users/{user}/history', [UserController::class, 'history'])
            ->name('users.history');

        Route::resource('users', UserController::class);
    });

Route::middleware('auth')->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
