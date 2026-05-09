<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CebuanaFeeTierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provider = \App\Models\Provider::where('slug', 'cebuana')->firstOrFail();

        $ncrLuzonTiers = [
            [1, 500, 15, 0],
            [501, 1000, 25, 0],
            [1001, 2000, 40, 0],
            [2001, 3000, 55, 0],
            [3001, 4000, 70, 0],
            [4001, 5000, 85, 0],
            [5001, 6000, 100, 0],
            [6001, 7000, 115, 0],
            [7001, 8000, 125, 0],
            [8001, 9000, 135, 0],
            [9001, 10000, 145, 0],
            [10001, 15000, 165, 0],
            [15001, 20000, 210, 0],
            [20001, 30000, 260, 0],
            [30001, 50000, 310, 0],
        ];

        $visMinTiers = [
            [1, 500, 20, 0],
            [501, 1000, 32, 0],
            [1001, 2000, 47, 0],
            [2001, 3000, 62, 0],
            [3001, 4000, 77, 0],
            [4001, 5000, 92, 0],
            [5001, 6000, 112, 0],
            [6001, 7000, 128, 0],
            [7001, 8000, 143, 0],
            [8001, 9000, 158, 0],
            [9001, 10000, 168, 0],
            [10001, 15000, 195, 0],
            [15001, 20000, 240, 0],
            [20001, 30000, 285, 0],
            [30001, 50000, 355, 0],
        ];

        foreach (['ncr_luzon' => $ncrLuzonTiers, 'visayas_mindanao' => $visMinTiers] as $region => $tiers) {
            foreach ($tiers as [$from, $to, $fee, $discount]) {
                \App\Models\DomesticFeeTier::updateOrCreate(
                    ['provider_id' => $provider->id, 'region' => $region, 'amount_from' => $from, 'amount_to' => $to],
                    ['fee' => $fee, 'discount' => $discount, 'net_fee' => $fee - $discount, 'effective_date' => '2024-01-01']
                );
            }
        }
    }
}
