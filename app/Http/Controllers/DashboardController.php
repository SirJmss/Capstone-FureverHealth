<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers       = User::count();
        $newRegistrations = User::where('created_at', '>=', now()->subDays(30))->count();
        $activeUsers      = User::where('is_active', true)->count(); // ✅ replaced user_type check

        $recentUsers = User::latest()
            ->take(5)
            ->get(['id', 'first_name', 'last_name', 'email', 'phone', 'is_active', 'created_at'])
            ->map(fn($u) => [
                'id'         => $u->id,
                'first_name' => $u->first_name ?? '',
                'last_name'  => $u->last_name ?? '',
                'email'      => $u->email,
                'phone'      => $u->phone,
                'role'       => $u->getRoleNames()->first() ?? 'No Role', // ✅ show role instead of user_type
                'status'     => $u->is_active ? 'Active' : 'Inactive',
                'created_at' => $u->created_at?->format('M j, Y'),
            ]);

        // ✅ Group by role name instead of user_type
        $typeCounts = User::with('roles')
            ->get()
            ->groupBy(fn($user) => $user->getRoleNames()->first() ?? 'No Role')
            ->map->count()
            ->toArray();

        $dailyRegistrations = User::selectRaw('DATE(created_at) as d, COUNT(*) as c')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('d')
            ->orderBy('d')
            ->pluck('c', 'd')
            ->toArray();

        $monthlyUsers = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as m, COUNT(*) as c')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('m')
            ->orderBy('m')
            ->pluck('c', 'm')
            ->toArray();

        return Inertia::render('dashboard', [
            'totalUsers'        => $totalUsers,
            'newRegistrations'  => $newRegistrations,
            'activeUsers'       => $activeUsers,
            'recentUsers'       => $recentUsers,
            'typeCounts'        => $typeCounts,
            'dailyRegistrations'=> $dailyRegistrations,
            'monthlyUsers'      => $monthlyUsers,
        ]);
    }
}
