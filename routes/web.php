<?php

use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AppointmentsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // === CLEAN: Use resource + only override if needed ===
    Route::resource('users', UserController::class);
    Route::resource('schedules', SchedulesController::class);
    Route::resource('appointments', AppointmentsController::class);

    // Optional: Only if you need custom names (not recommended)
    // Route::resource('users', UserController::class)->names([
    //     'create' => 'users.create',
    //     'store'  => 'users.store',
    //     'edit'   => 'users.edit',
    //     'show'   => 'users.show',
    //     'destroy'=> 'users.destroy',
    // ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';