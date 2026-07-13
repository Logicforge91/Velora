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
        Schema::table('vendors', function (Blueprint $table): void {
            $table->decimal('commission_rate', 5, 2)->default(10);
            $table->string('settlement_cycle', 20)->default('weekly')->index();
            $table->string('bank_account_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_ifsc', 20)->nullable();
        });
        Schema::table('products', function (Blueprint $table): void {
            $table->foreignId('vendor_id')->nullable()->after('brand_id')->constrained()->nullOnDelete();
            $table->index(['vendor_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->dropForeign(['vendor_id']);
            $table->dropIndex(['vendor_id', 'status']);
            $table->dropColumn('vendor_id');
        });
        Schema::table('vendors', function (Blueprint $table): void {
            $table->dropColumn(['commission_rate', 'settlement_cycle', 'bank_account_name', 'bank_account_number', 'bank_ifsc']);
        });
    }
};
