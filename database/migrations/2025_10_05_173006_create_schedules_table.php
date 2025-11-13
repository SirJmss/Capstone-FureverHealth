<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            
            // Foreign keys
            $table->foreignId('appointment_id')->constrained()->onDelete('cascade');
            $table->foreignId('time_id')->constrained('time_slots')->onDelete('cascade');
            
            // Core schedule data
            $table->date('date');
            $table->enum('status', ['scheduled', 'completed', 'cancelled', 'rescheduled'])->default('scheduled');
            $table->text('notes')->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Unique constraint to prevent double-booking
            // One time slot per date can only have one scheduled appointment
            $table->unique(['time_id', 'date', 'status'], 'unique_scheduled_time');
            
            // Index for better performance
            $table->index(['date', 'status']);
            $table->index(['appointment_id', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('schedules');
    }
};