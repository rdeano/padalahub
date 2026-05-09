<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DomesticRateController extends Controller
{
    public function index(\App\Models\Provider $provider)
    {
        $provider->load('feeTiers');

        return \Inertia\Inertia::render('Admin/Rates/Domestic', [
            'provider' => $provider,
            'tiers' => $provider->feeTiers()->orderBy('region')->orderBy('amount_from')->get(),
        ]);
    }

    public function update(Request $request, \App\Models\DomesticFeeTier $tier)
    {
        $validated = $request->validate([
            'fee' => 'required|integer|min:0',
            'discount' => 'required|integer|min:0',
            'effective_date' => 'required|date',
        ]);

        $validated['net_fee'] = $validated['fee'] - $validated['discount'];
        $tier->update($validated);

        return back()->with('success', 'Fee tier updated.');
    }
}
