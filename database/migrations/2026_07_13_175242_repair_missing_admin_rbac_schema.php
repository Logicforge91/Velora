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
        Schema::table('admin_roles', function (Blueprint $table) {
            if (! Schema::hasColumn('admin_roles', 'name')) {
                $table->string('name')->unique();
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->json('permissions');
                $table->boolean('is_system')->default(false)->index();
            }
        });

        Schema::table('admin_role_user', function (Blueprint $table) {
            if (Schema::hasColumn('admin_role_user', 'id')) {
                $table->dropColumn('id');
            }

            if (! Schema::hasColumn('admin_role_user', 'admin_role_id')) {
                $table->foreignId('admin_role_id')->constrained()->cascadeOnDelete();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->primary(['admin_role_id', 'user_id']);
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'uses_custom_admin_roles')) {
                $table->boolean('uses_custom_admin_roles')->default(false)->after('role')->index();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This forward repair may be a no-op on correctly migrated databases.
    }
};
