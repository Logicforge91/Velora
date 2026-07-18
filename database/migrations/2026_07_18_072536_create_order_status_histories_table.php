<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('from_status', 30)->nullable();
            $table->string('to_status', 30)->index();
            $table->string('payment_status', 30)->nullable();
            $table->string('shipment_status', 30)->nullable();
            $table->string('location', 180)->nullable();
            $table->text('notes')->nullable();
            $table->boolean('customer_visible')->default(true)->index();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('occurred_at')->useCurrent()->index();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['order_id', 'occurred_at']);
            $table->index(['to_status', 'occurred_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_status_histories');
    }
};
