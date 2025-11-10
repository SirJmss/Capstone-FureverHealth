<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('category','user.roles')->get(); // Eager load user roles
        $categories = Category::all();
        $users = User::all();

        return inertia('Services/Index', [
            'services' => $services,
            'categories' => $categories,
            'users' => $users,
        ]);
    }

    public function create()
    {
        // Get users with their roles (eager load roles)
        $users = User::with('roles')->get();
        
        // Get categories
        $categories = Category::all();

        return inertia('Services/Create', [
            'users' => $users,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // Add role-based validation
        if ($validated['user_id'] && $validated['category_id']) {
            $user = User::with('roles')->findOrFail($validated['user_id']);
            $category = Category::findOrFail($validated['category_id']);
            
            $userRoleNames = $user->roles->pluck('name')->toArray();
            
            // Validate role-category assignment
            if (in_array('pet_groomer', $userRoleNames) && $category->name !== 'Grooming') {
                return redirect()->back()->withErrors([
                    'category_id' => 'Pet groomers can only be assigned to Grooming services.'
                ]);
            }
            
            if (in_array('veterinarian', $userRoleNames) && !in_array($category->name, ['Treatment', 'Check-up'])) {
                return redirect()->back()->withErrors([
                    'category_id' => 'Veterinarians can only be assigned to Treatment and Check-up services.'
                ]);
            }
        }

        Service::create($validated);

        return redirect()->route('services.index')->with('success', 'Service created successfully!');
    }

    public function show(Service $service)
    {
        $service->load('category', 'user.roles');
        
        return inertia('Services/Show', [
            'service' => $service,
        ]);
    }

    public function edit(Service $service)
    {
        $service->load('category', 'user.roles');
        $users = User::with('roles')->get();
        $categories = Category::all();

        return inertia('Services/Edit', [
            'service' => $service,
            'users' => $users,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // Add role-based validation for update as well
        if ($validated['user_id'] && $validated['category_id']) {
            $user = User::with('roles')->findOrFail($validated['user_id']);
            $category = Category::findOrFail($validated['category_id']);
            
            $userRoleNames = $user->roles->pluck('name')->toArray();
            
            // Validate role-category assignment
            if (in_array('pet_groomer', $userRoleNames) && $category->name !== 'Grooming') {
                return redirect()->back()->withErrors([
                    'category_id' => 'Pet groomers can only be assigned to Grooming services.'
                ]);
            }
            
            if (in_array('veterinarian', $userRoleNames) && !in_array($category->name, ['Treatment', 'Check-up'])) {
                return redirect()->back()->withErrors([
                    'category_id' => 'Veterinarians can only be assigned to Treatment and Check-up services.'
                ]);
            }
        }

        $service->update($validated);

        return redirect()->route('services.index')->with('success', 'Service updated successfully!');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('services.index')->with('success', 'Service deleted successfully!');
    }
}