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
        Schema::create('pets', function (Blueprint $table) {
            $table->id();

            // Link pet to its owner (user)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Basic pet info
            $table->string('name');
            $table->string('species'); // e.g., Dog, Cat, Rabbit
            $table->string('breed')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->integer('age')->nullable(); // in years
            $table->float('weight')->nullable(); // in kilograms

            // Health info
            $table->text('medical_history')->nullable();
            $table->text('allergies')->nullable();
            $table->boolean('vaccinated')->default(false);

            // Grooming info
            $table->text('grooming_notes')->nullable();
            $table->date('last_groomed_at')->nullable();

            // Soft deletes and timestamps
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
