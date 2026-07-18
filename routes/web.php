<?php

use App\Http\Controllers\Admin\AdminRoleController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\ApplyPriceRecommendationController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CatalogImportController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\GrowthCentreController;
use App\Http\Controllers\Admin\InventoryOperationController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\PaymentRefundController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ProductVariantController;
use App\Http\Controllers\Admin\ReturnController as AdminReturnController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\SellerListingController;
use App\Http\Controllers\Admin\ServiceAreaController;
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
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Customer\ProfileController as CustomerProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StorefrontController;
use App\Http\Controllers\Teams\TeamInvitationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::controller(StorefrontController::class)
    ->name('storefront.')
    ->group(function (): void {
        Route::get('shop', 'catalog')->name('catalog');
        Route::get('products/{product}', 'product')->name('product');
        Route::get('wishlist', 'wishlist')->name('wishlist');
        Route::get('cart', 'cart')->name('cart');
        Route::get('checkout', 'checkout')->name('checkout');
    });

Route::middleware('guest')
    ->get('admin/login', AdminLoginController::class)
    ->name('admin.login');

Route::middleware('auth')
    ->get('/dashboard', DashboardController::class)
    ->name('dashboard');

Route::prefix('account')
    ->name('customer.')
    ->middleware('auth')
    ->group(function (): void {
        Route::get('profile', [CustomerProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('profile', [CustomerProfileController::class, 'update'])->name('profile.update');
    });

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin', 'admin.audit'])
    ->group(function (): void {
        Route::get('dashboard', AdminDashboardController::class)
            ->name('dashboard');

        Route::get('analytics', AnalyticsController::class)
            ->middleware('permission:reports.view')
            ->name('analytics');

        Route::get('growth-centre', GrowthCentreController::class)
            ->middleware('permission:reports.view')
            ->name('growth-centre');
        Route::patch('growth-centre/products/{product}/recommended-price', ApplyPriceRecommendationController::class)
            ->middleware('permission:catalogue.manage')
            ->name('growth-centre.recommended-price');

        Route::resource('audit-logs', AuditLogController::class)->only(['index', 'show'])->middleware('permission:reports.view');

        Route::resource('admin-roles', AdminRoleController::class)->except(['show'])->middleware('permission:roles.manage');

        Route::resource('brands', BrandController::class)
            ->except('show')
            ->middleware('permission:catalogue.manage');

        Route::get('catalog-imports/template', [CatalogImportController::class, 'template'])->middleware('permission:catalogue.manage')->name('catalog-imports.template');
        Route::resource('catalog-imports', CatalogImportController::class)->only(['index', 'create', 'store', 'show'])->middleware('permission:catalogue.manage');

        Route::controller(VendorController::class)
            ->prefix('vendors')
            ->name('vendors.')
            ->middleware('permission:vendors.manage')
            ->group(function (): void {
                Route::get('/', 'index')->name('index');
                Route::get('create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('{vendor}', 'show')->name('show');
                Route::patch('{vendor}/approve', 'approve')->name('approve');
                Route::patch('{vendor}/reject', 'reject')->name('reject');
                Route::patch('{vendor}/risk', 'updateRisk')->name('risk.update');
                Route::post('{vendor}/kyc-documents', [VendorKycDocumentController::class, 'store'])->name('kyc-documents.store');
                Route::patch('{vendor}/kyc-documents/{kycDocument}', [VendorKycDocumentController::class, 'update'])->scopeBindings()->name('kyc-documents.update');
                Route::get('{vendor}/kyc-documents/{kycDocument}/download', [VendorKycDocumentController::class, 'download'])->scopeBindings()->name('kyc-documents.download');
            });

        Route::resource('categories', CategoryController::class)
            ->except('show')
            ->middleware('permission:catalogue.manage');

        Route::resource('products', AdminProductController::class)
            ->except('show')
            ->middleware('permission:catalogue.manage');

        Route::resource('product-variants', ProductVariantController::class)
            ->except('show')
            ->middleware('permission:catalogue.manage');

        Route::resource('seller-listings', SellerListingController::class)
            ->only(['index', 'update'])
            ->middleware('permission:catalogue.manage');

        Route::resource('orders', OrderController::class)
            ->only(['index', 'show', 'update'])
            ->middleware('permission:orders.manage');

        Route::resource('coupons', CouponController::class)
            ->except('show')
            ->middleware('permission:catalogue.manage');

        Route::resource('reviews', AdminReviewController::class)
            ->only(['index', 'update'])
            ->middleware('permission:catalogue.manage');

        Route::resource('payments', AdminPaymentController::class)
            ->only(['index', 'update'])
            ->middleware('permission:payments.manage');

        Route::resource('payment-refunds', PaymentRefundController::class)
            ->only(['index', 'update'])
            ->middleware('permission:payments.manage');

        Route::resource('shipments', AdminShipmentController::class)
            ->only(['index', 'update'])
            ->middleware('permission:orders.manage');

        Route::resource('returns', AdminReturnController::class)
            ->only(['index', 'create', 'store', 'show', 'update'])
            ->middleware('permission:orders.manage');

        Route::resource('settlements', SettlementController::class)
            ->only(['index', 'create', 'store', 'show', 'update'])
            ->middleware('permission:payments.manage');

        Route::post('support/{support}/messages', SupportMessageController::class)->middleware('permission:support.requests.manage')->name('support.messages.store');
        Route::resource('support', SupportTicketController::class)->only(['index', 'create', 'store', 'show', 'update'])->middleware('permission:support.requests.manage');

        Route::resource('tax-invoices', TaxInvoiceController::class)->only(['index', 'create', 'store', 'show', 'update'])->middleware('permission:payments.manage');

        Route::put('warehouses/{warehouse}/inventory', WarehouseInventoryController::class)
            ->middleware('permission:catalogue.manage')
            ->name('warehouses.inventory.update');
        Route::resource('warehouses', WarehouseController::class)->middleware('permission:catalogue.manage');

        Route::get('inventory-operations', [InventoryOperationController::class, 'index'])
            ->middleware('permission:catalogue.manage')
            ->name('inventory-operations.index');
        Route::patch('inventory-reservations/{inventoryReservation}/release', [InventoryOperationController::class, 'release'])
            ->middleware('permission:catalogue.manage')
            ->name('inventory-reservations.release');

        Route::resource('service-areas', ServiceAreaController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->middleware('permission:catalogue.manage');

        Route::get('users/{user}/history', [UserController::class, 'history'])
            ->middleware('permission:users.manage')
            ->name('users.history');

        Route::resource('users', UserController::class)->middleware('permission:users.manage');
    });

Route::middleware('auth')->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
