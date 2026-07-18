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
        Schema::table('wishlist_items', function (Blueprint $table) {
            $table->foreignId('wishlist_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('price_when_added', 12, 2)->nullable();
            $table->unsignedTinyInteger('priority')->default(0)->index();
            $table->boolean('notify_price_drop')->default(true);
            $table->boolean('notify_back_in_stock')->default(true);
            $table->text('notes')->nullable();
            $table->timestamp('added_at')->useCurrent();
            $table->unique(['wishlist_id', 'product_id', 'product_variant_id'], 'wishlist_item_variant_unique');
            $table->index(['wishlist_id', 'priority']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wishlist_items', function (Blueprint $table) {
            $table->dropForeign(['wishlist_id']);
            $table->dropForeign(['product_id']);
            $table->dropForeign(['product_variant_id']);
            $table->dropUnique('wishlist_item_variant_unique');
            $table->dropIndex(['wishlist_id', 'priority']);
            $table->dropColumn([
                'wishlist_id', 'product_id', 'product_variant_id',
                'price_when_added', 'priority', 'notify_price_drop',
                'notify_back_in_stock', 'notes', 'added_at',
            ]);
        });
    }
};
