<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\Staff;

class SchedulesController extends Controller
{
    /**
     * Display a listing of all staff schedules.
     */
    public function index()
    {
        return Inertia::render('Schedules/Index', [
            // Get all schedules with their assigned staff
            'schedules' => Schedule::with('staff')->latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new schedule.
     */
    public function create()
    {
        return Inertia::render('Schedules/Create', [
            'staffs' => Staff::select('id', 'firstname', 'lastname', 'role')->get(),
        ]);
    }

    /**
     * Store a newly created schedule in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'staff_id' => 'required|exists:staffs,id',
            'schedule_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'status' => 'required|in:available,booked,on_leave',
            'remarks' => 'nullable|string|max:255',
        ]);

        Schedule::create($validated);

        return redirect()->route('schedules.index')
            ->with('success', 'Schedule created successfully!');
    }

    /**
     * Display the specified schedule.
     */
    public function show($id)
    {
        $schedule = Schedule::with('staff')->findOrFail($id);

        return Inertia::render('Schedules/Show', [
            'schedule' => $schedule,
        ]);
    }

    /**
     * Show the form for editing the specified schedule.
     */
    public function edit($id)
    {
        $schedule = Schedule::findOrFail($id);

        return Inertia::render('Schedules/Edit', [
            'schedule' => $schedule,
            'staffs' => Staff::select('id', 'firstname', 'lastname')->get(),
        ]);
    }

    /**
     * Update the specified schedule in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'staff_id' => 'required|exists:staffs,id',
            'schedule_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'status' => 'required|in:available,booked,on_leave',
            'remarks' => 'nullable|string|max:255',
        ]);

        $schedule = Schedule::findOrFail($id);
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
        $schedule->delete();

        return redirect()->route('schedules.index')
            ->with('success', 'Schedule deleted successfully!');
    }
}
