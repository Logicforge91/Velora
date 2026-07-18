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
        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->string('variant_name', 150)->nullable();
            $table->json('variant_attributes')->nullable();
            $table->string('hsn_code', 20)->nullable()->index();
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->string('fulfilment_status', 30)->default('pending')->index();
            $table->timestamp('return_eligible_until')->nullable()->index();
            $table->json('metadata')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['product_variant_id']);
            $table->dropColumn([
                'product_variant_id', 'variant_name', 'variant_attributes',
                'hsn_code', 'tax_rate', 'tax_amount', 'discount_amount',
                'fulfilment_status', 'return_eligible_until', 'metadata',
            ]);
        });
    }
};
