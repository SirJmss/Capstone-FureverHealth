<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g. Grooming, Treatment, Check-up
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Optionally, you can insert default categories directly here
        DB::table('categories')->insert([
            [
                'name' => 'Grooming',
                'description' => 'Services related to pet grooming and hygiene.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Treatment',
                'description' => 'Medical and preventive treatments for pets.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Check-up',
                'description' => 'Routine health examinations for pets.',
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
        Schema::dropIfExists('categories');
    }
};
