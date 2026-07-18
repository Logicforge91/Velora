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
        Schema::create('product_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->text('question');
            $table->string('status', 30)->default('pending');
            $table->unsignedInteger('answer_count')->default(0);
            $table->unsignedInteger('helpful_count')->default(0);
            $table->boolean('is_verified_purchase')->default(false);
            $table->timestamp('answered_at')->nullable();
            $table->timestamps();

            $table->index(['product_id', 'status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_questions');
    }
};
