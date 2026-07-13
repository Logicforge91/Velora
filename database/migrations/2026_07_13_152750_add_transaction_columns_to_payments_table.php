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
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('order_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('transaction_id')->nullable()->unique();
            $table->string('provider')->default('manual')->index();
            $table->decimal('amount', 12, 2);
            $table->string('status')->default('pending')->index();
            $table->decimal('refunded_amount', 12, 2)->default(0);
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->json('metadata')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropColumn(['order_id', 'transaction_id', 'provider', 'amount', 'status', 'refunded_amount', 'paid_at', 'refunded_at', 'metadata']);
        });
    }
};
