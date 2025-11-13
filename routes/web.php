<?php

use App\Http\Controllers\{
    SchedulesController, UserController, PermissionController, PetController,
    AppointmentsController, RoleController, ServiceController,
    HistoryController, ReceiptController, DashboardController
};
use Illuminate\Support\Facades\{Route, Auth};
use Inertia\Inertia;

/* --------------------------------------------------------------
   GUEST: Welcome Page (both / and /welcome)
   -------------------------------------------------------------- */
Route::middleware('guest')->group(function () {
    Route::get('/', fn() => Inertia::render('Users/Welcome'))->name('home');
    Route::get('/welcome', fn() => Inertia::render('Users/Welcome'))->name('welcome');
});

/* --------------------------------------------------------------
   AUTHENTICATED: Dashboard & Resources
   -------------------------------------------------------------- */
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('schedules',   SchedulesController::class);
    Route::resource('appointments',AppointmentsController::class);
    Route::resource('roles',       RoleController::class);
    Route::resource('permissions',PermissionController::class);
    Route::resource('pets',        PetController::class);
    Route::resource('services',    ServiceController::class);
    Route::resource('history',     HistoryController::class);

    Route::resource('users', UserController::class)->middleware([
        'create,store' => 'permission:users.create',
        'edit,update'  => 'permission:users.edit',
        'destroy'     => 'permission:users.delete',
    ]);

    Route::post('/pets/modal-store', [PetController::class, 'modalStore'])
        ->name('pets.modal-store');

    Route::get('/appointments/{appointment}/receipt', [ReceiptController::class, 'generateReceipt'])
        ->name('appointments.receipt');

    Route::get('/appointments/{appointment}/receipt/view', [ReceiptController::class, 'viewReceipt'])
        ->name('appointments.receipt.view');
});

/* --------------------------------------------------------------
   Include auth & settings
   -------------------------------------------------------------- */
require __DIR__.'/auth.php';
require __DIR__.'/settings.php';