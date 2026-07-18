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
        Schema::table('carts', function (Blueprint $table) {
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('session_id')->nullable()->index();
            $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status', 30)->default('active')->index();
            $table->char('currency', 3)->default('INR');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount_total', 12, 2)->default(0);
            $table->decimal('tax_total', 12, 2)->default(0);
            $table->decimal('shipping_total', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2)->default(0);
            $table->json('metadata')->nullable();
            $table->timestamp('last_activity_at')->nullable()->index();
            $table->timestamp('expires_at')->nullable()->index();
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['coupon_id']);
            $table->dropIndex(['user_id', 'status']);
            $table->dropColumn([
                'uuid', 'user_id', 'session_id', 'coupon_id', 'status',
                'currency', 'subtotal', 'discount_total', 'tax_total',
                'shipping_total', 'grand_total', 'metadata',
                'last_activity_at', 'expires_at',
            ]);
        });
    }
};
