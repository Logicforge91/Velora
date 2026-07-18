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
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained()->cascadeOnDelete();
            $table->uuid('uuid')->unique();
            $table->string('provider_reference')->nullable()->unique();
            $table->string('type', 30);
            $table->decimal('amount', 12, 2);
            $table->char('currency', 3)->default('INR');
            $table->string('status', 30)->default('pending');
            $table->string('gateway', 50);
            $table->string('failure_code')->nullable();
            $table->text('failure_message')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['payment_id', 'status']);
            $table->index(['type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
