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
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();
            $table->json('billing_address')->nullable();
            $table->char('currency', 3)->default('INR');
            $table->decimal('tax_total', 12, 2)->default(0);
            $table->decimal('gift_wrap_total', 12, 2)->default(0);
            $table->decimal('savings_total', 12, 2)->default(0);
            $table->string('source', 30)->default('web')->index();
            $table->string('channel', 30)->default('marketplace')->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->text('gift_message')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable()->index();
            $table->timestamp('delivered_at')->nullable()->index();
            $table->index(['status', 'placed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['coupon_id']);
            $table->dropIndex(['status', 'placed_at']);
            $table->dropColumn([
                'coupon_id', 'billing_address', 'currency', 'tax_total',
                'gift_wrap_total', 'savings_total', 'source', 'channel',
                'ip_address', 'user_agent', 'gift_message',
                'cancellation_reason', 'confirmed_at', 'cancelled_at',
                'delivered_at',
            ]);
        });
    }
};
