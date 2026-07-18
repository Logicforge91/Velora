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
        Schema::table('addresses', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 30)->default('home')->index();
            $table->string('label', 60)->nullable();
            $table->string('recipient_name', 150);
            $table->string('phone', 20);
            $table->string('alternate_phone', 20)->nullable();
            $table->string('line_1', 255);
            $table->string('line_2', 255)->nullable();
            $table->string('landmark', 150)->nullable();
            $table->string('city', 100);
            $table->string('district', 100)->nullable();
            $table->string('state', 100);
            $table->string('state_code', 10)->nullable();
            $table->string('postal_code', 20)->index();
            $table->char('country_code', 2)->default('IN');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->text('delivery_instructions')->nullable();
            $table->boolean('is_default_shipping')->default(false);
            $table->boolean('is_default_billing')->default(false);
            $table->boolean('is_serviceable')->default(true)->index();
            $table->timestamp('verified_at')->nullable();
            $table->index(['user_id', 'is_default_shipping']);
            $table->index(['user_id', 'is_default_billing']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id', 'is_default_shipping']);
            $table->dropIndex(['user_id', 'is_default_billing']);
            $table->dropColumn([
                'user_id', 'type', 'label', 'recipient_name', 'phone',
                'alternate_phone', 'line_1', 'line_2', 'landmark', 'city',
                'district', 'state', 'state_code', 'postal_code',
                'country_code', 'latitude', 'longitude',
                'delivery_instructions', 'is_default_shipping',
                'is_default_billing', 'is_serviceable', 'verified_at',
            ]);
        });
    }
};
