<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('seller_listing_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('price_type', 30)->default('selling_price')->index();
            $table->decimal('old_price', 12, 2)->nullable();
            $table->decimal('new_price', 12, 2);
            $table->string('change_source', 40)->default('manual')->index();
            $table->string('reason', 255)->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('effective_from')->useCurrent()->index();
            $table->timestamp('effective_until')->nullable()->index();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['product_id', 'effective_from']);
            $table->index(['seller_listing_id', 'effective_from']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_histories');
    }
};
