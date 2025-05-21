<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\WeatherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Authenticated user
    Route::post('/logout', [AuthController::class, 'logout']);

    // Location CRUD
    Route::apiResource('locations', LocationController::class);

    // Weather endpoints
    Route::get('/weather', [WeatherController::class, 'index']);
    Route::get('/weather/{location}', [WeatherController::class, 'show']);


    // Weather synchronization using https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41
    Route::post('/weather/sync', [WeatherController::class, 'sync']);

});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
