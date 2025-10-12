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
        Schema::create('staffs', function (Blueprint $table) {
            $table->id();

            // Relationship to users table (if staff have login accounts)
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->cascadeOnDelete();

            // Basic staff details
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();

            // Employment details
            $table->string('position')->nullable(); // e.g., Vet, Groomer, Receptionist
            $table->date('date_hired')->nullable();
            $table->decimal('salary', 10, 2)->nullable();

            // Work status and type
            $table->enum('employment_status', ['active', 'inactive', 'terminated'])
                  ->default('active')
                  ->index();

            $table->enum('role', ['admin', 'veterinarian', 'groomer', 'assistant', 'staff'])
                  ->default('staff')
                  ->index();

            // Optional profile picture
            $table->string('photo')->nullable();

            // Soft delete and timestamps
            $table->softDeletes(); // adds deleted_at
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staffs');
    }
};
