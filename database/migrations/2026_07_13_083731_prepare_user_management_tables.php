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
        if (! Schema::hasColumn('users', 'deleted_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        if (! Schema::hasColumn('user_histories', 'user_id')) {
            Schema::table('user_histories', function (Blueprint $table) {
                $table->foreignId('user_id')->after('id')->constrained()->cascadeOnDelete();
                $table->foreignId('actor_id')->nullable()->after('user_id')->constrained('users')->nullOnDelete();
                $table->string('action', 30)->after('actor_id')->index();
                $table->json('changes')->nullable()->after('action');
                $table->json('snapshot')->after('changes');
                $table->string('ip_address', 45)->nullable()->after('snapshot');
                $table->index(['user_id', 'created_at']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // The preceding migrations own these columns on fresh installations.
    }
};
