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
        $activeUsers      = User::where('user_type', '!=', 'inactive')->count();

        $recentUsers = User::latest()
            ->take(5)
            ->get(['id', 'first_name', 'last_name', 'email', 'phone', 'user_type', 'created_at'])
            ->map(fn($u) => [
                'id'         => $u->id,
                'first_name' => $u->first_name ?? '',
                'last_name'  => $u->last_name ?? '',
                'email'      => $u->email,
                'phone'      => $u->phone,
                'user_type'  => $u->user_type ?? 'user',
                'created_at' => $u->created_at?->format('M j, Y'),
            ]);

        $typeCounts = User::groupBy('user_type')
            ->selectRaw('COALESCE(user_type, "user") as type, COUNT(*) as count')
            ->pluck('count', 'type')
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

        return Inertia::render('Dashboard', [
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