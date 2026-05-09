<?php

namespace App\Services;

use App\Models\InternationalRate;
use App\Models\Provider;

class InternationalComparisonService
{
    public function compare(float $amount, string $sourceCurrency, string $targetCurrency): array
    {
        $rates = InternationalRate::with('provider')
            ->whereHas('provider', fn ($q) => $q->active()->international())
            ->where('source_currency', strtoupper($sourceCurrency))
            ->where('target_currency', strtoupper($targetCurrency))
            ->orderByDesc('fetched_at')
            ->get()
            ->unique('provider_id');

        $results = [];

        foreach ($rates as $rate) {
            $recipientGets = ($amount - $rate->fee_fixed) * $rate->exchange_rate * (1 - $rate->fee_percent);

            if ($recipientGets > 0) {
                $results[] = [
                    'provider' => $rate->provider,
                    'exchange_rate' => (float) $rate->exchange_rate,
                    'fee_fixed' => (float) $rate->fee_fixed,
                    'fee_percent' => (float) $rate->fee_percent,
                    'recipient_gets' => round($recipientGets, 2),
                    'fetched_at' => $rate->fetched_at->toISOString(),
                ];
            }
        }

        usort($results, fn ($a, $b) => $b['recipient_gets'] <=> $a['recipient_gets']);

        return $results;
    }
}
