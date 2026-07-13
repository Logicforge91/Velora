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
        Schema::table('shipments', function (Blueprint $table) {
            $table->foreignId('order_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('carrier')->nullable()->index();
            $table->string('tracking_number')->nullable()->unique();
            $table->string('status')->default('pending')->index();
            $table->timestamp('estimated_delivery_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->text('notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropColumn(['order_id', 'carrier', 'tracking_number', 'status', 'estimated_delivery_at', 'shipped_at', 'delivered_at', 'notes']);
        });
    }
};
