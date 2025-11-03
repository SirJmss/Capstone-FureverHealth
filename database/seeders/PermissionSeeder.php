<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission; 

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $permissions = [
            "users.view",
            "users.create",
            "users.edit",
            "users.delete",
            "roles.view",
            "roles.create",
            "roles.edit",
            "roles.delete",
            "appointments.view",
            "appointments.create",
            "appointments.edit",
            "appointments.delete",
            "access.dashboard",
            "access.roles",
            "access.users",
            "access.appointments",
            "access.schedules",
            "access.permissions",
            "access.dashboard"
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
    }
}
