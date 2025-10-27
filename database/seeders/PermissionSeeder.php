<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission; // ✅ Added import for Permission model

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ✅ Fixed typo: variable should be $permissions (not $permisison)
        $permissions = [
            "user.view",
            "user.create",
            "user.edit",
            "user.delete",
            "roles.view",
            "roles.create",
            "roles.edit",
            "roles.delete",
        ]; // ✅ Added missing semicolon at the end of array

        // ✅ Fixed foreach loop syntax — it should use "as $permission"
        foreach ($permissions as $permission) {
            // ✅ Removed incorrect duplicate and broken line
            // ✅ Correctly create each permission using the Permission model
            Permission::firstOrCreate(['name' => $permission]);
        }
    }
}
