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
        Schema::table('inventories', function (Blueprint $table) {
            $table->dropUnique(['store_id', 'product_id']);
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('safety_stock')->default(0);
            $table->unsignedInteger('damaged')->default(0);
            $table->unsignedInteger('inbound')->default(0);
            $table->string('lot_number', 100)->nullable()->index();
            $table->date('expiry_date')->nullable()->index();
            $table->timestamp('last_counted_at')->nullable();
            $table->unique(
                ['store_id', 'product_id', 'product_variant_id'],
                'inventory_store_product_variant_unique',
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->dropUnique('inventory_store_product_variant_unique');
            $table->dropForeign(['product_variant_id']);
            $table->dropColumn([
                'product_variant_id', 'safety_stock', 'damaged', 'inbound',
                'lot_number', 'expiry_date', 'last_counted_at',
            ]);
            $table->unique(['store_id', 'product_id']);
        });
    }
};
