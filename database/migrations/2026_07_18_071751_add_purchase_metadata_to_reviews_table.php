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
        Schema::table('reviews', function (Blueprint $table) {
            $table->foreignId('order_item_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_verified_purchase')->default(false)->index();
            $table->unsignedInteger('helpful_count')->default(0);
            $table->unsignedInteger('unhelpful_count')->default(0);
            $table->json('media')->nullable();
            $table->text('seller_response')->nullable();
            $table->timestamp('seller_responded_at')->nullable();
            $table->index(['product_id', 'status', 'rating']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['order_item_id']);
            $table->dropIndex(['product_id', 'status', 'rating']);
            $table->dropColumn([
                'order_item_id', 'is_verified_purchase', 'helpful_count',
                'unhelpful_count', 'media', 'seller_response',
                'seller_responded_at',
            ]);
        });
    }
};
