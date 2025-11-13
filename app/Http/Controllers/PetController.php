<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    if (Auth::user()->hasRole(['Admin', 'Staff','Veterinarian', 'Pet Groomer'])) {
        $pets = Pet::with(['user'])
            ->latest()
            ->get();
    } else {
        // Regular users can only see their own pets
        $pets = Pet::with(['user'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();
    }

    return Inertia::render('Pets/Index', [
        'pets' => $pets,
    ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Pets/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'             => 'required|string|max:255',
            'species'          => 'required|string|max:100',
            'breed'            => 'nullable|string|max:100',
            'gender'           => 'nullable|string|in:male,female',
            'age'              => 'nullable|integer|min:0',
            'weight'           => 'nullable|numeric|min:0',
            'medical_history'  => 'nullable|string',
            'allergies'        => 'nullable|string',
            'vaccinated'       => 'boolean',
            'grooming_notes'   => 'nullable|string',
            'last_groomed_at'  => 'nullable|date',
        ]);

        $pet = Pet::create([
            'name' => $request->name,
            'species' => $request->species,
            'breed' => $request->breed,
            'gender' => $request->gender,
            'age' => $request->age,
            'weight' => $request->weight,
            'medical_history' => $request->medical_history,
            'allergies' => $request->allergies,
            'vaccinated' => $request->vaccinated,
            'grooming_notes' => $request->grooming_notes,
            'last_groomed_at' => $request->last_groomed_at,
            'user_id' => Auth::id(),
        ]);

        if($pet){
            return redirect()->route('pets.index')->with('success', 'Pet successfully created!');
        }
        return redirect()->back()->with('error', 'Pet creation failed.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pet = Pet::findOrFail($id);
        return Inertia::render('Pets/Show', [
            'pet' => $pet
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $pet = Pet::findOrFail($id);
        return Inertia::render('Pets/Edit', [
            'pet' => $pet
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pet = Pet::findOrFail($id);
         
        if($pet){
            $request->validate([
                'name'             => 'required|string|max:255',
                'species'          => 'required|string|max:100',
                'breed'            => 'nullable|string|max:100',
                'gender'           => 'nullable|string|in:male,female',
                'age'              => 'nullable|integer|min:0',
                'weight'           => 'nullable|numeric|min:0',
                'medical_history'  => 'nullable|string',
                'allergies'        => 'nullable|string',
                'vaccinated'       => 'boolean',
                'grooming_notes'   => 'nullable|string',
                'last_groomed_at'  => 'nullable|date',
            ]);

            $pet->update([
                'name' => $request->name,
                'species' => $request->species,
                'breed' => $request->breed,
                'gender' => $request->gender,
                'age' => $request->age,
                'weight' => $request->weight,
                'medical_history' => $request->medical_history,
                'allergies' => $request->allergies,
                'vaccinated' => $request->vaccinated,
                'grooming_notes' => $request->grooming_notes,
                'last_groomed_at' => $request->last_groomed_at,
            ]);

            return redirect()->route('pets.index')->with('success', 'Pet successfully updated!');
        }
        return redirect()->back()->with('error', 'Pet update failed.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pet = Pet::findOrFail($id);
        $pet->delete();

        return redirect()->route('pets.index')
                         ->with('success', 'Pet deleted successfully.');
    }

    public function modalStore(Request $request)
{
    $request->validate([
        'name'             => 'required|string|max:255',
        'species'          => 'required|string|max:100',
        'breed'            => 'nullable|string|max:100',
        'gender'           => 'nullable|string|in:male,female',
        'age'              => 'nullable|integer|min:0',
        'weight'           => 'nullable|numeric|min:0',
        'medical_history'  => 'nullable|string',
        'allergies'        => 'nullable|string',
        'vaccinated'       => 'boolean',
        'grooming_notes'   => 'nullable|string',
        'last_groomed_at'  => 'nullable|date',
    ]);

    $pet = Pet::create([
        'name' => $request->name,
        'species' => $request->species,
        'breed' => $request->breed,
        'gender' => $request->gender,
        'age' => $request->age,
        'weight' => $request->weight,
        'medical_history' => $request->medical_history,
        'allergies' => $request->allergies,
        'vaccinated' => $request->vaccinated ?? false,
        'grooming_notes' => $request->grooming_notes,
        'last_groomed_at' => $request->last_groomed_at,
        'user_id' => Auth::id(),
    ]);

    return response()->json([
        'pet' => $pet,
        'message' => 'Pet created successfully'
    ]);
}
    
}