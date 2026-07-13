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
        Schema::table('stores', function (Blueprint $table) {
            $table->string('code', 30)->unique();
            $table->string('name', 150);
            $table->string('type', 30)->default('warehouse')->index();
            $table->string('contact_name')->nullable();
            $table->string('contact_phone', 30)->nullable();
            $table->json('address');
            $table->string('city', 100)->index();
            $table->string('state', 100)->index();
            $table->string('postal_code', 20);
            $table->unsignedInteger('capacity')->default(0);
            $table->unsignedSmallInteger('priority')->default(100)->index();
            $table->boolean('status')->default(true)->index();
            $table->index(['status', 'priority']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropIndex(['status', 'priority']);
            $table->dropColumn([
                'code', 'name', 'type', 'contact_name', 'contact_phone',
                'address', 'city', 'state', 'postal_code', 'capacity',
                'priority', 'status',
            ]);
        });
    }
};
