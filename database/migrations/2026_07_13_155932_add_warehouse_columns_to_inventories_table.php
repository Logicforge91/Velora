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
        Schema::table('inventories', function (Blueprint $table) {
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('on_hand')->default(0);
            $table->unsignedInteger('reserved')->default(0);
            $table->unsignedInteger('reorder_level')->default(5);
            $table->string('bin_location', 50)->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unique(['store_id', 'product_id']);
            $table->index(['store_id', 'on_hand']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->dropForeign(['store_id']);
            $table->dropForeign(['product_id']);
            $table->dropForeign(['updated_by']);
            $table->dropUnique(['store_id', 'product_id']);
            $table->dropIndex(['store_id', 'on_hand']);
            $table->dropColumn([
                'store_id', 'product_id', 'on_hand', 'reserved',
                'reorder_level', 'bin_location', 'updated_by',
            ]);
        });
    }
};
