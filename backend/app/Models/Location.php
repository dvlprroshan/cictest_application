<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Weather;

class Location extends Model
{
    protected $fillable = ['name', 'latitude', 'longitude'];

    public function weather()
    {
        return $this->hasMany(Weather::class);
    }

    public function latestWeather()
    {
        return $this->hasOne(Weather::class)->latestOfMany();
    }
}
