<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProviderController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Providers/Index', [
            'providers' => Provider::with('regions')->withCount('feeTiers')->orderBy('type')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'slug'             => 'required|string|max:255|unique:providers,slug',
            'type'             => 'required|in:domestic,international',
            'affiliate_url'    => 'nullable|url',
            'requires_account' => 'boolean',
            'has_affiliate'    => 'boolean',
            'is_nationwide'    => 'boolean',
            'is_active'        => 'boolean',
        ]);

        Provider::create($validated);

        return back()->with('success', 'Provider created.');
    }

    public function update(Request $request, Provider $provider)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'affiliate_url' => 'nullable|url',
            'is_active' => 'boolean',
        ]);

        $provider->update($validated);

        return back()->with('success', 'Provider updated.');
    }
}
