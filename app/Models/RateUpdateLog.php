<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RateUpdateLog extends Model
{
    protected $fillable = ['provider_id', 'type', 'status', 'notes'];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
