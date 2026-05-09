<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provider extends Model
{
    /** @use HasFactory<\Database\Factories\ProviderFactory> */
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'logo_url', 'type', 'affiliate_url',
        'requires_account', 'has_affiliate', 'is_nationwide', 'is_active',
    ];

    protected $casts = [
        'requires_account' => 'boolean',
        'has_affiliate' => 'boolean',
        'is_nationwide' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function regions(): HasMany
    {
        return $this->hasMany(ProviderRegion::class);
    }

    public function feeTiers(): HasMany
    {
        return $this->hasMany(DomesticFeeTier::class);
    }

    public function internationalRates(): HasMany
    {
        return $this->hasMany(InternationalRate::class);
    }

    public function rateUpdateLogs(): HasMany
    {
        return $this->hasMany(RateUpdateLog::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDomestic($query)
    {
        return $query->where('type', 'domestic');
    }

    public function scopeInternational($query)
    {
        return $query->where('type', 'international');
    }
}
