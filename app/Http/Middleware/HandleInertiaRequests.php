<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Define the props that are shared by default with Inertia responses.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id'          => $request->user()->id,
                    'first_name'  => $request->user()->first_name,
                    'last_name'   => $request->user()->last_name,
                    'email'       => $request->user()->email,
                    'roles'       => $request->user()->roles->pluck('name')->toArray(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name')->toArray(),
                ] : null,
            ],
        ]);
    }
}
