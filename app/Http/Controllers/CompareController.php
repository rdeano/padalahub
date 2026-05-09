<?php

namespace App\Http\Controllers;

use App\Services\DomesticComparisonService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompareController extends Controller
{
    public function domestic(Request $request, DomesticComparisonService $service): Response
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:1|max:50000',
            'sender_region' => 'required|in:ncr,luzon,visayas,mindanao',
            'recipient_region' => 'required|in:ncr,luzon,visayas,mindanao',
        ]);

        $results = $service->compare(
            (int) $validated['amount'],
            $validated['sender_region'],
            $validated['recipient_region']
        );

        return Inertia::render('Compare/Domestic', [
            'results' => $results,
            'amount' => $validated['amount'],
            'senderRegion' => $validated['sender_region'],
            'recipientRegion' => $validated['recipient_region'],
        ]);
    }
}
