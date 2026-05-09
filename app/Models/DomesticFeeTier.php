<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DomesticFeeTier extends Model
{
    /** @use HasFactory<\Database\Factories\DomesticFeeTierFactory> */
    use HasFactory;

    protected $fillable = [
        'provider_id', 'region', 'amount_from', 'amount_to',
        'fee', 'discount', 'net_fee', 'effective_date',
    ];

    protected $casts = [
        'effective_date' => 'date',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
