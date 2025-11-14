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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Pet owner
            $table->foreignId('pet_id')->constrained()->onDelete('cascade');  // Pet
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
          // Status tracking
            $table->enum('status', [
                'pending',
                'confirmed',
                'completed',
                'cancelled'
            ])->default('pending');

            // Notes and remarks
            $table->text('notes')->nullable(); // Owner’s request or grooming notes
            $table->text('staff_remarks')->nullable(); // Groomer/vet remarks after service

            // Payment info (optional but useful)

            $table->enum('payment_status', [
                'unpaid',
                'paid',
                'refunded'
            ])->default('unpaid');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
