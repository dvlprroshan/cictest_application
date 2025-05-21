<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Http;
use App\Models\Weather;
use Carbon\Carbon;

class WeatherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve latest weather for all locations
        $locations = Location::with('latestWeather')->get();
        $data = $locations->map(function ($loc) {
            return [
                'location_id' => $loc->id,
                'name' => $loc->name,
                'temperature' => optional($loc->latestWeather)->temperature,
                'humidity' => optional($loc->latestWeather)->humidity,
                'wind_speed' => optional($loc->latestWeather)->wind_speed,
                'precipitation' => optional($loc->latestWeather)->precipitation,
            ];
        });
        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $loc = Location::with('latestWeather')->findOrFail($id);
        return response()->json([
            'location_id' => $loc->id,
            'name' => $loc->name,
            'temperature' => optional($loc->latestWeather)->temperature,
            'humidity' => optional($loc->latestWeather)->humidity,
            'wind_speed' => optional($loc->latestWeather)->wind_speed,
            'precipitation' => optional($loc->latestWeather)->precipitation,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

   public function sync(Request $request)
    {
       $locations = Location::all();
       
        // foreach
        foreach ($locations as $location) {
            

        // Build query – include precipitation so the model column is filled
        $url = sprintf(
            'https://api.open-meteo.com/v1/forecast'
            .'?latitude=%s&longitude=%s'
            .'&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation'
            .'&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation',
            $location->latitude,
            $location->longitude,
        );

        $response = Http::retry(3, 500)
            ->get($url)
            ->throw()
            ->json();

        /* ----------------------------------------------------------
         | 1.  Upsert the *hourly* data (5 days, 120 rows)          |
         ----------------------------------------------------------*/
        $hours     = $response['hourly']['time']                ?? [];
        $temps     = $response['hourly']['temperature_2m']      ?? [];
        $humidity  = $response['hourly']['relative_humidity_2m']?? [];
        $winds     = $response['hourly']['wind_speed_10m']      ?? [];
        $precip    = $response['hourly']['precipitation']       ?? [];

        // Build an array of rows ready for DB insertion
        $records = [];
        foreach ($hours as $i => $isoTime) {
            $records[] = [
                'location_id'  => $location->id,
                'temperature'  => $temps[$i]     ?? null,
                'humidity'     => $humidity[$i]  ?? null,
                'wind_speed'   => $winds[$i]     ?? null,
                'precipitation'=> $precip[$i]    ?? null,
                'created_at'   => now(),
                'updated_at'   => now(),
            ];
        }

        // Upsert on (location_id, recorded_at) to avoid duplicates
        Weather::upsert(
            $records,
            ['location_id', 'updated_at'],   // unique-by
            ['temperature', 'humidity', 'wind_speed', 'precipitation', 'updated_at'] // fields to update
        );

        /* ----------------------------------------------------------
         | 2.  Also store the *current* snapshot so you can use     |
         |     $location->latestWeather right away.                 |
         ----------------------------------------------------------*/
        $current = $response['current'] ?? [];
        if ($current) {
            Weather::updateOrCreate(
                [
                    'location_id' => $location->id,
                    'updated_at' => Carbon::parse($current['time']),
                ],
                [
                    'temperature'   => $current['temperature_2m']          ?? null,
                    'humidity'      => $current['relative_humidity_2m']    ?? null,
                    'wind_speed'    => $current['wind_speed_10m']          ?? null,
                    'precipitation' => $current['precipitation']           ?? null,
                ],
            );
        }
    }

        return response()->json([
            'message'   => 'Weather data synchronised.',
            'inserted'  => count($records),
            'location'  => $location->name,
        ], 201);
    }

}
