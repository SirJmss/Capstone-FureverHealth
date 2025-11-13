<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('time_slots', function (Blueprint $table) {
            $table->id();
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('max_appointments')->default(3);
            $table->boolean('is_active')->default(true);
            $table->string('description')->nullable();
            $table->timestamps();
            
            // Prevent duplicate time slots
            $table->unique(['start_time', 'end_time']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('time_slots');
    }
};