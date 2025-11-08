<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Category;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('category')->get();
        $categories = Category::all();

        return inertia('Services/Index', [
            'services' => $services,
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
        ]);

        Service::create($validated);

        return redirect()->back()->with('success', 'Service created successfully!');
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $service->update($validated);

        return redirect()->back()->with('success', 'Service updated successfully!');
    }
}
