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
        Schema::table('wishlists', function (Blueprint $table) {
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100)->default('My Wishlist');
            $table->boolean('is_default')->default(false)->index();
            $table->boolean('is_public')->default(false)->index();
            $table->string('share_token', 64)->nullable()->unique();
            $table->index(['user_id', 'is_default']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id', 'is_default']);
            $table->dropColumn([
                'uuid', 'user_id', 'name', 'is_default', 'is_public',
                'share_token',
            ]);
        });
    }
};
