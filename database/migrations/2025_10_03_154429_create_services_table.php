<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');                
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2)->default(0.00); 
            $table->integer('duration')->nullable(); 
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade'); 
            $table->boolean('is_active')->default(true); 
            $table->timestamps();
        });

        // 🐾 Fetch category IDs
        $groomingId = DB::table('categories')->where('name', 'Grooming')->value('id');
        $treatmentId = DB::table('categories')->where('name', 'Treatment')->value('id');
        $checkupId   = DB::table('categories')->where('name', 'Check-up')->value('id');

        // 🧾 Insert default services
        DB::table('services')->insert([
            // Grooming Services
            [
                'name' => 'Full Grooming',
                'description' => 'Complete grooming package including bath, haircut, ear cleaning, and nail trimming.',
                'price' => 600.00,
                'duration' => 90,
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
                'category_id' => $checkupId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
