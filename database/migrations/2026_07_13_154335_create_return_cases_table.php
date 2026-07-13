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
        Schema::create('return_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('customer_id')->constrained('users')->restrictOnDelete();
            $table->string('number')->unique();
            $table->string('type')->default('return')->index();
            $table->string('reason_code')->index();
            $table->text('reason_details')->nullable();
            $table->string('status')->default('requested')->index();
            $table->unsignedInteger('requested_quantity')->default(1);
            $table->decimal('refund_amount', 12, 2)->default(0);
            $table->string('resolution')->nullable();
            $table->string('reverse_carrier')->nullable();
            $table->string('tracking_number')->nullable()->unique();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('requested_at')->index();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'requested_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_cases');
    }
};
