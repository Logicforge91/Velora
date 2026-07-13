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
        $existingColumns = Schema::getColumnListing('vendors');

        Schema::table('vendors', function (Blueprint $table) use ($existingColumns): void {
            if (! in_array('kyc_status', $existingColumns, true)) {
                $table->string('kyc_status', 20)->default('pending')->index();
            }

            if (! in_array('onboarding_stage', $existingColumns, true)) {
                $table->string('onboarding_stage', 30)->default('business_details')->index();
            }

            if (! in_array('risk_level', $existingColumns, true)) {
                $table->string('risk_level', 20)->default('unassessed')->index();
            }

            if (! in_array('risk_score', $existingColumns, true)) {
                $table->unsignedTinyInteger('risk_score')->default(0);
            }

            if (! in_array('risk_flags', $existingColumns, true)) {
                $table->json('risk_flags')->nullable();
            }

            if (! in_array('submitted_at', $existingColumns, true)) {
                $table->timestamp('submitted_at')->nullable();
            }

            if (! in_array('kyc_verified_at', $existingColumns, true)) {
                $table->timestamp('kyc_verified_at')->nullable();
            }

            if (! in_array('kyc_verified_by', $existingColumns, true)) {
                $table->foreignId('kyc_verified_by')->nullable()->constrained('users')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        /**
         * This migration repairs environments where the original migration was
         * recorded before these columns were added. A rollback must not remove
         * columns owned by that original migration on correctly built databases.
         */
    }
};
