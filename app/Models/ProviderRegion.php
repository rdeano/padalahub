<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProviderRegion extends Model
{
    /** @use HasFactory<\Database\Factories\ProviderRegionFactory> */
    use HasFactory;

    protected $fillable = ['provider_id', 'region'];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
