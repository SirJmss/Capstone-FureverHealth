<?php
// database/seeders/ServicesSeeder.php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ServicesSeeder extends Seeder
{
    public function run()
    {
        // Get the users that were created in DatabaseSeeder
        $veterinarianId = User::where('email', 'veterinarian@example.com')->value('id');
        $petgroomerId = User::where('email', 'petgroomer@example.com')->value('id');
        
        $groomingId = Category::where('name', 'Grooming')->value('id');
        $treatmentId = Category::where('name', 'Treatment')->value('id');
        $checkupId = Category::where('name', 'Check-up')->value('id');

        $services = [
             [
                'name' => 'Full Grooming',
                'description' => 'Complete grooming package including bath, haircut, ear cleaning, and nail trimming.',
                'price' => 600.00,
                'duration' => 90,
                'user_id' => $petgroomerId,
                'category_id' => $groomingId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bath and Blow Dry',
                'description' => 'Gentle shampoo bath and blow dry for pets of all sizes.',
                'price' => 300.00,
                'duration' => 45,
                'user_id' => $petgroomerId,
                'category_id' => $groomingId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nail Trimming',
                'description' => 'Quick and safe nail trimming for your pet.',
                'price' => 150.00,
                'duration' => 15,
                'user_id' => $petgroomerId,
                'category_id' => $groomingId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ear Cleaning',
                'description' => 'Deep ear cleaning to prevent infections and maintain hygiene.',
                'price' => 120.00,
                'duration' => 15,
                'user_id' => $petgroomerId,
                'category_id' => $groomingId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Treatment Services
            [
                'name' => 'Vaccination',
                'description' => 'Core and optional vaccines to protect pets from common diseases.',
                'price' => 800.00,
                'duration' => 30,
                'user_id' => $veterinarianId,
                'category_id' => $treatmentId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Deworming',
                'description' => 'Treatment for internal parasites to keep pets healthy.',
                'price' => 250.00,
                'duration' => 20,
                'user_id' => $veterinarianId,
                'category_id' => $treatmentId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Flea and Tick Treatment',
                'description' => 'Topical or oral treatment to eliminate fleas and ticks.',
                'price' => 350.00,
                'duration' => 30,
                'user_id' => $veterinarianId,
                'category_id' => $treatmentId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dental Cleaning',
                'description' => 'Oral cleaning and plaque removal to maintain healthy teeth and gums.',
                'price' => 1000.00,
                'duration' => 60,
                'user_id' => $veterinarianId,
                'category_id' => $treatmentId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Check-up Services
            [
                'name' => 'General Check-up',
                'description' => 'Basic health examination for pets including weight, temperature, and overall condition.',
                'price' => 400.00,
                'duration' => 25,
                'user_id' => $veterinarianId,
                'category_id' => $checkupId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Emergency Consultation',
                'description' => 'Immediate medical attention for urgent pet health issues.',
                'price' => 1200.00,
                'duration' => 45,
                'user_id' => $veterinarianId,
                'category_id' => $checkupId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
           
        ];

        foreach ($services as $service) {
            Service::firstOrCreate(
                ['name' => $service['name']],
                $service
            );
        }

        $this->command->info('Services seeded successfully!');
    }
}