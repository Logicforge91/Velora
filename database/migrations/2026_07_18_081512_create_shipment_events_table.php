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
        Schema::create('shipment_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->constrained()->cascadeOnDelete();
            $table->string('status', 50);
            $table->string('provider_code')->nullable();
            $table->string('location')->nullable();
            $table->text('message')->nullable();
            $table->timestamp('occurred_at');
            $table->boolean('customer_visible')->default(true);
            $table->json('payload')->nullable();
            $table->timestamps();

            $table->index(['shipment_id', 'occurred_at']);
            $table->index(['status', 'occurred_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipment_events');
    }
};
