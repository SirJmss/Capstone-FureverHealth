<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Pet;
use App\Models\User;
use App\Models\Service;
use App\Models\TimeSlot; // CHANGED: from Timeslot to TimeSlot
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AppointmentsController extends Controller
{
    public function index()
{
    if (Auth::user()->hasRole(['Admin', 'Staff','Veterinarian', 'Pet Groomer'])) {
        $schedules = Schedule::with(['appointment.user', 'appointment.pet', 'appointment.service', 'timeslot'])
            ->latest()
            ->get();
    } else {
        $schedules = Schedule::with(['appointment.user', 'appointment.pet', 'appointment.service', 'timeslot'])
            ->whereHas('appointment', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->latest()
            ->get();
    }

    return Inertia::render('Appointments/Index', [
        'schedules' => $schedules,
    ]);
}

  public function create()
{
    $user = auth()->user();
    
    // Using hasAnyRole for multiple roles
    $isAdminOrStaff = $user->hasAnyRole(['Admin', 'Staff']);
    
    // Get pets based on user role
    if ($isAdminOrStaff) {
        $pets = Pet::select('id', 'name', 'user_id')->get();
    } else {
        $pets = Pet::where('user_id', $user->id)->get();
    }
    
    // Get existing schedules to prevent frontend double-booking
    // ONLY include schedules with pending or confirmed appointments
    $existingSchedules = Schedule::where('date', '>=', now()->format('Y-m-d'))
        ->whereHas('appointment', function($query) {
            // ONLY count pending and confirmed appointments
            $query->whereIn('status', ['pending', 'confirmed']);
        })
        ->select('date', 'time_id')
        ->get()
        ->toArray();
    
    $data = [
        'pets' => $pets,
        'services' => Service::select('id', 'name', 'price')->get(),
        'timeslots' => TimeSlot::where('is_active', true)
            ->select('id', 'start_time', 'end_time', 'max_appointments', 'is_active', 'description')
            ->get(),
        'is_admin' => $isAdminOrStaff,
        'existing_schedules' => $existingSchedules, // Pass existing schedules for frontend validation
    ];
    
    if ($isAdminOrStaff) {
        $data['users'] = User::select('id', 'first_name', 'last_name')->get();
    }

    return Inertia::render('Appointments/Create', $data);
}
    public function store(Request $request)
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole('Admin');
        
        // If user is not admin, force the user_id to be the current user's ID
        if (!$isAdmin) {
            $request->merge(['user_id' => $user->id]);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'pet_id' => 'required|exists:pets,id',
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:today',
            'time_id' => 'required|exists:time_slots,id', // CHANGED: from timeslots to time_slots
            'status' => 'required|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
            'staff_remarks' => 'nullable|string',
            'payment_status' => 'required|in:unpaid,paid,refunded',
        ]);

        // Additional security check for regular users
        if (!$isAdmin) {
            $pet = Pet::findOrFail($validated['pet_id']);
            if ($pet->user_id !== $user->id) {
                return back()->withErrors(['pet_id' => 'You can only create appointments for your own pets.']);
            }
        }

        // Check if the timeslot is active
        $timeslot = TimeSlot::findOrFail($validated['time_id']); // CHANGED: from Timeslot to TimeSlot
        if (!$timeslot->is_active) {
            return back()->withErrors(['time_id' => 'The selected timeslot is not available.']);
        }

        // Check for schedule conflicts (same date and timeslot)
        $existingScheduleCount = Schedule::where('date', $validated['date'])
            ->where('time_id', $validated['time_id'])
            ->whereHas('appointment', function($query) {
                $query->whereIn('status', ['pending', 'confirmed']);
            })
            ->count();

        if ($existingScheduleCount >= $timeslot->max_appointments) {
            return back()->withErrors(['time_id' => 'This timeslot is fully booked for the selected date.']);
        }

        // Use transaction to ensure both appointment and schedule are created
        DB::transaction(function () use ($validated) {
            // Create the appointment
            $appointment = Appointment::create([
                'user_id' => $validated['user_id'],
                'pet_id' => $validated['pet_id'],
                'service_id' => $validated['service_id'],
                'status' => $validated['status'],
                'payment_status' => $validated['payment_status'],
                'notes' => $validated['notes'],
                'staff_remarks' => $validated['staff_remarks'],
            ]);

            // Create the schedule entry
            Schedule::create([
                'appointment_id' => $appointment->id,
                'time_id' => $validated['time_id'],
                'date' => $validated['date'],
                'status' => 'scheduled',
                'notes' => $validated['notes'],
            ]);
        });

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment created successfully!');
    }

    public function show($id)
    {
        $appointment = Appointment::with(['pet', 'user', 'service.user'])->findOrFail($id);
        $user = auth()->user();

        return Inertia::render('Appointments/Show', [
            'appointment' => $appointment,
        ]);
    }

    public function edit($id)
{
    $appointment = Appointment::with(['schedule'])->findOrFail($id);
    $user = auth()->user();
    $isAdmin = $user->hasRole('Admin');

    // Authorization check
    if (!$isAdmin && $appointment->user_id !== $user->id) {
        abort(403, 'Unauthorized action.');
    }

    // Get the schedule for this appointment
    $schedule = Schedule::where('appointment_id', $appointment->id)->first();

    // Get pets based on user role
    if ($isAdmin) {
        $pets = Pet::select('id', 'name', 'user_id')->get();
    } else {
        $pets = Pet::where('user_id', $user->id)->select('id', 'name', 'user_id')->get();
    }

    // Get existing schedules to prevent frontend double-booking 
    // ONLY include schedules with pending or confirmed appointments
    $existingSchedules = Schedule::where('date', '>=', now()->format('Y-m-d'))
        ->where('appointment_id', '!=', $id) // Exclude current appointment
        ->whereHas('appointment', function($query) {
            // ONLY count pending and confirmed appointments
            $query->whereIn('status', ['pending', 'confirmed']);
        })
        ->select('date', 'time_id')
        ->get()
        ->toArray();

    // Prepare appointment data with schedule information
    $appointmentData = [
        'id' => $appointment->id,
        'user_id' => $appointment->user_id,
        'pet_id' => $appointment->pet_id,
        'service_id' => $appointment->service_id,
        'date' => $schedule ? $schedule->date : null,
        'time_id' => $schedule ? $schedule->time_id : null,
        'status' => $appointment->status,
        'notes' => $appointment->notes,
        'staff_remarks' => $appointment->staff_remarks,
        'payment_status' => $appointment->payment_status,
        'schedule' => $schedule ? [
            'date' => $schedule->date,
            'time_id' => $schedule->time_id,
        ] : null,
    ];

    $data = [
        'appointment' => $appointmentData,
        'pets' => $pets,
        'services' => Service::select('id', 'name', 'price')->get(),
        'timeslots' => TimeSlot::where('is_active', true)
            ->select('id', 'start_time', 'end_time', 'max_appointments', 'is_active', 'description')
            ->get(),
        'is_admin' => $isAdmin,
        'existing_schedules' => $existingSchedules, // Pass existing schedules
    ];

    // Only load users if the current user is admin
    if ($isAdmin) {
        $data['users'] = User::select('id', 'first_name', 'last_name')->get();
    }

    return Inertia::render('Appointments/Edit', $data);
}

     public function update(Request $request, $id)
{
    $appointment = Appointment::findOrFail($id);
    $user = auth()->user();
    $isAdmin = $user->hasRole('Admin');

    // If user is not admin, ensure they can only update their own appointments
    if (!$isAdmin && $appointment->user_id !== $user->id) {
        abort(403, 'Unauthorized action.');
    }

    // If user is not admin, force the user_id to be the current user's ID
    if (!$isAdmin) {
        $request->merge(['user_id' => $user->id]);
    }

    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'pet_id' => 'required|exists:pets,id',
        'service_id' => 'required|exists:services,id',
        'date' => 'required|date|after_or_equal:today',
        'time_id' => 'required|exists:time_slots,id',
        'status' => 'required|in:pending,confirmed,completed,cancelled',
        'notes' => 'nullable|string',
        'staff_remarks' => 'nullable|string',
        'payment_status' => 'required|in:unpaid,paid,refunded',
    ]);

    // Additional security check for regular users
    if (!$isAdmin) {
        $pet = Pet::findOrFail($validated['pet_id']);
        if ($pet->user_id !== $user->id) {
            return back()->withErrors(['pet_id' => 'You can only update appointments for your own pets.']);
        }
    }

    // Check if the timeslot is active
    $timeslot = TimeSlot::findOrFail($validated['time_id']);
    if (!$timeslot->is_active) {
        return back()->withErrors(['time_id' => 'The selected timeslot is not available.']);
    }

    // Check for schedule conflicts (excluding the current appointment)
    $existingScheduleCount = Schedule::where('date', $validated['date'])
        ->where('time_id', $validated['time_id'])
        ->where('appointment_id', '!=', $id)
        ->whereHas('appointment', function($query) {
            $query->whereIn('status', ['pending', 'confirmed']);
        })
        ->count();

    if ($existingScheduleCount >= $timeslot->max_appointments) {
        return back()->withErrors(['time_id' => 'This timeslot is fully booked for the selected date.']);
    }

    // Use transaction to ensure data consistency
    DB::transaction(function () use ($appointment, $validated) {
        // Check if status is being changed to 'completed'
        $isCompleting = $appointment->status !== 'completed' && $validated['status'] === 'completed';
        $isCancelling = $appointment->status !== 'cancelled' && $validated['status'] === 'cancelled';
        
        // Update the appointment
        $appointment->update([
            'user_id' => $validated['user_id'],
            'pet_id' => $validated['pet_id'],
            'service_id' => $validated['service_id'],
            'status' => $validated['status'],
            'payment_status' => $validated['payment_status'],
            'notes' => $validated['notes'],
            'staff_remarks' => $validated['staff_remarks'],
        ]);

        // Find the existing schedule
        $schedule = Schedule::where('appointment_id', $appointment->id)->first();

        if ($validated['status'] === 'completed') {
            // If appointment is completed, update schedule status to 'completed' instead of deleting
            if ($schedule) {
                $schedule->update([
                    'status' => 'completed',
                    'notes' => $validated['notes'],
                ]);
            }
        } elseif ($validated['status'] === 'cancelled') {
            // If appointment is cancelled, update schedule status to 'cancelled'
            if ($schedule) {
                $schedule->update([
                    'status' => 'cancelled',
                    'notes' => $validated['notes'],
                ]);
            }
        } else {
            // For pending/confirmed appointments, update or create the schedule
            if ($schedule) {
                $schedule->update([
                    'time_id' => $validated['time_id'],
                    'date' => $validated['date'],
                    'status' => 'scheduled', // Reset to scheduled if status changed from completed/cancelled
                    'notes' => $validated['notes'],
                ]);
            } else {
                Schedule::create([
                    'appointment_id' => $appointment->id,
                    'time_id' => $validated['time_id'],
                    'date' => $validated['date'],
                    'status' => 'scheduled',
                    'notes' => $validated['notes'],
                ]);
            }
        }
    });

    return redirect()->route('appointments.index')
        ->with('success', 'Appointment updated successfully!');
}
    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $user = auth()->user();
        $isAdmin = $user->hasRole('Admin');

        // If user is not admin, ensure they can only delete their own appointments
        if (!$isAdmin && $appointment->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Use transaction to ensure both appointment and schedule are deleted
        DB::transaction(function () use ($appointment) {
            // Delete the schedule first
            Schedule::where('appointment_id', $appointment->id)->delete();
            // Then delete the appointment
            $appointment->delete();
        });

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment deleted successfully!');
    }

    // In your Appointment model

}