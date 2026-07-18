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
        Schema::create('product_attribute_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('product_attribute_id')->constrained()->cascadeOnDelete();
            $table->text('value_text')->nullable();
            $table->decimal('value_number', 18, 6)->nullable();
            $table->boolean('value_boolean')->nullable();
            $table->json('value_json')->nullable();
            $table->string('search_value')->nullable();
            $table->timestamps();

            $table->unique(['product_id', 'product_variant_id', 'product_attribute_id'], 'product_attribute_value_unique');
            $table->index(['product_id', 'product_attribute_id']);
            $table->index(['product_variant_id', 'product_attribute_id'], 'variant_attribute_index');
            $table->index(['product_attribute_id', 'search_value'], 'attribute_search_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_attribute_values');
    }
};
