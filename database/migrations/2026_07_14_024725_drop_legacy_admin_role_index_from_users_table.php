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
        if (! Schema::hasColumn('users', 'uses_custom_admin_roles') || ! Schema::hasIndex('users', ['uses_custom_admin_roles'])) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['uses_custom_admin_roles']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('users', 'uses_custom_admin_roles') || Schema::hasIndex('users', ['uses_custom_admin_roles'])) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->index('uses_custom_admin_roles');
        });
    }
};
