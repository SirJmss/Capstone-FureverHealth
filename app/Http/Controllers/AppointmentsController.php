<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Pet;
use App\Models\User;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppointmentsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole('Admin');
        
        $appointments = Appointment::with(['pet', 'user', 'service'])
            ->when(!$isAdmin, function ($query) use ($user) {
                // Regular users can only see their own appointments
                return $query->where('user_id', $user->id);
            })
            ->latest()
            ->get();

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole('Admin');
        
        // Get pets based on user role - THIS IS THE KEY FIX
        if ($isAdmin) {
            // Admins can see all pets
            $pets = Pet::select('id', 'name', 'user_id')->get();
        } else {
            // Regular users can only see their own pets
            $pets = Pet::where('user_id', $user->id)->select('id', 'name', 'user_id')->get();
        }
        
        $data = [
            'pets' => $pets,
            'services' => Service::select('id', 'name', 'price')->get(),
            'is_admin' => $isAdmin,
        ];
        
        // Only load users if the current user is admin
        if ($isAdmin) {
            $data['users'] = User::select('id', 'first_name', 'last_name')->get();
        }

        return Inertia::render('Appointments/Create', $data);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole('admin');
        
        // If user is not admin, force the user_id to be the current user's ID
        if (!$isAdmin) {
            $request->merge(['user_id' => $user->id]);
        }

        \Log::info('After admin check - user_id:', ['user_id' => $request->user_id]);
        
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'pet_id' => 'required|exists:pets,id',
            'service_id' => 'required|exists:services,id',
            'appointment_date' => 'required|date',
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
        
        Appointment::create($validated);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment created successfully!');
    }

    public function show($id)
    {
        $appointment = Appointment::with(['pet', 'user', 'service'])->findOrFail($id);
        $user = auth()->user();
        $isAdmin = $user->hasRole('Admin');

        // Authorization check
        if (!$isAdmin && $appointment->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Appointments/Show', [
            'appointment' => $appointment,
        ]);
    }

    public function edit($id)
    {
        $appointment = Appointment::findOrFail($id);
        $user = auth()->user();
        $isAdmin = $user->hasRole('Admin');

        // Authorization check
        if (!$isAdmin && $appointment->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Get pets based on user role
        if ($isAdmin) {
            $pets = Pet::select('id', 'name', 'user_id')->get();
        } else {
            $pets = Pet::where('user_id', $user->id)->select('id', 'name', 'user_id')->get();
        }

        $data = [
            'appointment' => $appointment,
            'pets' => $pets,
            'services' => Service::select('id', 'name', 'price')->get(),
            'is_admin' => $isAdmin,
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
            'appointment_date' => 'required|date',
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

        $appointment->update($validated);

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

        $appointment->delete();

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment deleted successfully!');
    }
}