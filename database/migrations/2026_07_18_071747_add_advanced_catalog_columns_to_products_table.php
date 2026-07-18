<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('product_type', 30)->default('physical')->index();
            $table->string('barcode', 100)->nullable()->unique();
            $table->string('hsn_code', 20)->nullable()->index();
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('weight_kg', 10, 3)->nullable();
            $table->json('dimensions')->nullable();
            $table->json('specifications')->nullable();
            $table->string('shipping_class', 50)->default('standard')->index();
            $table->string('country_of_origin', 100)->nullable();
            $table->string('manufacturer', 180)->nullable();
            $table->string('warranty', 255)->nullable();
            $table->unsignedSmallInteger('return_window_days')->default(7);
            $table->unsignedSmallInteger('replacement_window_days')->default(7);
            $table->boolean('cod_eligible')->default(true)->index();
            $table->boolean('free_shipping')->default(false)->index();
            $table->string('seo_title', 180)->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->timestamp('published_at')->nullable()->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'product_type', 'barcode', 'hsn_code', 'tax_rate',
                'weight_kg', 'dimensions', 'specifications',
                'shipping_class', 'country_of_origin', 'manufacturer',
                'warranty', 'return_window_days', 'replacement_window_days',
                'cod_eligible', 'free_shipping', 'seo_title',
                'seo_description', 'published_at',
            ]);
        });
    }
};
