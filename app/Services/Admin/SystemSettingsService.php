<?php

namespace App\Services\Admin;

use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

/**
 * @phpstan-type SettingField array{label: string, type: string, default: mixed, min?: float, max?: float}
 * @phpstan-type SettingDefinition array{label: string, description: string, fields: array<string, SettingField>}
 */
class SystemSettingsService
{
    /** @return array<string, SettingDefinition> */
    public function definitions(): array
    {
        return [
            'general' => $this->group('General Settings', 'Core marketplace identity and contact details.', [
                'site_name' => $this->field('Marketplace name', 'text', 'Velora'),
                'support_email' => $this->field('Support email', 'email', 'support@velora.test'),
                'support_phone' => $this->field('Support phone', 'text', ''),
                'timezone' => $this->field('Timezone', 'text', 'Asia/Kolkata'),
            ]),
            'marketplace' => $this->group('Marketplace Settings', 'Control storefront access and checkout rules.', [
                'marketplace_enabled' => $this->field('Marketplace enabled', 'boolean', true),
                'guest_checkout' => $this->field('Allow guest checkout', 'boolean', false),
                'minimum_order_amount' => $this->field('Minimum order amount', 'number', 0, 0),
            ]),
            'seller' => $this->group('Seller Settings', 'Configure seller onboarding and verification.', [
                'onboarding_enabled' => $this->field('Seller onboarding enabled', 'boolean', true),
                'kyc_required' => $this->field('Require KYC verification', 'boolean', true),
                'auto_approve' => $this->field('Automatically approve sellers', 'boolean', false),
            ]),
            'product' => $this->group('Product Settings', 'Set catalogue quality and inventory defaults.', [
                'moderation_required' => $this->field('Require product moderation', 'boolean', true),
                'allow_reviews' => $this->field('Allow product reviews', 'boolean', true),
                'low_stock_threshold' => $this->field('Default low-stock threshold', 'number', 10, 0),
            ]),
            'order' => $this->group('Order Settings', 'Configure order confirmation and numbering.', [
                'auto_confirm' => $this->field('Automatically confirm paid orders', 'boolean', true),
                'cancellation_window_minutes' => $this->field('Cancellation window (minutes)', 'number', 30, 0),
                'invoice_prefix' => $this->field('Invoice prefix', 'text', 'VEL'),
            ]),
            'inventory' => $this->group('Inventory Settings', 'Control reservations and stock alerts.', [
                'reservation_minutes' => $this->field('Reservation duration (minutes)', 'number', 15, 1),
                'allow_backorders' => $this->field('Allow backorders', 'boolean', false),
                'low_stock_alerts' => $this->field('Send low-stock alerts', 'boolean', true),
            ]),
            'returns' => $this->group('Return Settings', 'Set customer return policy defaults.', [
                'return_window_days' => $this->field('Return window (days)', 'number', 7, 0),
                'auto_approve' => $this->field('Automatically approve eligible returns', 'boolean', false),
                'restocking_fee_percent' => $this->field('Restocking fee (%)', 'number', 0, 0, 100),
            ]),
            'commission' => $this->group('Commission Settings', 'Set marketplace commission defaults.', [
                'default_rate' => $this->field('Default commission (%)', 'number', 10, 0, 100),
                'tax_rate' => $this->field('Commission tax (%)', 'number', 18, 0, 100),
            ]),
            'payment' => $this->group('Payment Settings', 'Manage payment methods and expiry.', [
                'prepaid_enabled' => $this->field('Prepaid payments', 'boolean', true),
                'cod_enabled' => $this->field('Cash on delivery', 'boolean', true),
                'payment_timeout_minutes' => $this->field('Payment timeout (minutes)', 'number', 15, 1),
            ]),
            'shipping' => $this->group('Shipping Settings', 'Set default delivery charges and options.', [
                'flat_rate' => $this->field('Flat shipping rate', 'number', 0, 0),
                'free_shipping_threshold' => $this->field('Free shipping threshold', 'number', 999, 0),
                'express_enabled' => $this->field('Express shipping', 'boolean', false),
            ]),
            'tax' => $this->group('Tax Settings', 'Configure marketplace tax calculations.', [
                'gst_enabled' => $this->field('GST enabled', 'boolean', true),
                'default_gst_rate' => $this->field('Default GST rate (%)', 'number', 18, 0, 100),
                'prices_include_tax' => $this->field('Prices include tax', 'boolean', true),
            ]),
            'currency' => $this->group('Currency Settings', 'Choose the display and settlement currency.', [
                'code' => $this->field('Currency code', 'text', 'INR'),
                'symbol' => $this->field('Currency symbol', 'text', '₹'),
                'decimal_places' => $this->field('Decimal places', 'number', 2, 0, 4),
            ]),
            'language' => $this->group('Language Settings', 'Set default and fallback languages.', [
                'default_locale' => $this->field('Default locale', 'text', 'en'),
                'fallback_locale' => $this->field('Fallback locale', 'text', 'en'),
            ]),
            'location' => $this->group('Country and Location', 'Configure the marketplace home location.', [
                'country_code' => $this->field('Country code', 'text', 'IN'),
                'country_name' => $this->field('Country name', 'text', 'India'),
                'default_state' => $this->field('Default state', 'text', ''),
            ]),
            'seo' => $this->group('SEO Settings', 'Control storefront search-engine metadata.', [
                'meta_title' => $this->field('Default meta title', 'text', 'Velora Marketplace'),
                'meta_description' => $this->field('Default meta description', 'textarea', 'Shop trusted products from verified sellers.'),
                'robots_indexing' => $this->field('Allow search indexing', 'boolean', true),
            ]),
        ];
    }

