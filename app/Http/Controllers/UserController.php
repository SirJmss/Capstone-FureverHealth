<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
   public function index()
{
    $users = User::with(['pets', 'appointments'])->get();
    $authUser = auth()->user();

    return Inertia::render('Users/Index', [
        'users' => $users,
        'auth' => [
            'user' => [
                'id' => $authUser->id,
                'roles' => $authUser->roles->pluck('name')->toArray(),
                'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
            ],
        ],
    ]);
}


    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => Role::pluck('name')->toArray(),
        ]);
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
            'user_type'  => 'required|in:admin,user',
            'roles'      => 'required|array|min:1',
            'roles.*'    => 'exists:roles,name',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        $user->syncRoles($validated['roles']);

        return to_route('users.index')->with('success', 'User created successfully!');
    }

    /**
     * Display a single user.
     */
    public function show(User $user)
    {
        $user->load('roles', 'permissions');
        $authUser = auth()->user();

        return Inertia::render('Users/Show', [
            'user' => $user,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'roles' => $authUser->roles->pluck('name')->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
        ]);
    }

    /**
     * Show the form for editing a user.
     */
    public function edit(User $user)
    {
        $allRoles = Role::all();
        $userRoles = $user->roles->pluck('name')->toArray();
        $authUser = auth()->user();

        return Inertia::render('Users/Edit', [
            'allRoles' => $allRoles,
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'user_type' => $user->user_type,
                'roles' => $userRoles,
            ],
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'roles' => $authUser->roles->pluck('name')->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
        ]);
    }

    /**
     * Update a user.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$user->id}",
            'roles' => 'required|array|min:1',
            'roles.*' => 'exists:roles,name',
        ]);

        $user->update($validated);
        $user->syncRoles($validated['roles']);

        return to_route('users.index')->with('success', 'User updated successfully!');
    }

    /**
     * Delete a user.
     */
    public function destroy(string $id)
    {
        User::destroy($id);
        return to_route('users.index');
    }

    /**
     * Update authenticated user's profile.
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
