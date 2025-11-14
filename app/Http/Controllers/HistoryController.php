<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class HistoryController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $isAdminOrStaff = $user->hasAnyRole(['Admin', 'Staff', 'Veterinarian', 'Pet Groomer']);
        
        if ($isAdminOrStaff) {
            $appointments = Appointment::with(['user', 'pet', 'service', 'schedule.timeslot'])
                ->where('status', 'completed')
                ->orderBy('updated_at', 'desc')
                ->paginate(10);
        } else {
            $appointments = Appointment::with(['user', 'pet', 'service', 'schedule.timeslot'])
                ->where('user_id', $user->id)
                ->where('status', 'completed')
                ->orderBy('updated_at', 'desc')
                ->paginate(10);
        }

        return Inertia::render('History/Index', [
            'appointments' => $appointments,
            'is_admin' => $isAdminOrStaff,
        ]);
    }
}