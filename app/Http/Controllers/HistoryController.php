<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole('Admin') || $user->hasRole('Staff');

        // Get completed appointments
        $query = Appointment::with(['user', 'pet', 'service'])
            ->where('status', 'completed')
            ->orderBy('appointment_date', 'desc');

        // For non-admin users, only show their own appointments
        if (!$isAdmin) {
            $query->where('user_id', $user->id);
        }

        $appointments = $query->paginate(10);

        return Inertia::render('History/Index', [
            'appointments' => $appointments,
            'is_admin' => $isAdmin,
        ]);
    }
}