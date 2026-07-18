<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('inventory_id')->constrained()->cascadeOnDelete();
            $table->foreignId('seller_listing_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type', 40)->index();
            $table->integer('quantity');
            $table->unsignedInteger('before_quantity');
            $table->unsignedInteger('after_quantity');
            $table->nullableMorphs('reference');
            $table->string('reason', 255)->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('occurred_at')->useCurrent()->index();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['inventory_id', 'occurred_at']);
            $table->index(['type', 'occurred_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
