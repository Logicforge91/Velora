<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\InventoryMovement;
use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\PaymentRefund;
use App\Models\PriceHistory;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\SellerListing;
use App\Models\ServiceArea;
use App\Models\Store;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AdvancedMarketplaceSeeder extends Seeder
{
    private const DEMO_PREFIX = 'DEMO-';

    public function run(): void
    {
        if (SellerListing::query()->where('seller_sku', 'like', self::DEMO_PREFIX.'%')->exists()) {
            $this->command->info('Advanced marketplace demo data already exists.');

            return;
        }

        DB::transaction(function (): void {
            $vendors = $this->createVendors();
            $stores = $this->createStores();
            $products = $this->products();

            $variants = $this->createVariants($products);
            $listings = $this->createSellerListings($vendors, $stores, $products, $variants);
            $inventories = $this->createInventory($stores, $products, $variants);
            $this->createReservations($inventories);
            $orders = $this->createOrders($products, $variants);
            $this->createRefunds($orders);
            $this->createServiceAreas($stores);

            $this->command->info(sprintf(
                'Created %d listings, %d inventory positions, %d orders and 120 delivery areas.',
                $listings->count(),
                $inventories->count(),
                $orders->count(),
            ));
        });
    }

    /** @return Collection<int, Vendor> */
    private function createVendors(): Collection
    {
        return Vendor::factory()->count(8)->create([
            'status' => Vendor::STATUS_APPROVED,
            'kyc_status' => 'verified',
            'onboarding_stage' => 'active',
            'commission_rate' => 12,
            'approved_at' => now()->subMonths(2),
        ]);
    }

    /** @return Collection<int, Store> */
    private function createStores(): Collection
    {
        return collect(range(1, 6))->map(fn (int $number): Store => Store::factory()->create([
            'code' => self::DEMO_PREFIX.'WH-'.str_pad((string) $number, 2, '0', STR_PAD_LEFT),
            'priority' => $number * 10,
        ]));
    }

    /** @return Collection<int, Product> */
    private function products(): Collection
    {
        $required = max(0, 30 - Product::query()->where('status', Product::STATUS_ACTIVE)->count());

        if ($required > 0) {
            Product::factory()->count($required)->create();
        }

        return Product::query()->where('status', Product::STATUS_ACTIVE)->latest()->limit(30)->get();
    }

    /**
     * @param  Collection<int, Product>  $products
     * @return Collection<int, ProductVariant>
     */
    private function createVariants(Collection $products): Collection
    {
        return $products->flatMap(fn (Product $product): Collection => ProductVariant::factory()
            ->count(2)
            ->for($product)
            ->create());
    }

    /**
     * @param  Collection<int, Vendor>  $vendors
     * @param  Collection<int, Store>  $stores
     * @param  Collection<int, Product>  $products
     * @param  Collection<int, ProductVariant>  $variants
     * @return Collection<int, SellerListing>
     */
    private function createSellerListings(Collection $vendors, Collection $stores, Collection $products, Collection $variants): Collection
    {
        $statuses = ['active', 'active', 'active', 'pending', 'suspended', 'rejected'];
        $listings = collect();

        $products->each(function (Product $product, int $productIndex) use ($vendors, $stores, $variants, $statuses, $listings): void {
            collect(range(1, 3))->each(function (int $offer) use ($product, $productIndex, $vendors, $stores, $variants, $statuses, $listings): void {
                $sequence = ($productIndex * 3) + $offer;
                $sellingPrice = round((float) $product->price * fake()->randomFloat(2, 0.88, 1.05), 2);
                $variant = $variants->where('product_id', $product->id)->random();
                $status = $statuses[$sequence % count($statuses)];

                $listing = SellerListing::factory()
                    ->for($vendors->random())
                    ->for($product)
                    ->for($variant, 'variant')
                    ->for($stores->random())
                    ->create([
                        'seller_sku' => self::DEMO_PREFIX.'SELLER-'.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT),
                        'mrp' => max($sellingPrice, (float) $product->price * 1.15),
                        'selling_price' => $sellingPrice,
                        'stock' => fake()->numberBetween(0, 180),
                        'reserved' => fake()->numberBetween(0, 8),
                        'commission_rate' => fake()->randomElement([8, 10, 12, 15, 18]),
                        'is_buy_box_winner' => $offer === 1 && $status === 'active',
                        'status' => $status,
                        'rejection_reason' => $status === 'rejected' ? 'Listing information requires correction.' : null,
                        'published_at' => $status === 'active' ? now()->subDays(fake()->numberBetween(1, 90)) : null,
                        'suspended_at' => $status === 'suspended' ? now()->subDays(2) : null,
                    ]);

                collect(range(1, 3))->each(function (int $change) use ($listing, $product, $sellingPrice): void {
                    PriceHistory::factory()->for($product)->for($listing, 'sellerListing')->create([
                        'product_variant_id' => $listing->product_variant_id,
                        'old_price' => $sellingPrice + ($change * 75),
                        'new_price' => $sellingPrice + (($change - 1) * 40),
                        'change_source' => $change === 1 ? 'promotion' : 'admin',
                        'effective_from' => now()->subDays($change * 10),
                    ]);
                });

                $listings->push($listing);
            });
        });

        return $listings;
    }

    /**
     * @param  Collection<int, Store>  $stores
     * @param  Collection<int, Product>  $products
     * @param  Collection<int, ProductVariant>  $variants
     * @return Collection<int, Inventory>
     */
    private function createInventory(Collection $stores, Collection $products, Collection $variants): Collection
    {
        $inventories = collect();

        $stores->each(function (Store $store) use ($products, $variants, $inventories): void {
            $products->random(12)->each(function (Product $product) use ($store, $variants, $inventories): void {
                $variant = $variants->where('product_id', $product->id)->random();
                $onHand = fake()->numberBetween(20, 250);
                $reserved = fake()->numberBetween(0, min(15, $onHand));
                $inventory = Inventory::factory()->for($store)->for($product)->for($variant, 'variant')->create([
                    'on_hand' => $onHand,
                    'reserved' => $reserved,
                    'safety_stock' => fake()->numberBetween(3, 12),
                    'damaged' => fake()->numberBetween(0, 4),
                    'inbound' => fake()->numberBetween(0, 40),
                    'lot_number' => self::DEMO_PREFIX.'LOT-'.fake()->unique()->numerify('######'),
                    'expiry_date' => fake()->optional(0.25)->dateTimeBetween('+3 months', '+2 years'),
                ]);

                collect(range(1, 4))->each(function (int $position) use ($inventory, $onHand): void {
                    $after = max(0, $onHand - (($position - 1) * 5));
                    InventoryMovement::factory()->for($inventory)->create([
                        'type' => fake()->randomElement(['purchase_receipt', 'sale', 'return', 'adjustment', 'transfer']),
                        'quantity' => $position % 2 === 0 ? -5 : 10,
                        'before_quantity' => max(0, $after - ($position % 2 === 0 ? -5 : 10)),
                        'after_quantity' => $after,
                        'occurred_at' => now()->subHours(fake()->numberBetween(1, 720)),
                    ]);
                });

                $inventories->push($inventory);
            });
        });

        return $inventories;
    }

    /** @param Collection<int, Inventory> $inventories */
    private function createReservations(Collection $inventories): void
    {
        $inventories->random(30)->values()->each(function (Inventory $inventory, int $index): void {
            $status = ['active', 'active', 'released', 'expired', 'converted'][$index % 5];
            InventoryReservation::factory()->for($inventory)->create([
                'quantity' => fake()->numberBetween(1, 4),
                'status' => $status,
                'expires_at' => $status === 'active' ? now()->addMinutes(fake()->numberBetween(10, 90)) : now()->subMinutes(30),
                'released_at' => $status === 'released' ? now()->subMinutes(20) : null,
                'release_reason' => $status === 'released' ? 'customer_cancelled' : null,
            ]);
        });
    }

    /**
     * @param  Collection<int, Product>  $products
     * @param  Collection<int, ProductVariant>  $variants
     * @return Collection<int, Order>
     */
    private function createOrders(Collection $products, Collection $variants): Collection
    {
        $statuses = [Order::STATUS_PENDING, Order::STATUS_PROCESSING, Order::STATUS_SHIPPED, Order::STATUS_DELIVERED, Order::STATUS_CANCELLED];
        $orders = collect();

        collect(range(1, 36))->each(function (int $number) use ($products, $variants, $statuses, $orders): void {
            $status = $statuses[$number % count($statuses)];
            $order = Order::factory()->create([
                'number' => self::DEMO_PREFIX.'ORD-'.str_pad((string) $number, 5, '0', STR_PAD_LEFT),
                'status' => $status,
                'payment_status' => in_array($status, [Order::STATUS_PROCESSING, Order::STATUS_SHIPPED, Order::STATUS_DELIVERED], true) ? 'paid' : 'pending',
                'placed_at' => now()->subDays(fake()->numberBetween(1, 120)),
            ]);

            $products->random(fake()->numberBetween(1, 4))->each(function (Product $product) use ($order, $status, $variants): void {
                $variant = $variants->where('product_id', $product->id)->random();
                $quantity = fake()->numberBetween(1, 3);
                OrderItem::factory()->for($order)->for($product)->create([
                    'product_variant_id' => $variant->id,
                    'variant_name' => $variant->name,
                    'variant_attributes' => $variant->attributes,
                    'product_name' => $product->name,
                    'sku' => $variant->sku,
                    'unit_price' => $variant->price,
                    'quantity' => $quantity,
                    'total' => (float) $variant->price * $quantity,
                    'fulfilment_status' => $status,
                ]);
            });

            $this->createOrderHistory($order, $status);
            $order->payment()->update([
                'status' => $order->payment_status,
                'paid_at' => $order->payment_status === 'paid' ? now()->subDays(1) : null,
            ]);
            $orders->push($order);
        });

        return $orders;
    }

    private function createOrderHistory(Order $order, string $finalStatus): void
    {
        $timeline = [Order::STATUS_PENDING, Order::STATUS_PROCESSING, Order::STATUS_SHIPPED, Order::STATUS_DELIVERED];

        if ($finalStatus === Order::STATUS_CANCELLED) {
            $timeline = [Order::STATUS_PENDING, Order::STATUS_CANCELLED];
        } else {
            $timeline = array_slice($timeline, 0, array_search($finalStatus, $timeline, true) + 1);
        }

        $fromStatus = null;

        collect($timeline)->values()->each(function (string $status, int $index) use ($order, &$fromStatus): void {
            OrderStatusHistory::factory()->for($order)->create([
                'from_status' => $fromStatus,
                'to_status' => $status,
                'payment_status' => $order->payment_status,
                'shipment_status' => $status,
                'location' => $status === Order::STATUS_SHIPPED ? 'Regional fulfilment centre' : null,
                'occurred_at' => Carbon::parse($order->placed_at)->addHours($index * 12),
            ]);

            $fromStatus = $status;
        });
    }

    /** @param Collection<int, Order> $orders */
    private function createRefunds(Collection $orders): void
    {
        $orders->whereIn('status', [Order::STATUS_SHIPPED, Order::STATUS_DELIVERED])->take(12)->values()->each(function (Order $order, int $index): void {
            $status = ['requested', 'approved', 'processing', 'completed', 'failed', 'rejected'][$index % 6];
            $amount = min((float) $order->payment->amount, fake()->randomFloat(2, 100, 1500));

            PaymentRefund::factory()->for($order->payment)->create([
                'number' => self::DEMO_PREFIX.'RFN-'.str_pad((string) ($index + 1), 5, '0', STR_PAD_LEFT),
                'amount' => $amount,
                'status' => $status,
                'provider_reference' => in_array($status, ['processing', 'completed'], true) ? self::DEMO_PREFIX.'GATEWAY-'.($index + 1) : null,
                'failure_reason' => $status === 'failed' ? 'Provider temporarily declined the request.' : null,
                'processed_at' => in_array($status, ['completed', 'failed', 'rejected'], true) ? now()->subHours(3) : null,
            ]);
        });
    }

    /** @param Collection<int, Store> $stores */
    private function createServiceAreas(Collection $stores): void
    {
        collect(range(1, 120))->each(function (int $number) use ($stores): void {
            ServiceArea::factory()->for($stores[($number - 1) % $stores->count()])->create([
                'postal_code' => (string) (560000 + $number),
                'city' => fake()->randomElement(['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi']),
                'minimum_delivery_days' => fake()->numberBetween(1, 3),
                'maximum_delivery_days' => fake()->numberBetween(4, 8),
                'shipping_charge' => fake()->randomElement([0, 40, 60, 80]),
                'free_shipping_threshold' => fake()->randomElement([499, 799, 999]),
                'cod_charge' => fake()->randomElement([0, 20, 30]),
                'daily_capacity' => fake()->numberBetween(40, 400),
                'express_available' => fake()->boolean(35),
                'status' => fake()->boolean(92) ? 'active' : 'inactive',
                'cutoff_time' => fake()->randomElement(['14:00', '16:00', '18:00']),
            ]);
        });
    }
}
