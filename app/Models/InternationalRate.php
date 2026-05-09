<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternationalRate extends Model
{
    /** @use HasFactory<\Database\Factories\InternationalRateFactory> */
    use HasFactory;

    protected $fillable = [
        'provider_id', 'source_currency', 'target_currency',
        'exchange_rate', 'fee_fixed', 'fee_percent', 'fetched_at',
    ];

    protected $casts = [
        'exchange_rate' => 'decimal:6',
        'fee_fixed' => 'decimal:2',
        'fee_percent' => 'decimal:4',
        'fetched_at' => 'datetime',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
