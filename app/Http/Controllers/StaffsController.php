<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Staffs;
use App\Models\Schedule;
use App\Models\Appointment;

class StaffsController extends Controller
{
    /**
     * Display a listing of all staff members.
     */
    public function index()
    {
        return Inertia::render('Staffs/Index', [
            'staffs' => Staffs::with(['schedules', 'appointments'])->latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new staff member.
     */
    public function create()
    {
        return Inertia::render('Staffs/Create');
    }

    /**
     * Store a newly created staff member in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:staffs,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'position' => 'required|string|max:100',
            'date_hired' => 'nullable|date',
            'salary' => 'nullable|numeric|min:0',
            'employment_status' => 'in:active,inactive,terminated',
            'role' => 'in:admin,veterinarian,groomer,assistant,staff',
        ]);

        Staffs::create($validated);

        return redirect()->route('staffs.index')
            ->with('success', 'Staff member added successfully!');
    }

    /**
     * Display the specified staff member with related info.
     */
    public function show($id)
    {
        $staff = Staffs::with(['schedules', 'appointments'])->findOrFail($id);

        return Inertia::render('Staffs/Show', [
            'staff' => $staff,
        ]);
    }

    /**
     * Show the form for editing a staff member.
     */
    public function edit($id)
    {
        $staff = Staffs::findOrFail($id);

        return Inertia::render('Staffs/Edit', [
            'staff' => $staff,
        ]);
    }

    /**
     * Update the specified staff member in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:staffs,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'position' => 'required|string|max:100',
            'date_hired' => 'nullable|date',
            'salary' => 'nullable|numeric|min:0',
            'employment_status' => 'in:active,inactive,terminated',
            'role' => 'in:admin,veterinarian,groomer,assistant,staff',
        ]);

        $staff = Staffs::findOrFail($id);
        $staff->update($validated);

        return redirect()->route('staffs.index')
            ->with('success', 'Staff member updated successfully!');
    }

    /**
     * Remove the specified staff member from storage.
     */
    public function destroy($id)
    {
        $staff = Staffs::findOrFail($id);
        $staff->delete();

        return redirect()->route('staffs.index')
            ->with('success', 'Staff member deleted successfully!');
    }
}
