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
        Schema::create('integrations', function (Blueprint $table) {
            $table->id();
            $table->string('category')->unique();
            $table->string('provider')->nullable();
            $table->boolean('enabled')->default(false)->index();
            $table->json('configuration')->nullable();
            $table->text('credentials')->nullable();
            $table->string('status', 30)->default('disconnected')->index();
            $table->timestamp('last_configured_at')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integrations');
    }
};
