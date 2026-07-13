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
        if (! Schema::hasColumn('vendor_review_events', 'vendor_id')) {
            Schema::table('vendor_review_events', function (Blueprint $table) {
                $table->foreignId('vendor_id')->after('id')->constrained()->cascadeOnDelete();
                $table->foreignId('actor_id')->nullable()->after('vendor_id')->constrained('users')->nullOnDelete();
                $table->string('action', 50)->after('actor_id');
                $table->string('from_status', 30)->nullable()->after('action');
                $table->string('to_status', 30)->nullable()->after('from_status');
                $table->text('notes')->nullable()->after('to_status');
                $table->json('metadata')->nullable()->after('notes');
                $table->index(['vendor_id', 'created_at']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('vendor_review_events', 'vendor_id')) {
            Schema::table('vendor_review_events', function (Blueprint $table) {
                $table->dropForeign(['vendor_id']);
                $table->dropForeign(['actor_id']);
                $table->dropIndex(['vendor_id', 'created_at']);
                $table->dropColumn(['vendor_id', 'actor_id', 'action', 'from_status', 'to_status', 'notes', 'metadata']);
            });
        }
    }
};
