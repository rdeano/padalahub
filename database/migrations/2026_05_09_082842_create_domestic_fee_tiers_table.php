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
        Schema::create('domestic_fee_tiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();
            $table->enum('region', ['ncr_luzon', 'visayas_mindanao', 'nationwide']);
            $table->unsignedInteger('amount_from');
            $table->unsignedInteger('amount_to');
            $table->unsignedInteger('fee');
            $table->unsignedInteger('discount')->default(0);
            $table->unsignedInteger('net_fee');
            $table->date('effective_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domestic_fee_tiers');
    }
};
