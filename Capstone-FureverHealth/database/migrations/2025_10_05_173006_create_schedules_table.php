<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       Schema::create('schedules', function (Blueprint $table) {
    $table->id();

    // foreign key to staffs
    $table->foreignId('user_id')
          ->constrained('users')
          ->cascadeOnDelete();

    $table->date('schedule_date');
    $table->time('start_time');
    $table->time('end_time');
    $table->enum('status', ['available', 'booked', 'on_leave'])->default('available');
    $table->string('remarks')->nullable();

    $table->timestamps();
});

    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
