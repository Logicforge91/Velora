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
        Schema::table('vendors', function (Blueprint $table) {
            $table->string('kyc_status', 20)->default('pending')->index();
            $table->string('onboarding_stage', 30)->default('business_details')->index();
            $table->string('risk_level', 20)->default('unassessed')->index();
            $table->unsignedTinyInteger('risk_score')->default(0);
            $table->json('risk_flags')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('kyc_verified_at')->nullable();
            $table->foreignId('kyc_verified_by')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropForeign(['kyc_verified_by']);
            $table->dropColumn(['kyc_status', 'onboarding_stage', 'risk_level', 'risk_score', 'risk_flags', 'submitted_at', 'kyc_verified_at', 'kyc_verified_by']);
        });
    }
};
