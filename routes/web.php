<?php
use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppointmentsController;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource("users", UserController::class);
    Route::resource("schedules", SchedulesController::class);
    Route::resource("appointments", AppointmentsController::class);
    Route::get('/users/create',[UserController::class, 'create'])->name('user.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
