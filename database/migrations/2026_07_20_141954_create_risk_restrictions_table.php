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
        Schema::create('risk_restrictions', function (Blueprint $table) {
            $table->id();
            $table->string('type', 30)->index();
            $table->string('identifier')->index();
            $table->string('reason');
            $table->text('notes')->nullable();
            $table->boolean('active')->default(true)->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('released_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamp('released_at')->nullable();
            $table->timestamps();

            $table->unique(['type', 'identifier']);
            $table->index(['type', 'active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('risk_restrictions');
    }
};
