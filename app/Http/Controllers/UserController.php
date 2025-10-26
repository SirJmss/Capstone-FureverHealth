<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::with(['pets', 'appointments'])->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'phone'      => 'required|string|max:20',
            'password'   => 'required|string|min:8',
            'user_type'  => 'required|string',
        ]);

        // ✅ Hash password before saving
        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return to_route('users.index')->with('success', 'User created successfully!');
    }

    /**
     * Display the specified user.
     */
/**
 * Display the specified user.
 */
public function show(User $user)
{
    // Optionally load relations if needed in the Show page
    $user->load(['pets', 'appointments']);

    return Inertia::render('Users/Show', [
        'user' => $user
    ]);
}

    /**
     * Show the form for editing the specified user.
     */
    public function edit(string $id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, string $id)
    {
        // ✅ Fixed: Find user by ID
        $user = User::findOrFail($id);

        // ✅ Fixed: Proper validation rules and consistent field names
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name'  => 'sometimes|string|max:255',
            'email'      => 'sometimes|email|unique:users,email,' . $user->id,
            'phone'      => 'nullable|string|max:20',
            'address'    => 'nullable|string|max:255',
            'password'   => 'nullable|string|min:8',
            'user_type'  => 'nullable|string|in:admin,user',
        ]);

        // ✅ Hash password only if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // ✅ Update user with validated data
        $user->update($validated);

        return redirect()->route('users.index')->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified user.
     */
    /**
 * Remove the specified user.
 */
/**
 * Remove the specified user.
 */
public function destroy(String $id)
{
    User::destroy($id);
    return to_route('users.index');
}

    /**
     * Update the logged-in user's profile.
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }
}
