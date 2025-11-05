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
            // User permissions
            "users.view",
            "users.create",
            "users.edit",
            "users.delete",

            // Role permissions
            "roles.view",
            "roles.create",
            "roles.edit",
            "roles.delete",

            // Appointment permissions
            "appointments.view",
            "appointments.create",
            "appointments.edit",
            "appointments.delete",

            // Access-level permissions
            "access.dashboard",
            "access.roles",
            "access.users",
            "access.appointments",
            "access.schedules",
            "access.permissions",
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

    }
}
