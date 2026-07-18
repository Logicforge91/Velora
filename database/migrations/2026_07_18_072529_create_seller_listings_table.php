<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_listings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('vendor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('store_id')->nullable()->constrained()->nullOnDelete();
            $table->string('seller_sku', 100);
            $table->string('condition', 30)->default('new')->index();
            $table->decimal('mrp', 12, 2);
            $table->decimal('selling_price', 12, 2);
            $table->decimal('cost_price', 12, 2)->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('reserved')->default(0);
            $table->unsignedSmallInteger('minimum_order_quantity')->default(1);
            $table->unsignedSmallInteger('maximum_order_quantity')->nullable();
            $table->unsignedSmallInteger('handling_time_days')->default(1);
            $table->string('fulfilment_type', 30)->default('seller')->index();
            $table->decimal('commission_rate', 5, 2)->default(0);
            $table->boolean('is_buy_box_winner')->default(false)->index();
            $table->string('status', 30)->default('draft')->index();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamp('suspended_at')->nullable();
            $table->timestamps();
            $table->unique(['vendor_id', 'seller_sku']);
            $table->index(['product_id', 'status', 'selling_price']);
            $table->index(['vendor_id', 'status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_listings');
    }
};
