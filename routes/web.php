<?php

use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\AppointmentsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

// === Redirect home to /login (or /dashboard if logged in) ===
Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard')
        : redirect()->route('login'); //  use redirect, not Inertia::render
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
    Route::resource('pets', PetController::class);
    Route::resource('services', ServiceController::class);
    Route::resource('history',HistoryController::class);

    Route::get('/appointments/{appointment}/receipt', [ReceiptController::class, 'generateReceipt'])
        ->name('appointments.receipt');
    Route::get('/appointments/{appointment}/receipt/view', [ReceiptController::class, 'viewReceipt'])
        ->name('appointments.receipt.view');


Route::resource('users', UserController::class)->middleware([
    'create,store' => 'permission:users.create',
    'edit,update'  => 'permission:users.edit',
    'destroy'     => 'permission:users.delete',
]);

    
});

// === Other Required Route Files ===
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
