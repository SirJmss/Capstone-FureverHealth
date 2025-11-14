<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\Appointment;
use App\Models\TimeSlot;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SchedulesController extends Controller
{
    /**
     * Display a listing of all schedules.
     */
    public function index()
    {
        $user = Auth::user();
        $today = now()->format('Y-m-d');

        // Base query with joins
        $query = Schedule::select(
                'schedules.*',
                'appointments.user_id as appointment_user_id',
                'appointments.pet_id',
                'appointments.service_id',
                'appointments.status as appointment_status',
                'appointments.payment_status',
                'appointments.notes as appointment_notes',
                'appointments.staff_remarks',
                'users.first_name as user_first_name',
                'users.last_name as user_last_name',
                'pets.name as pet_name',
                'services.name as service_name',
                'services.price as service_price',
                'service_users.first_name as service_provider_first_name',
                'service_users.last_name as service_provider_last_name',
                'time_slots.start_time',
                'time_slots.end_time',
                'time_slots.description as timeslot_description'
            )
            ->join('appointments', 'schedules.appointment_id', '=', 'appointments.id')
            ->join('users', 'appointments.user_id', '=', 'users.id')
            ->join('pets', 'appointments.pet_id', '=', 'pets.id')
            ->join('services', 'appointments.service_id', '=', 'services.id')
            ->join('users as service_users', 'services.user_id', '=', 'service_users.id') // Service provider
            ->join('time_slots', 'schedules.time_id', '=', 'time_slots.id')
            ->where('schedules.date', '>=', $today) // Only show current and future schedules
            ->orderBy('schedules.date', 'asc')
            ->orderBy('time_slots.start_time', 'asc');

        // If user is Veterinarian or Pet Groomer, show only their assigned schedules
        if ($user->hasRole(['Veterinarian', 'Pet Groomer'])) {
            $query->where('services.user_id', $user->id);
        }
        // If user is regular user, show only their own schedules
        elseif (!$user->hasRole(['Admin', 'Staff'])) {
            $query->where('appointments.user_id', $user->id);
        }
        // Admin and Staff can see all schedules

        $schedules = $query->get();

        return Inertia::render('Schedules/Index', [
            'schedules' => $schedules,
        ]);
    }

    /**
     * Show the form for creating a new schedule.
     */
    public function create()
    {
        $user = auth()->user();
        $isAdminOrStaff = $user->hasAnyRole(['Admin', 'Staff']);

        $data = [
            'appointments' => Appointment::with(['user', 'pet', 'service'])->get(),
            'timeslots' => TimeSlot::where('is_active', true)->get(),
        ];

        return Inertia::render('Schedules/Create', $data);
    }

    /**
     * Store a newly created schedule in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'time_id' => 'required|exists:time_slots,id',
            'date' => 'required|date|after_or_equal:today',
            'status' => 'required|in:scheduled,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        // Check for schedule conflicts
        $existingSchedule = Schedule::where('date', $validated['date'])
            ->where('time_id', $validated['time_id'])
            ->first();

        if ($existingSchedule) {
            return back()->withErrors(['time_id' => 'This timeslot is already booked for the selected date.']);
        }

        Schedule::create($validated);

        return redirect()->route('schedules.index')
            ->with('success', 'Schedule created successfully!');
    }

    /**
     * Display the specified schedule.
     */
    public function show($id)
    {
        $schedule = Schedule::select(
                'schedules.*',
                'appointments.user_id as appointment_user_id',
                'appointments.pet_id',
                'appointments.service_id',
                'appointments.status as appointment_status',
                'appointments.payment_status',
                'appointments.notes as appointment_notes',
                'appointments.staff_remarks',
                'users.first_name as user_first_name',
                'users.last_name as user_last_name',
                'pets.name as pet_name',
                'services.name as service_name',
                'services.price as service_price',
                'service_users.first_name as service_provider_first_name',
                'service_users.last_name as service_provider_last_name',
                'time_slots.start_time',
                'time_slots.end_time',
                'time_slots.description as timeslot_description'
            )
            ->join('appointments', 'schedules.appointment_id', '=', 'appointments.id')
            ->join('users', 'appointments.user_id', '=', 'users.id')
            ->join('pets', 'appointments.pet_id', '=', 'pets.id')
            ->join('services', 'appointments.service_id', '=', 'services.id')
            ->join('users as service_users', 'services.user_id', '=', 'service_users.id')
            ->join('time_slots', 'schedules.time_id', '=', 'time_slots.id')
            ->where('schedules.id', $id)
            ->firstOrFail();

        $user = auth()->user();

        // Authorization check
        if (!$user->hasRole(['Admin', 'Staff'])) {
            if ($user->hasRole(['Veterinarian', 'Pet Groomer'])) {
                // Service providers can only see schedules for their services
                if ($schedule->service_user_id !== $user->id) {
                    abort(403, 'Unauthorized action.');
                }
            } else {
                // Regular users can only see their own schedules
                if ($schedule->appointment_user_id !== $user->id) {
                    abort(403, 'Unauthorized action.');
                }
            }
        }

        return Inertia::render('Schedules/Show', [
            'schedule' => $schedule,
        ]);
    }

    /**
     * Show the form for editing the specified schedule.
     */
    public function edit($id)
    {
        $schedule = Schedule::with(['appointment', 'timeslot'])->findOrFail($id);
        $user = auth()->user();
        $isAdmin = $user->hasRole(['Admin', 'Staff']);

        // Authorization check
        if (!$isAdmin && $schedule->appointment->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Schedules/Edit', [
            'schedule' => $schedule,
            'appointments' => Appointment::with(['user', 'pet', 'service'])->get(),
            'timeslots' => TimeSlot::where('is_active', true)->get(),
        ]);
    }

    /**
     * Update the specified schedule in storage.
     */
    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);
        $user = auth()->user();
        $isAdmin = $user->hasRole(['Admin', 'Staff']);

        // Authorization check
        if (!$isAdmin && $schedule->appointment->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'time_id' => 'required|exists:time_slots,id',
            'date' => 'required|date|after_or_equal:today',
            'status' => 'required|in:scheduled,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        // Check for schedule conflicts (excluding current schedule)
        $existingSchedule = Schedule::where('date', $validated['date'])
            ->where('time_id', $validated['time_id'])
            ->where('id', '!=', $id)
            ->first();

        if ($existingSchedule) {
            return back()->withErrors(['time_id' => 'This timeslot is already booked for the selected date.']);
        }

        $schedule->update($validated);

        return redirect()->route('schedules.index')
            ->with('success', 'Schedule updated successfully!');
    }

    /**
     * Remove the specified schedule from storage.
     */
    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $user = auth()->user();
        $isAdmin = $user->hasRole(['Admin', 'Staff']);

        // Authorization check
        if (!$isAdmin && $schedule->appointment->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $schedule->delete();

        return redirect()->route('schedules.index')
            ->with('success', 'Schedule deleted successfully!');
    }
}