<?php

use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\AppointmentsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// === Default Laravel Welcome Page ===
Route::get('/', function () {
    return Inertia\Inertia::render('Welcome'); // Capital W, matches resources/js/Pages/Welcome.tsx
})->name('home');

// === Authenticated Routes ===
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('schedules', SchedulesController::class);
    Route::resource('appointments', AppointmentsController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
});

// === Other Required Route Files ===
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
