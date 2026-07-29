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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 30)->nullable()->index()->after('email');
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->string('gender', 30)->nullable()->after('date_of_birth');
            $table->string('locale', 10)->default('en')->after('gender');
            $table->char('preferred_currency', 3)->default('INR')->after('locale');
            $table->string('avatar')->nullable()->after('preferred_currency');
            $table->json('communication_preferences')->nullable()->after('avatar');
            $table->json('privacy_settings')->nullable()->after('communication_preferences');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'date_of_birth',
                'gender',
                'locale',
                'preferred_currency',
                'avatar',
                'communication_preferences',
                'privacy_settings',
            ]);
        });
    }
};
