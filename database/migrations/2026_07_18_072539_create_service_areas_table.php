<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('postal_code', 20)->index();
            $table->string('city', 100)->nullable();
            $table->string('district', 100)->nullable();
            $table->string('state', 100);
            $table->char('country_code', 2)->default('IN');
            $table->boolean('prepaid_available')->default(true);
            $table->boolean('cod_available')->default(true)->index();
            $table->boolean('express_available')->default(false)->index();
            $table->unsignedSmallInteger('minimum_delivery_days')->default(2);
            $table->unsignedSmallInteger('maximum_delivery_days')->default(7);
            $table->decimal('shipping_charge', 10, 2)->default(0);
            $table->decimal('free_shipping_threshold', 12, 2)->nullable();
            $table->decimal('cod_charge', 10, 2)->default(0);
            $table->unsignedInteger('daily_capacity')->nullable();
            $table->string('status', 30)->default('active')->index();
            $table->time('cutoff_time')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->unique(['store_id', 'postal_code']);
            $table->index(['postal_code', 'status']);
            $table->index(['state', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_areas');
    }
};
