<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LBCFeeTierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provider = \App\Models\Provider::where('slug', 'lbc')->firstOrFail();

        $tiers = [
            [1, 500, 50, 0],
            [501, 1000, 75, 0],
            [1001, 2000, 100, 0],
            [2001, 3000, 125, 0],
            [3001, 5000, 150, 0],
            [5001, 10000, 200, 0],
            [10001, 20000, 275, 0],
            [20001, 30000, 350, 0],
            [30001, 50000, 450, 0],
        ];

        foreach (['ncr_luzon', 'visayas_mindanao'] as $region) {
            foreach ($tiers as [$from, $to, $fee, $discount]) {
                \App\Models\DomesticFeeTier::updateOrCreate(
                    ['provider_id' => $provider->id, 'region' => $region, 'amount_from' => $from, 'amount_to' => $to],
                    ['fee' => $fee, 'discount' => $discount, 'net_fee' => $fee - $discount, 'effective_date' => '2024-01-01']
                );
            }
        }
    }
}
