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
        Schema::create('category_product_attribute', function (Blueprint $table) {
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_attribute_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_required')->default(false);
            $table->boolean('is_filterable')->default(false);
            $table->boolean('is_variant')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->primary(['category_id', 'product_attribute_id']);
            $table->index(['product_attribute_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_product_attribute');
    }
};
