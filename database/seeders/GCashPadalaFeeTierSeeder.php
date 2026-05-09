<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GCashPadalaFeeTierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provider = \App\Models\Provider::where('slug', 'gcash')->firstOrFail();

        // GCash Padala: fixed fee of ₱15 for any amount up to ₱50,000
        $tiers = [
            [1, 500, 10, 0],
            [501, 1000, 10, 0],
            [1001, 5000, 15, 0],
            [5001, 10000, 15, 0],
            [10001, 25000, 15, 0],
            [25001, 50000, 15, 0],
        ];

        foreach ($tiers as [$from, $to, $fee, $discount]) {
            \App\Models\DomesticFeeTier::updateOrCreate(
                ['provider_id' => $provider->id, 'region' => 'nationwide', 'amount_from' => $from, 'amount_to' => $to],
                ['fee' => $fee, 'discount' => $discount, 'net_fee' => $fee - $discount, 'effective_date' => '2024-01-01']
            );
        }
    }
}
