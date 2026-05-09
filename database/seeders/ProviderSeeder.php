<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $providers = [
            [
                'name' => 'Palawan Express Pera Padala',
                'slug' => 'palawan',
                'type' => 'domestic',
                'affiliate_url' => null,
                'requires_account' => false,
                'has_affiliate' => false,
                'is_nationwide' => false,
                'is_active' => true,
                'regions' => ['ncr_luzon', 'visayas_mindanao'],
            ],
            [
                'name' => 'Cebuana Lhuillier',
                'slug' => 'cebuana',
                'type' => 'domestic',
                'affiliate_url' => null,
                'requires_account' => false,
                'has_affiliate' => false,
                'is_nationwide' => false,
                'is_active' => true,
                'regions' => ['ncr_luzon', 'visayas_mindanao'],
            ],
            [
                'name' => 'M Lhuillier',
                'slug' => 'mlhuillier',
                'type' => 'domestic',
                'affiliate_url' => null,
                'requires_account' => false,
                'has_affiliate' => false,
                'is_nationwide' => false,
                'is_active' => true,
                'regions' => ['ncr_luzon', 'visayas_mindanao'],
            ],
            [
                'name' => 'LBC',
                'slug' => 'lbc',
                'type' => 'domestic',
                'affiliate_url' => null,
                'requires_account' => false,
                'has_affiliate' => false,
                'is_nationwide' => false,
                'is_active' => true,
                'regions' => ['ncr_luzon', 'visayas_mindanao'],
            ],
            [
                'name' => 'GCash Padala',
                'slug' => 'gcash',
                'type' => 'domestic',
                'affiliate_url' => null,
                'requires_account' => true,
                'has_affiliate' => false,
                'is_nationwide' => true,
                'is_active' => true,
                'regions' => [],
            ],
        ];

        foreach ($providers as $data) {
            $regions = $data['regions'];
            unset($data['regions']);

            $provider = \App\Models\Provider::updateOrCreate(['slug' => $data['slug']], $data);

            foreach ($regions as $region) {
                \App\Models\ProviderRegion::updateOrCreate(
                    ['provider_id' => $provider->id, 'region' => $region]
                );
            }
        }
    }
}
