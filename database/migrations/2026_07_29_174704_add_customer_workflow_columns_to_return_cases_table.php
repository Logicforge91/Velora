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
        Schema::table('return_cases', function (Blueprint $table) {
            $table->json('media_paths')->nullable()->after('reason_details');
            $table->json('pickup_address')->nullable()->after('media_paths');
            $table->timestamp('pickup_slot_at')->nullable()->after('pickup_address');
            $table->json('exchange_attributes')->nullable()->after('pickup_slot_at');
            $table->timestamp('cancelled_at')->nullable()->index()->after('completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('return_cases', function (Blueprint $table) {
            $table->dropColumn([
                'media_paths',
                'pickup_address',
                'pickup_slot_at',
                'exchange_attributes',
                'cancelled_at',
            ]);
        });
    }
};
