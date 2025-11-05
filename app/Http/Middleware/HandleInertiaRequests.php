<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id'         => $request->user()->id,
                    'name'       => trim($request->user()->first_name . ' ' . $request->user()->last_name),
                    'first_name' => $request->user()->first_name,
                    'last_name'  => $request->user()->last_name,
                    'email'      => $request->user()->email,
                    'phone'      => $request->user()->phone,
                    'roles'      => $request->user()->roles->pluck('name')->toArray(),
                    'permissions'=> $request->user()->getAllPermissions()->pluck('name')->toArray(),
                ] : null,
            ],
        ]);
    }
}