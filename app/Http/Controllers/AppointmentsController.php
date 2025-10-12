<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Appointment;
use App\Models\Pet;
use App\Models\Staff;
use Illuminate\Http\Request;

class AppointmentsController extends Controller
{
    /**
     * Display a listing of the appointments.
     */
    public function index()
    {
        return Inertia::render('Appointments/Index', [
            'appointments' => Appointment::with(['pet', 'staff'])
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new appointment.
     */
    public function create()
    {
        return Inertia::render('Appointments/Create', [
            'pets' => Pet::select('id', 'name')->get(),
            'staffs' => Staff::select('id', 'firstname', 'lastname', 'role')->get(),
        ]);
    }

    /**
     * Store a newly created appointment in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'staff_id' => 'nullable|exists:staffs,id',
            'appointment_date' => 'required|date',
            'service_type' => 'required|string|max:255',
            'status' => 'required|in:pending,approved,completed,cancelled',
            'remarks' => 'nullable|string|max:500',
        ]);

        Appointment::create($validated);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment created successfully!');
    }

    /**
     * Display the specified appointment.
     */
    public function show($id)
    {
        $appointment = Appointment::with(['pet', 'staff'])->findOrFail($id);

        return Inertia::render('Appointments/Show', [
            'appointment' => $appointment,
        ]);
    }

    /**
     * Show the form for editing the specified appointment.
     */
    public function edit($id)
    {
        $appointment = Appointment::findOrFail($id);

        return Inertia::render('Appointments/Edit', [
            'appointment' => $appointment,
            'pets' => Pet::select('id', 'name')->get(),
            'staffs' => Staff::select('id', 'firstname', 'lastname')->get(),
        ]);
    }

    /**
     * Update the specified appointment in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'staff_id' => 'nullable|exists:staffs,id',
            'appointment_date' => 'required|date',
            'service_type' => 'required|string|max:255',
            'status' => 'required|in:pending,approved,completed,cancelled',
            'remarks' => 'nullable|string|max:500',
        ]);

        $appointment = Appointment::findOrFail($id);
        $appointment->update($validated);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment updated successfully!');
    }

    /**
     * Remove the specified appointment from storage.
     */
    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment deleted successfully!');
    }
}
