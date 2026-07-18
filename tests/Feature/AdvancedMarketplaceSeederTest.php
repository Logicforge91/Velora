<?php

use App\Models\InventoryMovement;
use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\PaymentRefund;
use App\Models\PriceHistory;
use App\Models\SellerListing;
use App\Models\ServiceArea;
use Database\Seeders\AdvancedMarketplaceSeeder;

test('advanced marketplace seeder creates related bulk admin data without duplicates', function () {
    $this->seed(AdvancedMarketplaceSeeder::class);

    expect(SellerListing::query()->where('seller_sku', 'like', 'DEMO-%')->count())->toBe(90)
        ->and(PriceHistory::query()->count())->toBeGreaterThanOrEqual(270)
        ->and(InventoryMovement::query()->count())->toBeGreaterThanOrEqual(288)
        ->and(InventoryReservation::query()->count())->toBeGreaterThanOrEqual(30)
        ->and(Order::query()->where('number', 'like', 'DEMO-%')->count())->toBe(36)
        ->and(PaymentRefund::query()->where('number', 'like', 'DEMO-%')->count())->toBe(12)
        ->and(ServiceArea::query()->count())->toBeGreaterThanOrEqual(120);

    $this->seed(AdvancedMarketplaceSeeder::class);

    expect(SellerListing::query()->where('seller_sku', 'like', 'DEMO-%')->count())->toBe(90)
        ->and(ServiceArea::query()->count())->toBeGreaterThanOrEqual(120);
});
