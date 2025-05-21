<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weather extends Model
{
    protected $fillable = ['location_id', 'temperature', 'humidity', 'wind_speed', 'precipitation'];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
