<?php

namespace App\Services;

use App\Models\DomesticFeeTier;
use App\Models\Provider;

class DomesticComparisonService
{
    public function compare(int $amount, string $senderRegion, string $recipientRegion): array
    {
        $feeRegion = $this->mapToFeeRegion($recipientRegion);

        $providers = Provider::active()->domestic()
            ->where(function ($q) use ($senderRegion) {
                $q->whereHas('regions', fn ($r) => $r->where('region', $this->mapToFeeRegion($senderRegion)))
                  ->orWhere('is_nationwide', true);
            })
            ->with('regions')
            ->get();

        $results = [];

        foreach ($providers as $provider) {
            $tierRegion = $provider->is_nationwide ? 'nationwide' : $feeRegion;

            $tier = DomesticFeeTier::where('provider_id', $provider->id)
                ->where('region', $tierRegion)
                ->where('amount_from', '<=', $amount)
                ->where('amount_to', '>=', $amount)
                ->orderByDesc('effective_date')
                ->first();

            if ($tier) {
                $results[] = [
                    'provider' => $provider,
                    'fee' => $tier->fee,
                    'discount' => $tier->discount,
                    'net_fee' => $tier->net_fee,
                    'effective_date' => $tier->effective_date->toDateString(),
                ];
            }
        }

        usort($results, fn ($a, $b) => $a['net_fee'] <=> $b['net_fee']);

        return $results;
    }

    private function mapToFeeRegion(string $region): string
    {
        return match ($region) {
            'ncr', 'luzon' => 'ncr_luzon',
            'visayas', 'mindanao' => 'visayas_mindanao',
            default => 'ncr_luzon',
        };
    }
}
