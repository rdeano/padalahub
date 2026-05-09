<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DomesticRateController;
use App\Http\Controllers\Admin\ProviderController;
use App\Http\Controllers\CompareController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $providers = \App\Models\Provider::active()
        ->orderBy('type')
        ->orderBy('name')
        ->get(['id', 'name', 'slug', 'type']);

    return Inertia::render('Home', [
        'providers' => $providers,
    ]);
})->name('home');

Route::get('/ihambing', [CompareController::class, 'domestic'])->name('compare.domestic');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/providers', [ProviderController::class, 'index'])->name('providers.index');
    Route::post('/providers', [ProviderController::class, 'store'])->name('providers.store');
    Route::patch('/providers/{provider}', [ProviderController::class, 'update'])->name('providers.update');
    Route::get('/providers/{provider}/rates', [DomesticRateController::class, 'index'])->name('rates.domestic');
    Route::patch('/rates/{tier}', [DomesticRateController::class, 'update'])->name('rates.update');
});

require __DIR__.'/auth.php';
