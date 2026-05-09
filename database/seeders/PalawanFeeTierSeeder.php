<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PalawanFeeTierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provider = \App\Models\Provider::where('slug', 'palawan')->firstOrFail();

        // Palawan Express fee tiers (NCR/Luzon)
        $ncrLuzonTiers = [
            [1, 500, 15, 0],
            [501, 1000, 25, 0],
            [1001, 2000, 35, 0],
            [2001, 3000, 50, 0],
            [3001, 4000, 65, 0],
            [4001, 5000, 80, 0],
            [5001, 6000, 95, 0],
            [6001, 7000, 110, 0],
            [7001, 8000, 120, 0],
            [8001, 9000, 130, 0],
            [9001, 10000, 140, 0],
            [10001, 15000, 160, 0],
            [15001, 20000, 200, 0],
            [20001, 30000, 250, 0],
            [30001, 50000, 300, 0],
        ];

        // Palawan Express fee tiers (Visayas/Mindanao)
        $visMinTiers = [
            [1, 500, 20, 0],
            [501, 1000, 30, 0],
            [1001, 2000, 45, 0],
            [2001, 3000, 60, 0],
            [3001, 4000, 75, 0],
            [4001, 5000, 90, 0],
            [5001, 6000, 110, 0],
            [6001, 7000, 125, 0],
            [7001, 8000, 140, 0],
            [8001, 9000, 155, 0],
            [9001, 10000, 165, 0],
            [10001, 15000, 190, 0],
            [15001, 20000, 230, 0],
            [20001, 30000, 280, 0],
            [30001, 50000, 350, 0],
        ];

        $this->seedTiers($provider->id, 'ncr_luzon', $ncrLuzonTiers);
        $this->seedTiers($provider->id, 'visayas_mindanao', $visMinTiers);
    }

    private function seedTiers(int $providerId, string $region, array $tiers): void
    {
        foreach ($tiers as [$from, $to, $fee, $discount]) {
            \App\Models\DomesticFeeTier::updateOrCreate(
                ['provider_id' => $providerId, 'region' => $region, 'amount_from' => $from, 'amount_to' => $to],
                ['fee' => $fee, 'discount' => $discount, 'net_fee' => $fee - $discount, 'effective_date' => '2024-01-01']
            );
        }
    }
}
