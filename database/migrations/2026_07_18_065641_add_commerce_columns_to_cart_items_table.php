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
        Schema::table('cart_items', function (Blueprint $table) {
            $table->foreignId('cart_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('vendor_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price', 12, 2);
            $table->decimal('original_price', 12, 2)->nullable();
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('line_total', 12, 2);
            $table->boolean('is_selected')->default(true)->index();
            $table->boolean('saved_for_later')->default(false)->index();
            $table->json('metadata')->nullable();
            $table->unique(['cart_id', 'product_id', 'product_variant_id'], 'cart_item_variant_unique');
            $table->index(['cart_id', 'is_selected']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropForeign(['cart_id']);
            $table->dropForeign(['product_id']);
            $table->dropForeign(['product_variant_id']);
            $table->dropForeign(['vendor_id']);
            $table->dropUnique('cart_item_variant_unique');
            $table->dropIndex(['cart_id', 'is_selected']);
            $table->dropColumn([
                'cart_id', 'product_id', 'product_variant_id', 'vendor_id',
                'quantity', 'unit_price', 'original_price',
                'discount_amount', 'tax_amount', 'line_total', 'is_selected',
                'saved_for_later', 'metadata',
            ]);
        });
    }
};
