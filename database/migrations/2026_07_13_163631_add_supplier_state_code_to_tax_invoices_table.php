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
        if (! Schema::hasColumn('tax_invoices', 'supplier_state_code')) {
            Schema::table('tax_invoices', function (Blueprint $table) {
                $table->string('supplier_state_code', 2)->after('supplier_gstin');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('tax_invoices', 'supplier_state_code')) {
            Schema::table('tax_invoices', function (Blueprint $table) {
                $table->dropColumn('supplier_state_code');
            });
        }
    }
};
