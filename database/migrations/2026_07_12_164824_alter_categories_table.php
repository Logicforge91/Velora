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
        Schema::table('categories', function (Blueprint $table) {
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();

            $table->string('name', 150);
            $table->string('slug', 180)->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();

            $table->unsignedInteger('sort_order')
                ->default(0);

            $table->boolean('status')
                ->default(true)
                ->index();

            $table->index([
                'parent_id',
                'status',
                'sort_order',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table): void {
            $table->dropForeign(['parent_id']);
            $table->dropUnique(['slug']);
            $table->dropIndex(['status']);
            $table->dropIndex(['parent_id', 'status', 'sort_order']);

            $table->dropColumn([
                'parent_id',
                'name',
                'slug',
                'description',
                'image',
                'sort_order',
                'status',
            ]);
        });
    }
};
