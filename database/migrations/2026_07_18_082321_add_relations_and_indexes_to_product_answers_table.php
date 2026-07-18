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
        Schema::table('product_answers', function (Blueprint $table) {
            $table->foreign('product_question_id')->references('id')->on('product_questions')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('vendor_id')->references('id')->on('vendors')->nullOnDelete();
            $table->index(['product_question_id', 'status']);
            $table->index(['vendor_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_answers', function (Blueprint $table) {
            $table->dropForeign(['product_question_id']);
            $table->dropForeign(['user_id']);
            $table->dropForeign(['vendor_id']);
            $table->dropIndex(['product_question_id', 'status']);
            $table->dropIndex(['vendor_id', 'status']);
        });
    }
};
