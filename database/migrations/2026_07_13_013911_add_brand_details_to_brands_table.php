<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->string('name', 150);
            $table->string('slug', 180)->unique();

            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('website_url')->nullable();

            $table->unsignedInteger('sort_order')
                ->default(0);

            $table->boolean('is_featured')
                ->default(false)
                ->index();

            $table->boolean('status')
                ->default(true)
                ->index();

            $table->index(
                ['status', 'is_featured', 'sort_order'],
                'brands_status_featured_sort_index'
            );
        });
    }

    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->dropIndex('brands_status_featured_sort_index');

            $table->dropUnique('brands_slug_unique');
            $table->dropIndex('brands_is_featured_index');
            $table->dropIndex('brands_status_index');

            $table->dropColumn([
                'name',
                'slug',
                'description',
                'logo',
                'website_url',
                'sort_order',
                'is_featured',
                'status',
            ]);
        });
    }
};
