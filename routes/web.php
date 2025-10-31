<?php

use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\AppointmentsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome'); // Capital W
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // ONLY ONE DASHBOARD ROUTE
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('schedules', SchedulesController::class);
    Route::resource('appointments', AppointmentsController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';