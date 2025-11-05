<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Clear any cached roles/permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Get all existing permissions (already seeded earlier)
        $permissions = Permission::all();

        // Create roles if they don't exist
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $staff = Role::firstOrCreate(['name' => 'Staff']);

        // Assign permissions to each role
        $admin->syncPermissions($permissions);

        $staff->syncPermissions([
            'appointments.view',
            'appointments.create',
            'access.schedules',
            'access.appointments',
        ]);

        $this->command->info(' Roles and permissions successfully seeded!');
    }
}
