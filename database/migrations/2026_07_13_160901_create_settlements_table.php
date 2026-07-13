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
        Schema::create('settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained()->restrictOnDelete();
            $table->string('number')->unique();
            $table->date('period_start')->index();
            $table->date('period_end')->index();
            $table->decimal('gross_sales', 14, 2)->default(0);
            $table->decimal('commission_amount', 14, 2)->default(0);
            $table->decimal('shipping_fee', 14, 2)->default(0);
            $table->decimal('tax_withheld', 14, 2)->default(0);
            $table->decimal('refund_deductions', 14, 2)->default(0);
            $table->decimal('adjustments', 14, 2)->default(0);
            $table->decimal('net_amount', 14, 2)->default(0);
            $table->string('status')->default('pending')->index();
            $table->string('transaction_reference')->nullable()->unique();
            $table->text('notes')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->unique(['vendor_id', 'period_start', 'period_end']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settlements');
    }
};
