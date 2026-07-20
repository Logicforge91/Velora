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
        Schema::create('risk_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category', 50)->index();
            $table->text('description')->nullable();
            $table->json('conditions');
            $table->string('action', 50);
            $table->unsignedTinyInteger('risk_score')->default(0);
            $table->boolean('enabled')->default(true)->index();
            $table->unsignedInteger('matches_count')->default(0);
            $table->timestamp('last_matched_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['name', 'category']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('risk_rules');
    }
};
