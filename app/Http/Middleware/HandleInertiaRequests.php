<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->first_name,
                    'email' => $request->user()->email,
                    'phone' => $request->user()->phone ?? null,
                    'roles' => $request->user()->roles->pluck('name')->toArray(),
                    'permissions' => $request->user()
                        ? $request->user()->getAllPermissions()->pluck('name')
                        : [],
                ] : null,
            ],

            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
