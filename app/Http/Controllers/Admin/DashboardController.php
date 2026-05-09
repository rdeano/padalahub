<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $providers = \App\Models\Provider::withCount('feeTiers')->get();

        $stats = [
            'total_providers'  => $providers->count(),
            'active_providers' => $providers->where('is_active', true)->count(),
            'domestic_count'   => $providers->where('type', 'domestic')->count(),
            'total_fee_tiers'  => \App\Models\DomesticFeeTier::count(),
            'last_updated'     => \App\Models\DomesticFeeTier::max('updated_at'),
        ];

        $recentLogs = \App\Models\RateUpdateLog::with('provider')
            ->latest()
            ->limit(5)
            ->get();

        return \Inertia\Inertia::render('Admin/Dashboard', [
            'stats'      => $stats,
            'providers'  => $providers,
            'recentLogs' => $recentLogs,
        ]);
    }
}
