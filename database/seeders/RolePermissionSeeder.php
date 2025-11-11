<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear cached roles/permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Get all existing permissions (make sure PermissionSeeder runs first)
        $permissions = Permission::all();

        // Create roles if they don't exist
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $staff = Role::firstOrCreate(['name' => 'Staff']);
        $veterinarian = Role::firstOrCreate(['name' => 'Veterinarian']);
        $pet_groomer = Role::firstOrCreate(['name' => 'Pet Groomer']);
        $customer = Role::firstOrCreate(['name' => 'Customer']);

        // Assign permissions to Admin (all permissions)
        $admin->syncPermissions($permissions);

        // Assign limited permissions to Staff
        $staff->syncPermissions([
            'access.dashboard',
            'appointments.view',
            'appointments.create',
            'appointments.edit',  
            'access.schedules',
            'access.appointments',
            'access.pets',
            'pets.view',
            'pets.create',
            'pets.edit',
            'pets.delete',
            'services.view',
            'services.edit',
            'services.create',
            'access.history',
        ]);

        $pet_groomer->syncPermissions([
            'access.dashboard',
            'appointments.view',
            'appointments.edit',  
            'access.schedules',
            'access.appointments',
            'access.pets',
            'pets.view',
            'pets.edit',
            'access.history',

        ]);

        $veterinarian->syncPermissions([
            'access.dashboard',
            'appointments.view',
            'appointments.edit',  
            'access.schedules',
            'access.appointments',
            'access.pets',
            'pets.view',
            'pets.edit',
            'access.history',

        ]);

        $customer->syncPermissions([
            'appointments.view',
            'appointments.create',
            'appointments.edit',
            'access.schedules',
            'access.appointments',
            'access.pets',
            'access.services',
            'pets.view',
            'pets.create',
            'pets.edit',
        ]);

        $this->command->info('Roles and permissions successfully seeded!');
    }
}
