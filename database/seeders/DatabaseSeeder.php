<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            RolePermissionSeeder::class,
        ]);

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'first_name' => 'Admin',
                'last_name' => 'User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $staff = User::firstOrCreate(
            ['email' => 'staff@example.com'],
            [
                'first_name' => 'Staff',
                'last_name' => 'Member',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $veterinarian = User::firstOrCreate(
            ['email' => 'veterinarian@example.com'],
            [
                'first_name' => 'veterinarian',
                'last_name' => 'user',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $pet_groomer = User::firstOrCreate(
            ['email' => 'petgroomer@example.com'],
            [
                'first_name' => 'pet',
                'last_name' => 'groomer',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'first_name' => 'customer',
                'last_name' => 'User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if (!$admin->hasRole('Admin')) {
            $admin->assignRole('Admin');
        }

        if (!$staff->hasRole('Staff')) {
            $staff->assignRole('Staff');
        }

        if (!$pet_groomer->hasRole('Pet Groomer')) {
            $pet_groomer->assignRole('Pet Groomer');
        }

        if (!$veterinarian->hasRole('Veterinarian')) {
            $veterinarian->assignRole('Veterinarian');
        }

        if (!$customer->hasRole('Customer')) {
            $customer->assignRole('Customer');
        }
        $this->call([
            ServicesSeeder::class,
        ]);
    }
}
