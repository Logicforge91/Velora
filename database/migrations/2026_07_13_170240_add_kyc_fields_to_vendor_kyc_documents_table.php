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
        if (! Schema::hasColumn('vendor_kyc_documents', 'vendor_id')) {
            Schema::table('vendor_kyc_documents', function (Blueprint $table) {
                $table->foreignId('vendor_id')->after('id')->constrained()->cascadeOnDelete();
                $table->string('type', 40)->after('vendor_id');
                $table->text('document_number')->nullable()->after('type');
                $table->string('file_path')->after('document_number');
                $table->string('original_name')->after('file_path');
                $table->string('mime_type', 100)->after('original_name');
                $table->unsignedBigInteger('size')->after('mime_type');
                $table->string('status', 20)->default('pending')->after('size');
                $table->text('rejection_reason')->nullable()->after('status');
                $table->date('expires_on')->nullable()->after('rejection_reason');
                $table->foreignId('uploaded_by')->nullable()->after('expires_on')->constrained('users')->nullOnDelete();
                $table->foreignId('reviewed_by')->nullable()->after('uploaded_by')->constrained('users')->nullOnDelete();
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
                $table->index(['vendor_id', 'status']);
                $table->unique(['vendor_id', 'type']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('vendor_kyc_documents', 'vendor_id')) {
            Schema::table('vendor_kyc_documents', function (Blueprint $table) {
                $table->dropForeign(['vendor_id']);
                $table->dropForeign(['uploaded_by']);
                $table->dropForeign(['reviewed_by']);
                $table->dropUnique(['vendor_id', 'type']);
                $table->dropIndex(['vendor_id', 'status']);
                $table->dropColumn(['vendor_id', 'type', 'document_number', 'file_path', 'original_name', 'mime_type', 'size', 'status', 'rejection_reason', 'expires_on', 'uploaded_by', 'reviewed_by', 'reviewed_at']);
            });
        }
    }
};
