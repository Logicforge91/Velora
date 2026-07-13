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
        Schema::create('tax_invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tax_invoice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained()->nullOnDelete();
            $table->string('description');
            $table->string('hsn_code', 20)->nullable()->index();
            $table->unsignedInteger('quantity');
            $table->string('unit', 20)->default('NOS');
            $table->decimal('taxable_value', 14, 2);
            $table->decimal('gst_rate', 5, 2);
            $table->decimal('cgst_amount', 14, 2)->default(0);
            $table->decimal('sgst_amount', 14, 2)->default(0);
            $table->decimal('igst_amount', 14, 2)->default(0);
            $table->decimal('cess_amount', 14, 2)->default(0);
            $table->decimal('total_amount', 14, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_invoice_items');
    }
};
