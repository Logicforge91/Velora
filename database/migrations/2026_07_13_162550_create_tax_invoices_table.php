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
        Schema::create('tax_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->restrictOnDelete();
            $table->foreignId('vendor_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('parent_invoice_id')->nullable()->constrained('tax_invoices')->nullOnDelete();
            $table->string('type', 20)->default('invoice')->index();
            $table->string('number', 16)->unique();
            $table->string('financial_year', 9)->index();
            $table->date('issued_on')->index();
            $table->string('status', 20)->default('draft')->index();
            $table->string('supplier_name');
            $table->text('supplier_address');
            $table->string('supplier_gstin', 15)->nullable()->index();
            $table->string('supplier_state_code', 2);
            $table->string('recipient_name');
            $table->text('recipient_address');
            $table->string('recipient_gstin', 15)->nullable()->index();
            $table->string('place_of_supply_state', 100);
            $table->string('place_of_supply_code', 2);
            $table->boolean('reverse_charge')->default(false);
            $table->decimal('taxable_value', 14, 2);
            $table->decimal('cgst_amount', 14, 2)->default(0);
            $table->decimal('sgst_amount', 14, 2)->default(0);
            $table->decimal('igst_amount', 14, 2)->default(0);
            $table->decimal('cess_amount', 14, 2)->default(0);
            $table->decimal('total_amount', 14, 2);
            $table->text('notes')->nullable();
            $table->foreignId('issued_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('issued_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'issued_on']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_invoices');
    }
};
