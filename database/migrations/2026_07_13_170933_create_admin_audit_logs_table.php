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
        Schema::create('admin_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('event_uuid')->unique();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('category', 50)->index();
            $table->string('action', 80)->index();
            $table->string('severity', 20)->default('info')->index();
            $table->string('description');
            $table->nullableMorphs('auditable');
            $table->string('route_name')->nullable()->index();
            $table->string('method', 10);
            $table->string('path', 500);
            $table->unsignedSmallInteger('response_status')->index();
            $table->boolean('succeeded')->index();
            $table->unsignedInteger('duration_ms')->default(0);
            $table->string('ip_address', 45)->nullable()->index();
            $table->text('user_agent')->nullable();
            $table->json('before_values')->nullable();
            $table->json('after_values')->nullable();
            $table->json('metadata')->nullable();
            $table->char('record_hash', 64)->unique();
            $table->timestamp('occurred_at')->index();
            $table->index(['category', 'occurred_at']);
            $table->index(['actor_id', 'occurred_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_audit_logs');
    }
};