    /** @return array<string, array<string, mixed>> */
    public function values(): array
    {
        $stored = SystemSetting::query()->get(['group', 'values'])->keyBy('group');
        $settings = [];

        foreach ($this->definitions() as $group => $definition) {
            $defaults = [];

            foreach ($definition['fields'] as $key => $field) {
                $defaults[$key] = $field['default'];
            }

            $setting = $stored->get($group);
            $settings[$group] = [...$defaults, ...($setting instanceof SystemSetting ? $setting->values : [])];
        }

        return $settings;
    }

    /** @param array<string, mixed> $values */
    public function update(string $group, array $values, User $actor): void
    {
        $definition = $this->definitions()[$group] ?? null;

        if ($definition === null) {
            throw ValidationException::withMessages(['group' => 'The selected settings group is invalid.']);
        }

        SystemSetting::query()->updateOrCreate(
            ['group' => $group],
            ['values' => collect($values)->only(array_keys($definition['fields']))->all(), 'updated_by' => $actor->id],
        );
    }

    /** @return array<string, int|string|bool|null> */
    public function operations(): array
    {
        return [
            'cache_driver' => (string) config('cache.default'),
            'queue_driver' => (string) config('queue.default'),
            'queued_jobs' => Schema::hasTable('jobs') ? DB::table('jobs')->count() : 0,
            'failed_jobs' => Schema::hasTable('failed_jobs') ? DB::table('failed_jobs')->count() : 0,
            'maintenance' => app()->isDownForMaintenance(),
            'database_driver' => DB::connection()->getDriverName(),
            'last_backup' => $this->latestBackup(),
            'log_size' => File::exists(storage_path('logs/laravel.log')) ? File::size(storage_path('logs/laravel.log')) : 0,
        ];
    }

    public function clearCache(): void
    {
        Cache::flush();
    }

    public function createDatabaseBackup(): string
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            throw ValidationException::withMessages(['backup' => 'Automated backups currently require the SQLite database driver.']);
        }

        $database = (string) config('database.connections.sqlite.database');

        if (! File::isFile($database)) {
            throw ValidationException::withMessages(['backup' => 'The SQLite database file could not be found.']);
        }

        $directory = storage_path('app/private/system-backups');
        File::ensureDirectoryExists($directory);
        $filename = 'velora-'.now()->format('Y-m-d_H-i-s').'.sqlite';
        File::copy($database, $directory.DIRECTORY_SEPARATOR.$filename);

        return $filename;
    }

    private function latestBackup(): ?string
    {
        $files = File::glob(storage_path('app/private/system-backups/*.sqlite')) ?: [];

        if ($files === []) {
            return null;
        }

        usort($files, fn (string $first, string $second): int => File::lastModified($second) <=> File::lastModified($first));

        return basename($files[0]);
    }

    /**
     * @param  array<string, SettingField>  $fields
     * @return SettingDefinition
     */
    private function group(string $label, string $description, array $fields): array
    {
        return compact('label', 'description', 'fields');
    }

    /** @return SettingField */
    private function field(string $label, string $type, mixed $default, ?float $min = null, ?float $max = null): array
    {
        $field = compact('label', 'type', 'default');

        if ($min !== null) {
            $field['min'] = $min;
        }

        if ($max !== null) {
            $field['max'] = $max;
        }

        return $field;
    }
}
