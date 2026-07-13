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
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('number')->unique();
            $table->string('status')->default('pending')->index();
            $table->string('payment_method')->default('cash_on_delivery');
            $table->string('payment_status')->default('pending')->index();
            $table->json('shipping_address');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('shipping_total', 12, 2)->default(0);
            $table->decimal('discount_total', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->text('customer_note')->nullable();
            $table->timestamp('placed_at')->index();
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id', 'created_at']);
            $table->dropColumn([
                'user_id', 'number', 'status', 'payment_method',
                'payment_status', 'shipping_address', 'subtotal',
                'shipping_total', 'discount_total', 'total',
                'customer_note', 'placed_at',
            ]);
        });
    }
};
