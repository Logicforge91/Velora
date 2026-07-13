<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vendors', function (Blueprint $table): void {
            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('business_name', 150);

            $table->string('business_email', 150)
                ->unique();

            $table->string('business_phone', 20)
                ->nullable();

            $table->string('tax_number', 100)
                ->nullable()
                ->unique();

            $table->text('address')
                ->nullable();

            $table->string('status', 30)
                ->default('pending')
                ->index();

            $table->text('rejection_reason')
                ->nullable();

            $table->timestamp('approved_at')
                ->nullable();

            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table): void {
            $table->dropForeign(['approved_by']);
            $table->dropForeign(['user_id']);

            $table->dropColumn([
                'user_id',
                'business_name',
                'business_email',
                'business_phone',
                'tax_number',
                'address',
                'status',
                'rejection_reason',
                'approved_at',
                'approved_by',
            ]);
        });
    }
};
