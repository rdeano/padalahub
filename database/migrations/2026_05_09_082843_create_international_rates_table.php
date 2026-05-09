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
        Schema::create('international_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();
            $table->string('source_currency', 3);
            $table->string('target_currency', 3);
            $table->decimal('exchange_rate', 16, 6);
            $table->decimal('fee_fixed', 10, 2)->default(0);
            $table->decimal('fee_percent', 5, 4)->default(0);
            $table->timestamp('fetched_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('international_rates');
    }
};
